/**
 * Seeds the development/staging database with the complete CRM dataset.
 *
 * Usage:
 *   npm run seed          Add the dataset to empty collections.
 *   npm run seed:refresh  Replace all CRM collections with this dataset.
 *   npm run seed:destroy  Clear all CRM collections.
 */
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "../../.env") });

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");
const Lead = require("../models/Lead");
const Property = require("../models/Property");
const Agent = require("../models/Agent");
const Customer = require("../models/Customer");
const Deal = require("../models/Deal");
const Invoice = require("../models/Invoice");
const Payment = require("../models/Payment");
const Appointment = require("../models/Appointment");
const Staff = require("../models/Staff");
const Review = require("../models/Review");
const Taxonomy = require("../models/Taxonomy");
const Tour = require("../models/Tour");
const Transaction = require("../models/Transaction");
const Reimbursement = require("../models/Reimbursement");
const ReimbursementType = require("../models/ReimbursementType");
const Notification = require("../models/Notification");
const ChatMessage = require("../models/ChatMessage");
const NotificationDelivery = require("../models/NotificationDelivery");
const Role = require("../models/Role");
const WorkspaceSettings = require("../models/WorkspaceSettings");
const AuditLog = require("../models/AuditLog");
const { ensureDefaultRoles } = require("../middleware/permissions");
const seedData = require("./dataset");

const allModels = [
  ChatMessage, NotificationDelivery, Notification, AuditLog, Reimbursement,
  ReimbursementType, Transaction, Tour, Taxonomy, Review, Staff, Appointment,
  Payment, Invoice, Deal, Customer, Property, Lead, Agent, WorkspaceSettings,
  Role, User,
];

const mapBy = (documents, key) => new Map(documents.map((document) => [document[key], document]));

const seedCollection = async (name, Model, data) => {
  const existingCount = await Model.countDocuments();
  if (existingCount) {
    console.log(`Skipping ${name} (already has ${existingCount} documents)`);
    return Model.find();
  }
  const documents = await Model.insertMany(data);
  console.log(`Seeded ${documents.length} ${name}`);
  return documents;
};

const seedUsers = async () => {
  const documents = [];
  let inserted = 0;
  for (const record of seedData.users) {
    const existing = await User.findOne({ email: record.email });
    if (existing) {
      documents.push(existing);
      continue;
    }
    // Create individually so the User password hashing hook runs.
    documents.push(await User.create(record));
    inserted += 1;
  }
  console.log(inserted ? `Seeded ${inserted} missing Users` : `Skipping Users (all ${seedData.users.length} login accounts exist)`);
  return documents;
};

