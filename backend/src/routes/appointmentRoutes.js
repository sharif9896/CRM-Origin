const Appointment = require("../models/Appointment");
const Property = require('../models/Property');
const buildCrudRouter = require("./buildCrudRouter");
const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../utils/ApiError');
const { notifyVisitBooking } = require('../services/bookingNotificationService');

const prepareBooking = asyncHandler(async (req, _res, next) => {
  const propertyId = req.body?.propertyRef;
  const isExternalVisitor = ['customer', 'viewer'].includes(req.user.role);
  if (isExternalVisitor && !propertyId) throw new ApiError('Select a property for the visit.', 400);

  let property;
  if (propertyId) {
    property = await Property.findById(propertyId);
    if (!property) throw new ApiError('The selected property no longer exists.', 404);
    req.body.propertyRef = property.id;
    req.body.location = property.location;
    req.body.title = req.body.title || `Visit: ${property.name}`;
    if (property.agentRef) req.body.agentRef = property.agentRef;
  }

  if (isExternalVisitor) {
    const digits = String(req.body.requesterWhatsapp || req.user.phone || '').replace(/[^\d]/g, '');
    if (!/^\d{8,15}$/.test(digits)) throw new ApiError('Enter your WhatsApp number with its country code.', 400);
    req.body.client = req.user.name;
    req.body.requesterRef = req.user.id;
    req.body.requesterEmail = req.user.email;
    req.body.requesterWhatsapp = `+${digits}`;
    req.body.status = 'Pending';
    if (req.user.phone !== req.body.requesterWhatsapp) {
      req.user.phone = req.body.requesterWhatsapp;
      await req.user.save({ validateModifiedOnly: true });
    }
  } else {
    req.body.requesterRef = req.body.requesterRef || req.user.id;
    req.body.requesterEmail = req.body.requesterEmail || req.user.email;
    req.body.requesterWhatsapp = req.body.requesterWhatsapp || req.user.phone || '';
    req.body.client = req.body.client || req.user.name;
  }
  next();
});

// Full CRUD (list/search/paginate, get one, create, update, delete, bulk-delete)
const router = buildCrudRouter(Appointment, {
  searchableFields: ["title", "client", "location"],
  beforeCreate: prepareBooking,
  afterCreate: notifyVisitBooking,
});

module.exports = router;
