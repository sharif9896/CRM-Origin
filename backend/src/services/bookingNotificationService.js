const Appointment = require('../models/Appointment');
const Agent = require('../models/Agent');
const NotificationDelivery = require('../models/NotificationDelivery');
const Notification = require('../models/Notification');
const Property = require('../models/Property');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const sendWhatsApp = require('../utils/sendWhatsApp');

const shortError = error => String(error?.message || error || 'Delivery failed.').slice(0, 500);

const updateAppointmentStatus = async appointmentId => {
  const rows = await NotificationDelivery.find({ appointment: appointmentId }).select('status');
  let notificationStatus = 'skipped';
  if (rows.some(row => row.status === 'queued')) notificationStatus = 'queued';
  else if (rows.length && rows.every(row => row.status === 'sent')) notificationStatus = 'sent';
  else if (rows.some(row => row.status === 'sent')) notificationStatus = 'partial';
  else if (rows.some(row => row.status === 'failed')) notificationStatus = 'failed';
  await Appointment.findByIdAndUpdate(appointmentId, { notificationStatus });
  return notificationStatus;
};

const deliver = async delivery => {
  delivery.attempts += 1;
  delivery.lastAttemptAt = new Date();
  delivery.error = '';
  delivery.providerMessageId = '';
  if (!delivery.destination) {
    delivery.status = 'skipped';
    delivery.error = `${delivery.recipientType === 'owner' ? 'Property owner' : 'Agent'} ${delivery.channel} is missing.`;
  } else {
    try {
      const result = delivery.channel === 'email'
        ? await sendEmail({ to: delivery.destination, subject: delivery.subject, text: delivery.body })
        : await sendWhatsApp({ to: delivery.destination, text: delivery.body });
      delivery.status = result?.skipped ? 'skipped' : 'sent';
      delivery.providerMessageId = result?.providerMessageId || '';
      delivery.error = result?.error || '';
    } catch (error) {
      delivery.status = 'failed';
      delivery.error = shortError(error);
    }
  }
  await delivery.save();
  await updateAppointmentStatus(delivery.appointment);
  return delivery;
};

const notifyInApp = async ({ appointment, property, agent, requester }) => {
  const admins = await User.find({ role: 'admin', active: true }).select('_id');
  const recipients = new Set(admins.map(user => String(user._id)));
  if (agent?.user) recipients.add(String(agent.user));
  if (property.ownerRef) recipients.add(String(property.ownerRef));
  if (!recipients.size) return;
  const when = new Date(appointment.when).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
  await Notification.insertMany([...recipients].map(user => ({
    user,
    title: 'New property visit request',
    message: `${requester.name} requested ${property.name} on ${when}. Email: ${appointment.requesterEmail}; WhatsApp: ${appointment.requesterWhatsapp}.`,
    icon: 'icon-calendar-check-2',
    badgeClass: 'bg-primary-transparent text-primary',
  })));
};

const notifyVisitBooking = async (appointment, req) => {
  try {
    if (!appointment.propertyRef) return;
    const property = await Property.findById(appointment.propertyRef).populate('agentRef');
    if (!property) return;
    const agent = appointment.agentRef
      ? await Agent.findById(appointment.agentRef)
      : property.agentRef || (property.agent ? await Agent.findOne({ name: property.agent }) : null);
    const requester = { name: appointment.client || req.user.name, email: appointment.requesterEmail || req.user.email, whatsapp: appointment.requesterWhatsapp || req.user.phone || '' };
    const when = new Date(appointment.when).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' });
    const body = [
      `New visit request for ${property.name}`,
      `When: ${when}`,
      `Location: ${property.location}`,
      `Customer: ${requester.name}`,
      `Email: ${requester.email}`,
      `WhatsApp: ${requester.whatsapp}`,
      appointment.notes ? `Message: ${appointment.notes}` : '',
    ].filter(Boolean).join('\n');
    const recipients = [
      { type: 'owner', name: property.ownerName || 'Property owner', email: property.ownerEmail, whatsapp: property.ownerWhatsapp },
      { type: 'agent', name: agent?.name || property.agent || 'Listing agent', email: agent?.email || '', whatsapp: agent?.phone || '' },
    ];
    const documents = recipients.flatMap(recipient => [
      { appointment: appointment.id, property: property.id, requestedBy: req.user.id, recipientType: recipient.type, recipientName: recipient.name, channel: 'email', destination: recipient.email || '', subject: `Visit request: ${property.name}`, body },
      { appointment: appointment.id, property: property.id, requestedBy: req.user.id, recipientType: recipient.type, recipientName: recipient.name, channel: 'whatsapp', destination: recipient.whatsapp || '', body },
    ]);
    const deliveries = await NotificationDelivery.create(documents);
    appointment.notificationStatus = 'queued';
    await appointment.save();
    await notifyInApp({ appointment, property, agent, requester }).catch(error => {
      if (process.env.NODE_ENV !== 'test') console.error('In-app booking notification failed:', shortError(error));
    });
    await Promise.all(deliveries.map(deliver));
    appointment.notificationStatus = await updateAppointmentStatus(appointment.id);
  } catch (error) {
    await NotificationDelivery.updateMany(
      { appointment: appointment.id, status: 'queued' },
      { $set: { status: 'failed', error: shortError(error), lastAttemptAt: new Date() } },
    ).catch(() => undefined);
    appointment.notificationStatus = 'failed';
    await appointment.save().catch(() => undefined);
    if (process.env.NODE_ENV !== 'test') console.error('Booking notification failed:', shortError(error));
  }
};

module.exports = { notifyVisitBooking, deliver, updateAppointmentStatus };
