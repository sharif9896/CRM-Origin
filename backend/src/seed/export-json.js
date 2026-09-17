/**
 * Exports the exact same realistic dataset used by seed.js into plain .json files
 * under backend/seed-data/, one file per collection. Useful if you'd rather
 * import with `mongoimport` or MongoDB Compass instead of running the seed
 * script directly.
 *
 * Usage:
 *   node src/seed/export-json.js
 *
 * Then, per collection, e.g.:
 *   mongoimport --uri "mongodb://127.0.0.1:27017/react_crm" \
 *     --collection leads --file seed-data/leads.json --jsonArray
 *
 * Note: Dates are written as { "$date": "..." } (MongoDB Extended JSON) so
 * mongoimport parses them as real Date objects instead of strings — pass
 * --jsonArray (already shown above); no extra flag is needed for dates.
 * The `users` collection is exported with PLAINTEXT passwords (since hashing
 * only happens via the Mongoose pre-save hook) — prefer `npm run seed`
 * instead of importing users.json directly, unless you hash the password
 * yourself first.
 */
const fs = require("fs");
const path = require("path");
const { seedData } = require("./seed");

const outDir = path.join(__dirname, "../../seed-data");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// Convert JS Date instances to MongoDB Extended JSON { "$date": ISOString }
const toExtendedJson = (value) => {
  if (value instanceof Date) {
    return { $date: value.toISOString() };
  }
  if (Array.isArray(value)) {
    return value.map(toExtendedJson);
  }
  if (value && typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = toExtendedJson(v);
    }
    return out;
  }
  return value;
};

const files = {
  "users.json": seedData.users,
  "agents.json": seedData.agents,
  "leads.json": seedData.leads,
  "properties.json": seedData.properties,
  "customers.json": seedData.customers,
  "deals.json": seedData.deals,
  "invoices.json": seedData.invoices,
  "payments.json": seedData.payments,
  "appointments.json": seedData.appointments,
  "staff.json": seedData.staffMembers,
  "reviews.json": seedData.reviews,
  "taxonomies.json": seedData.taxonomies,
  "tours.json": seedData.tours,
  "transactions.json": seedData.transactions,
  "reimbursements.json": seedData.reimbursements,
  "reimbursement-types.json": seedData.reimbursementTypes,
  "audit-logs.json": seedData.auditLogs,
  "workspace-settings.json": [seedData.organization],
  // notificationTemplates has no `user` id yet (that's assigned at seed time
  // against a real inserted user), so it's exported as-is for reference.
  "notifications.json": seedData.notificationTemplates,
  // Chat participants are resolved from these emails to real User ObjectIds by
  // seed.js, so this export is a readable template rather than a mongoimport file.
  "chat-messages.json": seedData.chatTemplates,
};

for (const [filename, data] of Object.entries(files)) {
  const filePath = path.join(outDir, filename);
  fs.writeFileSync(filePath, JSON.stringify(toExtendedJson(data), null, 2));
  console.log(`Wrote ${data.length} records -> seed-data/${filename}`);
}

console.log(`\nDone. JSON files are in: ${outDir}`);
