const mongoose = require('mongoose');
const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../utils/ApiError');
const ChatMessage = require('../models/ChatMessage');
const User = require('../models/User');
const chatHub = require('../services/chatHub');

const internalRoles = ['admin', 'manager', 'senior-agent', 'agent', 'staff'];
const assistantRoles = ['customer', 'viewer'];
const userFields = 'name email role avatar active';

const requireMode = (user, expected) => {
  const allowed = expected === 'internal' ? internalRoles : assistantRoles;
  if (!allowed.includes(user.role)) throw new ApiError(`This chat is not available for the ${user.role} role.`, 403);
};

const cleanText = value => {
  if (typeof value !== 'string' || !value.trim()) throw new ApiError('Enter a message.', 400);
  const text = value.trim();
  if (text.length > 2000) throw new ApiError('Messages must be 2,000 characters or fewer.', 400);
  return text;
};

const populateMessage = message => message.populate([
  { path: 'sender', select: userFields },
  { path: 'recipient', select: userFields },
]);

const assistantReply = (message, name) => {
  const input = message.toLowerCase();
  if (/\b(hello|hi|hey|good morning|good evening)\b/.test(input)) return `Hello ${name}. How can I help with your property search today?`;
  if (/\b(appointment|visit|viewing|tour|schedule)\b/.test(input)) return 'Open Appointments or Manual Tour to request a viewing. Include your preferred property, date, and time.';
  if (/\b(buy|purchase|property|properties|home|house)\b/.test(input)) return 'You can explore available homes under Properties. Use the list, grid, or map view to compare location, price, and features.';
  if (/\b(rent|rental|lease)\b/.test(input)) return 'Open Properties and filter for For Rent listings. An agent can confirm availability and leasing requirements.';
  if (/\b(agent|advisor|person|human|support|contact)\b/.test(input)) return 'Open Agents to review the team. You can request an appointment with the agent handling your preferred property.';
  if (/\b(payment|invoice|receipt|refund)\b/.test(input)) return 'For billing questions, contact your assigned agent or workspace administrator and include the relevant invoice or payment reference.';
  if (/\b(password|login|account)\b/.test(input)) return 'You can update your password from Profile. If you cannot sign in, use Forgot Password on the login page.';
  if (/\b(thank|thanks)\b/.test(input)) return `You are welcome, ${name}. I am here whenever you need help.`;
  return 'I can help with properties, rentals, appointments, tours, agents, billing, and account access. Tell me which area you need.';
};

exports.stream = (req, res) => {
  if (![...internalRoles, ...assistantRoles].includes(req.user.role)) throw new ApiError('Chat is not available for this role.', 403);
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });
  res.flushHeaders();
  const unsubscribe = chatHub.subscribe(req.user.id, res);
  const heartbeat = setInterval(() => {
    if (!res.writableEnded) res.write(': heartbeat\n\n');
  }, 25000);
  req.on('close', () => {
    clearInterval(heartbeat);
    unsubscribe();
  });
};

exports.getContacts = asyncHandler(async (req, res) => {
  requireMode(req.user, 'internal');
  const contacts = await User.find({ _id: { $ne: req.user.id }, active: true, role: { $in: internalRoles } }).select(userFields).sort('name');
  const data = await Promise.all(contacts.map(async contact => {
    const pair = { channel: 'internal', $or: [{ sender: req.user.id, recipient: contact.id }, { sender: contact.id, recipient: req.user.id }] };
    const [lastMessage, unread] = await Promise.all([
      ChatMessage.findOne(pair).sort('-createdAt').select('text createdAt sender'),
      ChatMessage.countDocuments({ channel: 'internal', sender: contact.id, recipient: req.user.id, readAt: null }),
    ]);
    return { ...contact.toJSON(), online: chatHub.isOnline(contact.id), unread, lastMessage };
  }));
  res.json({ success: true, data });
});

exports.getMessages = asyncHandler(async (req, res) => {
  requireMode(req.user, 'internal');
  if (!mongoose.isValidObjectId(req.params.userId)) throw new ApiError('Invalid chat participant.', 400);
  const contact = await User.findOne({ _id: req.params.userId, active: true, role: { $in: internalRoles } });
  if (!contact) throw new ApiError('Chat participant not found.', 404);
  const messages = await ChatMessage.find({ channel: 'internal', $or: [
    { sender: req.user.id, recipient: contact.id },
    { sender: contact.id, recipient: req.user.id },
  ] }).sort('-createdAt').limit(100).populate('sender recipient', userFields);
  res.json({ success: true, data: messages.reverse() });
});

exports.sendMessage = asyncHandler(async (req, res) => {
  requireMode(req.user, 'internal');
  if (!mongoose.isValidObjectId(req.body.recipientId)) throw new ApiError('Select a valid recipient.', 400);
  if (String(req.body.recipientId) === req.user.id) throw new ApiError('Select another user.', 400);
  const recipient = await User.findOne({ _id: req.body.recipientId, active: true, role: { $in: internalRoles } });
  if (!recipient) throw new ApiError('Chat recipient not found.', 404);
  const message = await ChatMessage.create({ channel: 'internal', sender: req.user.id, recipient: recipient.id, text: cleanText(req.body.text) });
  await populateMessage(message);
  chatHub.publish([req.user.id, recipient.id], 'message', message.toJSON());
  res.status(201).json({ success: true, data: message });
});

exports.markRead = asyncHandler(async (req, res) => {
  requireMode(req.user, 'internal');
  if (!mongoose.isValidObjectId(req.params.userId)) throw new ApiError('Invalid chat participant.', 400);
  const readAt = new Date();
  await ChatMessage.updateMany({ channel: 'internal', sender: req.params.userId, recipient: req.user.id, readAt: null }, { $set: { readAt } });
  chatHub.publish([req.params.userId], 'read', { by: req.user.id, readAt });
  res.json({ success: true, data: { readAt } });
});

exports.getAssistantMessages = asyncHandler(async (req, res) => {
  requireMode(req.user, 'assistant');
  const messages = await ChatMessage.find({ channel: 'assistant', $or: [{ sender: req.user.id }, { recipient: req.user.id }] }).sort('-createdAt').limit(100).populate('sender recipient', userFields);
  res.json({ success: true, data: messages.reverse() });
});

exports.sendAssistantMessage = asyncHandler(async (req, res) => {
  requireMode(req.user, 'assistant');
  const text = cleanText(req.body.text);
  const [question, answer] = await ChatMessage.create([
    { channel: 'assistant', sender: req.user.id, text },
    { channel: 'assistant', recipient: req.user.id, text: assistantReply(text, req.user.name.split(' ')[0]), assistant: true, readAt: new Date() },
  ]);
  await Promise.all([populateMessage(question), populateMessage(answer)]);
  chatHub.publish([req.user.id], 'assistant', answer.toJSON());
  res.status(201).json({ success: true, data: [question, answer] });
});

exports.internalRoles = internalRoles;
exports.assistantRoles = assistantRoles;
