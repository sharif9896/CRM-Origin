const mongoose = require("mongoose");

const invoiceItemSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    quantity: { type: Number, min: 1, default: 1 },
    unitPrice: { type: Number, min: 0, default: 0 },
    total: { type: Number, min: 0, default: 0 },
    tax: { type: Number, min: 0, max: 100, default: 0 },
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    number: { type: String, required: true, unique: true, trim: true },
    client: { type: String, required: true, trim: true },
    customerRef: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    issueDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    items: [invoiceItemSchema],
    amount: { type: Number, required: true, default: 0 },
    status: {
      type: String,
      enum: ["Paid", "Pending", "Overdue", "Draft"],
      default: "Draft",
    },
    avatar: { type: String, default: "" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

invoiceSchema.index({ number: "text", client: "text" });

// Auto-generate a sequential invoice number if none supplied (e.g. INV-0001)
invoiceSchema.pre("validate", async function (next) {
  if (this.items.length) {
    for (const item of this.items) item.total = Math.round(item.quantity * item.unitPrice * (1 + (item.tax || 0) / 100) * 100) / 100;
    this.amount = Math.round(this.items.reduce((sum, item) => sum + item.total, 0) * 100) / 100;
  }
  if (this.dueDate && this.issueDate && this.dueDate < this.issueDate) this.invalidate('dueDate', 'Due date must be on or after issue date.');
  if (this.number) return next();
  this.number = "INV-" + require("crypto").randomUUID().slice(0, 8).toUpperCase();
  next();
});

module.exports = mongoose.model("Invoice", invoiceSchema);
