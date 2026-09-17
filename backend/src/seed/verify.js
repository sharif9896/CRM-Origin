/** Read-only verification for the CRM seed dataset. */
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "../../.env") });

const mongoose = require("mongoose");

const modelNames = [
  "User", "Agent", "Staff", "Property", "Customer", "Lead", "Deal",
  "Invoice", "Payment", "Appointment", "Review", "Taxonomy", "Tour",
  "Transaction", "ReimbursementType", "Reimbursement", "Notification",
  "ChatMessage", "NotificationDelivery", "AuditLog", "Role", "WorkspaceSettings",
];
const expectedMinimums = {
  User: 7, Agent: 8, Staff: 12, Property: 18, Customer: 16, Lead: 18,
  Deal: 16, Invoice: 12, Payment: 10, Appointment: 12, Review: 12,
  Taxonomy: 16, Tour: 8, Transaction: 18, ReimbursementType: 10,
  Reimbursement: 10, Notification: 8, ChatMessage: 8,
  NotificationDelivery: 4, AuditLog: 6, Role: 6, WorkspaceSettings: 1,
};

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const models = Object.fromEntries(modelNames.map((name) => [name, require(`../models/${name}`)]));
  const counts = {};
  for (const name of modelNames) counts[name] = await models[name].countDocuments();

  const properties = await models.Property.find({ name: { $in: [
    "Pacific Crest Villa", "Marina Sky Penthouse", "Oak & Laurel Residence",
    "Wilshire Executive Offices", "Silver Lake Garden Loft", "Bel Air Modern Estate",
    "Arts District Live-Work Loft", "Santa Monica Courtyard Home",
    "Hollywood Hills View House", "Beverly Grove Townhome", "Ocean Avenue Residence",
    "Culver Creative Campus", "Manhattan Beach Retreat", "Echo Park Terrace Apartment",
    "Century City Corner Suite", "Venice Canal Bungalow", "Downtown Skyline Penthouse",
    "Brentwood Family Residence",
  ] } }).lean();

  const checks = {
    counts,
    seededPropertiesWithFourImages: properties.filter((property) =>
      property.image.startsWith("https://images.unsplash.com/") &&
      property.images.length === 4 &&
      property.images[0] === property.image,
    ).length,
    seededPropertiesLinkedToAgents: properties.filter((property) => property.agentRef).length,
    linkedSeedDeals: await models.Deal.countDocuments({ title: { $in: properties.map((property) => property.name) }, customerRef: { $ne: null }, propertyRef: { $ne: null } }),
    linkedSeedReviews: await models.Review.countDocuments({ property: { $in: properties.map((property) => property.name) }, propertyRef: { $ne: null } }),
    seededUsersWithRemoteAvatars: await models.User.countDocuments({ email: { $in: [
      "admin@realestate.com", "manager@realestate.com", "senior.agent@realestate.com",
      "jennifer@realestate.com", "staff@realestate.com", "viewer@realestate.com",
      "customer@realestate.com",
    ] }, avatar: /^https:\/\/images\.unsplash\.com\// }),
    seededInvoicesWithItems: await models.Invoice.countDocuments({ number: /^INV-26/, "items.0": { $exists: true } }),
  };

  const failures = Object.entries(expectedMinimums)
    .filter(([name, minimum]) => counts[name] < minimum)
    .map(([name, minimum]) => `${name}: expected at least ${minimum}, found ${counts[name]}`);
  if (checks.seededPropertiesWithFourImages !== 18) failures.push("The 18 seeded properties do not all have a matching cover and four-image gallery.");
  if (checks.seededPropertiesLinkedToAgents !== 18) failures.push("The 18 seeded properties are not all linked to agents.");
  if (checks.linkedSeedDeals !== 16) failures.push("The 16 seeded deals are not fully linked to customers and properties.");
  if (checks.linkedSeedReviews !== 12) failures.push("The 12 seeded reviews are not fully linked to properties.");
  if (checks.seededUsersWithRemoteAvatars !== 7) failures.push("The seven login accounts do not all have remote profile images.");
  if (checks.seededInvoicesWithItems !== 12) failures.push("The 12 seeded invoices do not all contain line items.");

  console.log(JSON.stringify(checks, null, 2));
  if (failures.length) throw new Error(`Seed verification failed:\n- ${failures.join("\n- ")}`);
  console.log("Seed verification passed.");

  if (process.argv.includes("--drop-temporary")) {
    const databaseName = mongoose.connection.name;
    if (!databaseName.startsWith("crm_seed_verification_")) {
      throw new Error(`Refusing to drop non-verification database: ${databaseName}`);
    }
    await mongoose.connection.dropDatabase();
    console.log(`Dropped temporary database ${databaseName}.`);
  }
  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error(error.message);
  await mongoose.disconnect().catch(() => undefined);
  process.exit(1);
});