const linkReferences = async ({ users, agents, staff, properties, customers, leads, deals, invoices, payments, appointments, reviews, tours, reimbursementTypes, reimbursements }) => {
  const usersByEmail = mapBy(users, "email");
  const usersByName = mapBy(users, "name");
  const agentsByName = mapBy(agents, "name");
  const customersByName = mapBy(customers, "name");
  const propertiesByName = mapBy(properties, "name");
  const invoicesByNumber = mapBy(invoices, "number");
  const typesByCategory = new Map(reimbursementTypes.map((type) => [`${type.kind}:${type.category}`, type]));

  await Promise.all(agents.map((agent) => {
    const user = usersByEmail.get(agent.email);
    return user ? Agent.updateOne({ _id: agent._id }, { $set: { user: user._id } }) : null;
  }));
  await Promise.all(staff.map((member) => {
    const user = usersByEmail.get(member.email);
    return user ? Staff.updateOne({ _id: member._id }, { $set: { user: user._id } }) : null;
  }));
  await Promise.all(properties.map((property) => {
    const agent = agentsByName.get(property.agent);
    const owner = usersByEmail.get(property.ownerEmail);
    const update = {};
    if (agent) update.agentRef = agent._id;
    if (owner) update.ownerRef = owner._id;
    return Object.keys(update).length ? Property.updateOne({ _id: property._id }, { $set: update }) : null;
  }));
  await Promise.all(leads.map((lead) => {
    const agent = agentsByName.get(lead.assignedTo);
    return agent ? Lead.updateOne({ _id: lead._id }, { $set: { assignedAgent: agent._id } }) : null;
  }));
  await Promise.all(deals.map((deal) => {
    const customer = customersByName.get(deal.customer);
    const property = propertiesByName.get(deal.title);
    const update = {};
    if (customer) update.customerRef = customer._id;
    if (property) update.propertyRef = property._id;
    return Deal.updateOne({ _id: deal._id }, { $set: update });
  }));
  await Promise.all(invoices.map((invoice) => {
    const customer = customersByName.get(invoice.client);
    return customer ? Invoice.updateOne({ _id: invoice._id }, { $set: { customerRef: customer._id } }) : null;
  }));
  await Promise.all(payments.map((payment) => {
    const invoice = invoicesByNumber.get(payment.invoice);
    return invoice ? Payment.updateOne({ _id: payment._id }, { $set: { invoiceRef: invoice._id } }) : null;
  }));
  await Promise.all(appointments.map((appointment) => {
    const property = properties.find((item) => appointment.title.includes(item.name) || appointment.location.includes(item.name));
    const agent = property ? agentsByName.get(property.agent) : null;
    const requester = usersByName.get(appointment.client);
    const update = {};
    if (property) update.propertyRef = property._id;
    if (agent) update.agentRef = agent._id;
    if (requester) update.requesterRef = requester._id;
    return Appointment.updateOne({ _id: appointment._id }, { $set: update });
  }));
  await Promise.all(reviews.map((review) => {
    const property = propertiesByName.get(review.property);
    return property ? Review.updateOne({ _id: review._id }, { $set: { propertyRef: property._id } }) : null;
  }));
  await Promise.all(tours.map((tour) => {
    const property = propertiesByName.get(tour.property);
    return property ? Tour.updateOne({ _id: tour._id }, { $set: { propertyRef: property._id } }) : null;
  }));
  await Promise.all(reimbursements.map((claim) => {
    const type = typesByCategory.get(`${claim.kind}:${claim.category}`);
    return type ? Reimbursement.updateOne({ _id: claim._id }, { $set: { typeRef: type._id } }) : null;
  }));
};

const seedNotifications = async (users) => {
  if (await Notification.countDocuments()) return console.log("Skipping Notifications (collection already has data)");
  const admin = users.find((user) => user.role === "admin") || users[0];
  if (!admin) return;
  await Notification.insertMany(seedData.notificationTemplates.map((notification, index) => ({
    ...notification,
    user: admin._id,
    read: index > 4,
  })));
  console.log(`Seeded ${seedData.notificationTemplates.length} Notifications`);
};

const seedChats = async (users) => {
  if (await ChatMessage.countDocuments()) return console.log("Skipping Chat Messages (collection already has data)");
  const usersByEmail = mapBy(users, "email");
  const messages = seedData.chatTemplates.map(({ senderEmail, recipientEmail, read, ...message }) => ({
    ...message,
    channel: "internal",
    sender: usersByEmail.get(senderEmail)?._id,
    recipient: usersByEmail.get(recipientEmail)?._id,
    readAt: read ? message.createdAt : null,
  })).filter((message) => message.sender && message.recipient);
  await ChatMessage.insertMany(messages);
  console.log(`Seeded ${messages.length} Chat Messages`);
};

