const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const fs = require('fs/promises');
const path = require('path');
const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../utils/ApiError');
const { protect } = require('../middleware/auth');
const { getPermissions } = require('../middleware/permissions');

const router = express.Router();
const allowedResources = new Set(['properties', 'customers', 'agents', 'staff']);
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 10 },
  fileFilter: (req, file, callback) => callback(null, ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.mimetype)),
});

const detectImage = buffer => {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return { extension: 'jpg', type: 'image/jpeg' };
  if (buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return { extension: 'png', type: 'image/png' };
  if (buffer.length >= 6 && ['GIF87a', 'GIF89a'].includes(buffer.subarray(0, 6).toString('ascii'))) return { extension: 'gif', type: 'image/gif' };
  if (buffer.length >= 12 && buffer.subarray(0, 4).toString('ascii') === 'RIFF' && buffer.subarray(8, 12).toString('ascii') === 'WEBP') return { extension: 'webp', type: 'image/webp' };
  return null;
};

router.post('/images', protect, upload.array('images', 10), asyncHandler(async (req, res) => {
  const resource = String(req.body.resource || '');
  if (!allowedResources.has(resource)) throw new ApiError('Select a valid image destination.', 400);
  const permissions = await getPermissions(req.user.role);
  if (!permissions.includes('*') && !permissions.includes(`${resource}:create`) && !permissions.includes(`${resource}:update`)) throw new ApiError('You do not have permission to upload images for this module.', 403);
  if (!req.files?.length) throw new ApiError('Choose at least one JPG, PNG, WebP, or GIF image.', 400);

  const validated = req.files.map(file => ({ file, detected: detectImage(file.buffer) }));
  if (validated.some(item => !item.detected)) throw new ApiError('One of the selected files is not a valid supported image.', 400);

  const directory = path.resolve(__dirname, '../../uploads', resource);
  await fs.mkdir(directory, { recursive: true });
  const data = [];
  for (const { file, detected } of validated) {
    const filename = `${Date.now()}-${crypto.randomUUID()}.${detected.extension}`;
    await fs.writeFile(path.join(directory, filename), file.buffer, { flag: 'wx' });
    data.push({ url: `/uploads/${resource}/${filename}`, name: file.originalname, size: file.size, type: detected.type });
  }
  res.status(201).json({ success: true, data });
}));

module.exports = router;