const seedDeliveryHistory = async ({ users, agents, properties, appointments }) => {
  if (await NotificationDelivery.countDocuments()) return console.log("Skipping Notification Deliveries (collection already has data)");
  const requester = users.find((user) => user.role === "customer");
  const appointment = appointments.find((item) => item.client === requester?.name && item.propertyRef);
  if (!requester || !appointment) return console.log("Skipping Notification Deliveries (no linked customer appointment)");
  const property = properties.find((item) => String(item._id) === String(appointment.propertyRef));
  const agent = agents.find((item) => String(item._id) === String(appointment.agentRef));
  if (!property || !agent) return console.log("Skipping Notification Deliveries (appointment recipients are incomplete)");

  const body = `${requester.name} requested a visit to ${property.name} on ${appointment.when.toLocaleString("en-US")}.`;
  const common = { event: "visit-booked", appointment: appointment._id, property: property._id, requestedBy: requester._id, body, status: "sent", attempts: 1, lastAttemptAt: new Date() };
  const deliveries = [
    { ...common, recipientType: "owner", recipientName: property.ownerName, channel: "email", destination: property.ownerEmail, subject: `Visit request: ${property.name}`, providerMessageId: "seed-email-owner-001" },
    { ...common, recipientType: "owner", recipientName: property.ownerName, channel: "whatsapp", destination: property.ownerWhatsapp, providerMessageId: "seed-whatsapp-owner-001" },
    { ...common, recipientType: "agent", recipientName: agent.name, channel: "email", destination: agent.email, subject: `Visit request: ${property.name}`, providerMessageId: "seed-email-agent-001" },
    { ...common, recipientType: "agent", recipientName: agent.name, channel: "whatsapp", destination: agent.phone, providerMessageId: "seed-whatsapp-agent-001" },
  ];
  await NotificationDelivery.insertMany(deliveries);
  console.log(`Seeded ${deliveries.length} Notification Deliveries`);
};

const importData = async () => {
  await ensureDefaultRoles();
  await WorkspaceSettings.updateOne(
    { key: seedData.organization.key },
    { $setOnInsert: seedData.organization },
    { upsert: true },
  );

  const users = await seedUsers();
  const agents = await seedCollection("Agents", Agent, seedData.agents);
  const staff = await seedCollection("Staff", Staff, seedData.staffMembers);
  const properties = await seedCollection("Properties", Property, seedData.properties);
  const customers = await seedCollection("Customers", Customer, seedData.customers);
  const leads = await seedCollection("Leads", Lead, seedData.leads);
  const deals = await seedCollection("Deals", Deal, seedData.deals);
  const invoices = await seedCollection("Invoices", Invoice, seedData.invoices);
  const payments = await seedCollection("Payments", Payment, seedData.payments);
  const appointments = await seedCollection("Appointments", Appointment, seedData.appointments);
  const reviews = await seedCollection("Reviews", Review, seedData.reviews);
  const taxonomies = await seedCollection("Taxonomies", Taxonomy, seedData.taxonomies);
  const tours = await seedCollection("Tours", Tour, seedData.tours);
  await seedCollection("Transactions", Transaction, seedData.transactions);
  const reimbursementTypes = await seedCollection("Reimbursement Types", ReimbursementType, seedData.reimbursementTypes);
  const reimbursements = await seedCollection("Reimbursements", Reimbursement, seedData.reimbursements);
  await seedCollection("Audit Logs", AuditLog, seedData.auditLogs);

  await linkReferences({ users, agents, staff, properties, customers, leads, deals, invoices, payments, appointments, reviews, tours, reimbursementTypes, reimbursements });

  // Reload linked records because updateOne does not mutate the documents in memory.
  const linkedProperties = await Property.find();
  const linkedAppointments = await Appointment.find();
  await seedNotifications(users);
  await seedChats(users);
  await seedDeliveryHistory({ users, agents, properties: linkedProperties, appointments: linkedAppointments });

  console.log("\nSeed complete. Login accounts:");
  for (const user of seedData.users) {
    console.log(`${user.role.padEnd(13)} -> ${user.email.padEnd(31)} / ${user.password}`);
  }
};

const destroyData = async () => {
  for (const Model of allModels) {
    await Model.deleteMany();
    console.log(`Cleared ${Model.modelName}`);
  }
};

module.exports.seedData = seedData;
module.exports.importData = importData;
module.exports.destroyData = destroyData;

if (require.main === module) {
  (async () => {
    try {
      await connectDB();
      if (process.argv.includes("--destroy")) {
        await destroyData();
        console.log("\nAll CRM collections cleared.");
      } else {
        if (process.argv.includes("--replace")) {
          console.log("Replacing existing CRM seed data...");
          await destroyData();
        }
        await importData();
      }
      await mongoose.disconnect();
      process.exit(0);
    } catch (error) {
      console.error(`Seed failed: ${error.message}`);
      await mongoose.disconnect().catch(() => undefined);
      process.exit(1);
    }
  })();
}
