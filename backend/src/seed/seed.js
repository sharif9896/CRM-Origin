/**
 * Seed script — populates MongoDB with the FULL demo dataset for every module,
 * taken from the frontend's mock data (src/data/*.ts), so the app looks
 * exactly like the frontend design out of the box.
 *
 * Usage:
 *   npm run seed            -> import all sample data (skips collections that already have data)
 *   npm run seed:destroy    -> wipe all collections
 */
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "../../.env") });

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
const ChatMessage = require('../models/ChatMessage');
const NotificationDelivery = require('../models/NotificationDelivery');

// ---------------------------------------------------------------------------
// Helper: build a real Date relative to "today" for appointments whose
// original mock data used relative labels like "Today" / "Tomorrow".
// ---------------------------------------------------------------------------
const addDays = (days, hours = 9, minutes = 0) => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + days);
  d.setHours(hours, minutes, 0, 0);
  return d;
};

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------
const users = [
  { name: "Admin User", email: "admin@realestate.com", password: "password123", role: "admin", isEmailVerified: true },
  { name: "Operations Manager", email: "manager@realestate.com", password: "password123", role: "manager", isEmailVerified: true },
  { name: "Senior Agent", email: "senior.agent@realestate.com", password: "password123", role: "senior-agent", isEmailVerified: true },
  { name: "Jennifer Martinez", email: "jennifer@realestate.com", password: "password123", role: "agent", isEmailVerified: true },
  { name: "Workspace Staff", email: "staff@realestate.com", password: "password123", role: "staff", isEmailVerified: true },
  { name: "Read Only Viewer", email: "viewer@realestate.com", password: "password123", role: "viewer", isEmailVerified: true },
  { name: "Demo Customer", email: "customer@realestate.com", password: "password123", role: "customer", isEmailVerified: true },
];

// ---------------------------------------------------------------------------
// Agents (12)
// ---------------------------------------------------------------------------
const agents = [
  { name: "Jennifer Martinez", rank: "#1 Top Rated", email: "jennifer.agent@realestate.com", phone: "+1 555 0101", role: "Senior Agent", status: "Active", listings: 64, deals: 48, revenue: 4200000, rating: 4.9, avatar: "assets/img/avatar/avatar-12.jpg" },
  { name: "David Chen", rank: "#2 Top Rated", email: "david@realestate.com", phone: "+1 555 0102", role: "Sales Agent", status: "Active", listings: 52, deals: 39, revenue: 3600000, rating: 4.7, avatar: "assets/img/avatar/avatar-20.jpg" },
  { name: "Laura Bennett", rank: "#3 Top Rated", email: "laura@realestate.com", phone: "+1 555 0103", role: "Leasing Agent", status: "Active", listings: 41, deals: 27, revenue: 2100000, rating: 4.6, avatar: "assets/img/avatar/avatar-21.jpg" },
  { name: "Michael Reed", rank: "#4 Rising Star", email: "michael@realestate.com", phone: "+1 555 0104", role: "Senior Agent", status: "Away", listings: 58, deals: 44, revenue: 5100000, rating: 4.8, avatar: "assets/img/avatar/avatar-22.jpg" },
  { name: "Aisha Karim", rank: "#5 Agent", email: "aisha@realestate.com", phone: "+1 555 0105", role: "Sales Agent", status: "Inactive", listings: 19, deals: 9, revenue: 780000, rating: 4.5, avatar: "assets/img/avatar/avatar-23.jpg" },
  { name: "Robert Sinclair", rank: "#6 Agent", email: "robert@realestate.com", phone: "+1 555 0106", role: "Broker", status: "Active", listings: 72, deals: 61, revenue: 8400000, rating: 5.0, avatar: "assets/img/avatar/avatar-24.jpg" },
  { name: "Elena Petrova", rank: "#7 Agent", email: "elena@realestate.com", phone: "+1 555 0107", role: "Leasing Agent", status: "Inactive", listings: 16, deals: 7, revenue: 520000, rating: 4.4, avatar: "assets/img/avatar/avatar-25.jpg" },
  { name: "James Okonkwo", rank: "#8 Agent", email: "james@realestate.com", phone: "+1 555 0108", role: "Sales Agent", status: "Active", listings: 37, deals: 25, revenue: 2900000, rating: 4.7, avatar: "assets/img/avatar/avatar-26.jpg" },
  { name: "Sara Lindgren", rank: "#9 Agent", email: "sara@realestate.com", phone: "+1 555 0109", role: "Senior Agent", status: "Active", listings: 49, deals: 33, revenue: 3800000, rating: 4.8, avatar: "assets/img/avatar/avatar-27.jpg" },
  { name: "Tomas Alvarez", rank: "#10 Agent", email: "tomas@realestate.com", phone: "+1 555 0110", role: "Broker", status: "Active", listings: 66, deals: 52, revenue: 6700000, rating: 4.9, avatar: "assets/img/avatar/avatar-28.jpg" },
  { name: "Nina Kowalski", rank: "#11 Agent", email: "nina@realestate.com", phone: "+1 555 0111", role: "Sales Agent", status: "Active", listings: 31, deals: 18, revenue: 1650000, rating: 4.6, avatar: "assets/img/avatar/avatar-29.jpg" },
  { name: "Peter Nakamura", rank: "#12 Agent", email: "peter@realestate.com", phone: "+1 555 0112", role: "Leasing Agent", status: "Inactive", listings: 14, deals: 6, revenue: 410000, rating: 4.3, avatar: "assets/img/avatar/avatar-02.jpg" },
];

// ---------------------------------------------------------------------------
// Leads (18)
// ---------------------------------------------------------------------------
const leads = [
  { name: "Marcus Johnson", email: "marcus@example.com", phone: "+1 555 0412", status: "Hot", budget: "$2.5M - $3.5M", assignedTo: "Jennifer Martinez", avatar: "assets/img/avatar/avatar-02.jpg" },
  { name: "Emily Rodriguez", email: "emily@example.com", phone: "+1 555 0547", status: "Warm", budget: "$800K - $1.2M", assignedTo: "Gabriella White", avatar: "assets/img/avatar/avatar-03.jpg" },
  { name: "David Chen", email: "david@example.com", phone: "+1 555 0698", status: "New", budget: "$1.5M - $2M", assignedTo: "Christopher Rey", avatar: "assets/img/avatar/avatar-04.jpg" },
  { name: "Sofia Almeida", email: "sofia@example.com", phone: "+1 555 0264", status: "Converted", budget: "$1.8M - $2.2M", assignedTo: "Michael", avatar: "assets/img/avatar/avatar-04.jpg" },
  { name: "Ethan Brooks", email: "ethan@example.com", phone: "+1 555 0891", status: "Hot", budget: "$3.0M - $4.0M", assignedTo: "Laura", avatar: "assets/img/avatar/avatar-05.jpg" },
  { name: "Hannah Whitfield", email: "hannah@example.com", phone: "+1 555 0357", status: "Warm", budget: "$650K - $900K", assignedTo: "David", avatar: "assets/img/avatar/avatar-06.jpg" },
  { name: "Omar Haddad", email: "omar@example.com", phone: "+1 555 0620", status: "New", budget: "$1.1M - $1.4M", assignedTo: "Jennifer", avatar: "assets/img/avatar/avatar-07.jpg" },
  { name: "Grace Liu", email: "grace@example.com", phone: "+1 555 0475", status: "Hot", budget: "$2.0M - $2.6M", assignedTo: "Michael", avatar: "assets/img/avatar/avatar-08.jpg" },
  { name: "Tobias Meyer", email: "tobias@example.com", phone: "+1 555 0139", status: "New", budget: "$500K - $700K", assignedTo: "Laura", avatar: "assets/img/avatar/avatar-09.jpg" },
  { name: "Isabella Rossi", email: "isabella@example.com", phone: "+1 555 0982", status: "Warm", budget: "$1.5M - $1.9M", assignedTo: "David", avatar: "assets/img/avatar/avatar-10.jpg" },
  { name: "Noah Patterson", email: "noah@example.com", phone: "+1 555 0546", status: "New", budget: "$380K - $520K", assignedTo: "Jennifer", avatar: "assets/img/avatar/avatar-11.jpg" },
  { name: "Amara Okafor", email: "amara@example.com", phone: "+1 555 0718", status: "Converted", budget: "$2.8M - $3.2M", assignedTo: "Michael", avatar: "assets/img/avatar/avatar-13.jpg" },
  { name: "Lucas Ferreira", email: "lucas@example.com", phone: "+1 555 0293", status: "Hot", budget: "$1.2M - $1.6M", assignedTo: "Laura", avatar: "assets/img/avatar/avatar-14.jpg" },
  { name: "Mei Tanaka", email: "mei@example.com", phone: "+1 555 0864", status: "Warm", budget: "$900K - $1.3M", assignedTo: "David", avatar: "assets/img/avatar/avatar-15.jpg" },
  { name: "Caleb Nguyen", email: "caleb@example.com", phone: "+1 555 0407", status: "New", budget: "$700K - $950K", assignedTo: "Jennifer", avatar: "assets/img/avatar/avatar-16.jpg" },
  { name: "Freya Lindqvist", email: "freya@example.com", phone: "+1 555 0651", status: "Hot", budget: "$4.0M - $5.5M", assignedTo: "Michael", avatar: "assets/img/avatar/avatar-17.jpg" },
  { name: "Andre Dubois", email: "andre@example.com", phone: "+1 555 0328", status: "Warm", budget: "$1.0M - $1.4M", assignedTo: "Laura", avatar: "assets/img/avatar/avatar-18.jpg" },
  { name: "Zara Ahmed", email: "zara@example.com", phone: "+1 555 0790", status: "Converted", budget: "$2.2M - $2.9M", assignedTo: "David", avatar: "assets/img/avatar/avatar-19.jpg" },
];

// ---------------------------------------------------------------------------
// Properties (18)
// ---------------------------------------------------------------------------
const properties = [
  { name: "Mariana High Apartments", location: "Los Angeles, CA", type: "Villa", price: 3512500, beds: 4, baths: 4, sqft: 1526, status: "For Sale", agent: "Jennifer Martinez", agentAvatar: "assets/img/avatar/avatar-12.jpg", image: "assets/img/dashboard/villa-img-1.jpg" },
  { name: "Sunset Manor", location: "Santa Monica, CA", type: "Villa", price: 2185000, beds: 5, baths: 3, sqft: 2140, status: "Pending", agent: "David Chen", agentAvatar: "assets/img/avatar/avatar-20.jpg", image: "assets/img/dashboard/villa-img-2.jpg" },
  { name: "Oakwood Apartment", location: "Pasadena, CA", type: "Apartment", price: 785000, beds: 2, baths: 2, sqft: 980, status: "For Rent", agent: "Laura Bennett", agentAvatar: "assets/img/avatar/avatar-21.jpg", image: "assets/img/dashboard/villa-img-3.jpg" },
  { name: "Crestview Penthouse", location: "Beverly Hills, CA", type: "Penthouse", price: 5940000, beds: 4, baths: 5, sqft: 3200, status: "For Sale", agent: "Michael Reed", agentAvatar: "assets/img/avatar/avatar-22.jpg", image: "assets/img/dashboard/villa-img-4.jpg" },
  { name: "Harbour Point Studio", location: "Long Beach, CA", type: "Apartment", price: 412000, beds: 1, baths: 1, sqft: 540, status: "Sold", agent: "Jennifer Martinez", agentAvatar: "assets/img/avatar/avatar-12.jpg", image: "assets/img/dashboard/villa-img-5.jpg" },
  { name: "Willow Creek Villa", location: "Malibu, CA", type: "Villa", price: 4275000, beds: 5, baths: 4, sqft: 2860, status: "For Sale", agent: "David Chen", agentAvatar: "assets/img/avatar/avatar-20.jpg", image: "assets/img/dashboard/villa-img-6.jpg" },
  { name: "Elm Street Residence", location: "Burbank, CA", type: "Villa", price: 968000, beds: 3, baths: 2, sqft: 1420, status: "For Rent", agent: "Laura Bennett", agentAvatar: "assets/img/avatar/avatar-21.jpg", image: "assets/img/dashboard/villa-img-7.jpg" },
  { name: "Bayview Terrace", location: "San Diego, CA", type: "Apartment", price: 1150000, beds: 3, baths: 2, sqft: 1310, status: "Sold", agent: "Michael Reed", agentAvatar: "assets/img/avatar/avatar-22.jpg", image: "assets/img/dashboard/villa-img-1.jpg" },
  { name: "Aspen Ridge Estate", location: "Glendale, CA", type: "Villa", price: 3890000, beds: 6, baths: 5, sqft: 3450, status: "For Sale", agent: "Jennifer Martinez", agentAvatar: "assets/img/avatar/avatar-12.jpg", image: "assets/img/dashboard/villa-img-2.jpg" },
  { name: "Cedar Lane Loft", location: "Culver City, CA", type: "Apartment", price: 690000, beds: 2, baths: 1, sqft: 870, status: "Pending", agent: "David Chen", agentAvatar: "assets/img/avatar/avatar-20.jpg", image: "assets/img/dashboard/villa-img-3.jpg" },
  { name: "Marina Bay Penthouse", location: "Marina del Rey, CA", type: "Penthouse", price: 6350000, beds: 4, baths: 4, sqft: 3680, status: "For Sale", agent: "Laura Bennett", agentAvatar: "assets/img/avatar/avatar-21.jpg", image: "assets/img/dashboard/villa-img-4.jpg" },
  { name: "Rosewood Cottage", location: "Ventura, CA", type: "Villa", price: 545000, beds: 2, baths: 1, sqft: 760, status: "For Rent", agent: "Michael Reed", agentAvatar: "assets/img/avatar/avatar-22.jpg", image: "assets/img/dashboard/villa-img-5.jpg" },
  { name: "Summit View Villa", location: "Calabasas, CA", type: "Villa", price: 4720000, beds: 5, baths: 5, sqft: 3120, status: "Sold", agent: "Jennifer Martinez", agentAvatar: "assets/img/avatar/avatar-12.jpg", image: "assets/img/dashboard/villa-img-6.jpg" },
  { name: "Lakeside Studio", location: "Irvine, CA", type: "Apartment", price: 378000, beds: 1, baths: 1, sqft: 495, status: "For Rent", agent: "David Chen", agentAvatar: "assets/img/avatar/avatar-20.jpg", image: "assets/img/dashboard/villa-img-7.jpg" },
  { name: "Grand Oak Manor", location: "Pasadena, CA", type: "Villa", price: 2860000, beds: 5, baths: 4, sqft: 2540, status: "Pending", agent: "Laura Bennett", agentAvatar: "assets/img/avatar/avatar-21.jpg", image: "assets/img/dashboard/villa-img-1.jpg" },
  { name: "Coral Heights", location: "Redondo Beach, CA", type: "Apartment", price: 925000, beds: 3, baths: 2, sqft: 1180, status: "For Sale", agent: "Michael Reed", agentAvatar: "assets/img/avatar/avatar-22.jpg", image: "assets/img/dashboard/villa-img-2.jpg" },
  { name: "Downtown Business Hub", location: "Los Angeles, CA", type: "Office", price: 4180000, beds: 0, baths: 4, sqft: 5200, status: "For Sale", agent: "Robert Sinclair", agentAvatar: "assets/img/avatar/avatar-24.jpg", image: "assets/img/dashboard/villa-img-3.jpg" },
  { name: "Wilshire Corporate Suite", location: "Santa Monica, CA", type: "Office", price: 1960000, beds: 0, baths: 2, sqft: 2400, status: "For Rent", agent: "Sara Lindgren", agentAvatar: "assets/img/avatar/avatar-27.jpg", image: "assets/img/dashboard/villa-img-4.jpg" },
];

// ---------------------------------------------------------------------------
// Customers (16)
// ---------------------------------------------------------------------------
const customers = [
  { name: "Alexander Kenn", email: "alex@example.com", phone: "+1 555 0142", interestedIn: "Mariana High Apartments", status: "New", joined: new Date("11 Sep 2026"), avatar: "assets/img/avatar/avatar-02.jpg" },
  { name: "Gabriella White", email: "gab@example.com", phone: "+1 555 0198", interestedIn: "Sunset Villa", status: "Warm", joined: new Date("05 Sep 2026"), avatar: "assets/img/avatar/avatar-03.jpg" },
  { name: "Christopher Rey", email: "chris@example.com", phone: "+1 555 0234", interestedIn: "Downtown Loft", status: "Hot", joined: new Date("12 Aug 2026"), avatar: "assets/img/avatar/avatar-04.jpg" },
  { name: "Penelope Ton", email: "pen@example.com", phone: "+1 555 0311", interestedIn: "Palm Residency", status: "Converted", joined: new Date("28 Jul 2026"), avatar: "assets/img/avatar/avatar-05.jpg" },
  { name: "Marcus Lee", email: "marcus.lee@example.com", phone: "+1 555 0367", interestedIn: "Riverside Lofts", status: "Warm", joined: new Date("19 Jul 2026"), avatar: "assets/img/avatar/avatar-06.jpg" },
  { name: "Leila Hassan", email: "leila.h@example.com", phone: "+1 555 0315", interestedIn: "Sunset Manor", status: "Hot", joined: new Date("17 Mar 2026"), avatar: "assets/img/avatar/avatar-07.jpg" },
  { name: "Kevin O'Brien", email: "kevin.o@example.com", phone: "+1 555 0316", interestedIn: "Harbour Point Studio", status: "New", joined: new Date("29 Mar 2026"), avatar: "assets/img/avatar/avatar-08.jpg" },
  { name: "Yuki Sato", email: "yuki.s@example.com", phone: "+1 555 0317", interestedIn: "Bayview Terrace", status: "Converted", joined: new Date("05 Apr 2026"), avatar: "assets/img/avatar/avatar-09.jpg" },
  { name: "Miguel Santos", email: "miguel.s@example.com", phone: "+1 555 0318", interestedIn: "Grand Oak Manor", status: "Warm", joined: new Date("19 Apr 2026"), avatar: "assets/img/avatar/avatar-10.jpg" },
  { name: "Clara Hoffmann", email: "clara.h@example.com", phone: "+1 555 0319", interestedIn: "Marina Bay Penthouse", status: "Hot", joined: new Date("02 May 2026"), avatar: "assets/img/avatar/avatar-11.jpg" },
  { name: "Andre Silva", email: "andre.s@example.com", phone: "+1 555 0320", interestedIn: "Aspen Ridge Estate", status: "New", joined: new Date("14 May 2026"), avatar: "assets/img/avatar/avatar-13.jpg" },
  { name: "Nadia Rahman", email: "nadia.r@example.com", phone: "+1 555 0321", interestedIn: "Coral Heights", status: "Converted", joined: new Date("26 May 2026"), avatar: "assets/img/avatar/avatar-14.jpg" },
  { name: "Thomas Wright", email: "thomas.w@example.com", phone: "+1 555 0322", interestedIn: "Cedar Lane Loft", status: "Warm", joined: new Date("09 Jun 2026"), avatar: "assets/img/avatar/avatar-15.jpg" },
  { name: "Ingrid Larsen", email: "ingrid.l@example.com", phone: "+1 555 0323", interestedIn: "Lakeside Studio", status: "New", joined: new Date("22 Jun 2026"), avatar: "assets/img/avatar/avatar-16.jpg" },
  { name: "Carlos Mendez", email: "carlos.m@example.com", phone: "+1 555 0324", interestedIn: "Summit View Villa", status: "Hot", joined: new Date("01 Jul 2026"), avatar: "assets/img/avatar/avatar-17.jpg" },
  { name: "Priya Venkat", email: "priya.v@example.com", phone: "+1 555 0325", interestedIn: "Rosewood Cottage", status: "Converted", joined: new Date("08 Jul 2026"), avatar: "assets/img/avatar/avatar-18.jpg" },
];

// ---------------------------------------------------------------------------
// Deals (12)
// ---------------------------------------------------------------------------
const deals = [
  { title: "Mariana Luxury Villa", price: "$850,000", value: 850000, stage: "New", agent: "Jennifer", avatar: "assets/img/avatar/avatar-02.jpg", customer: "Alexander Kenn", closeDate: new Date("12 Aug 2026") },
  { title: "Sunset Beach House", price: "$725,000", value: 725000, stage: "New", agent: "Gabriella", avatar: "assets/img/avatar/avatar-03.jpg", customer: "Sarah Jenkins", closeDate: new Date("19 Aug 2026") },
  { title: "Downtown Penthouse", price: "$1.2M", value: 1200000, stage: "New", agent: "Christopher", avatar: "assets/img/avatar/avatar-04.jpg", customer: "Raj Patel", closeDate: new Date("24 Aug 2026") },
  { title: "Hillcrest Manor", price: "$2.1M", value: 2100000, stage: "Negotiation", agent: "Penelope", avatar: "assets/img/avatar/avatar-05.jpg", customer: "Emily Carter", closeDate: new Date("02 Aug 2026") },
  { title: "Riverside Plaza", price: "$1.5M", value: 1500000, stage: "Negotiation", agent: "Daniel", avatar: "assets/img/avatar/avatar-06.jpg", customer: "Victor Moreau", closeDate: new Date("08 Aug 2026") },
  { title: "Oceanview Estates", price: "$1.8M", value: 1800000, stage: "Negotiation", agent: "Olivia", avatar: "assets/img/avatar/avatar-07.jpg", customer: "Leila Hassan", closeDate: new Date("15 Aug 2026") },
  { title: "Palm Residency", price: "$2.5M", value: 2500000, stage: "Due Diligence", agent: "Jennifer", avatar: "assets/img/avatar/avatar-02.jpg", customer: "Kevin O'Brien", closeDate: new Date("29 Jul 2026") },
  { title: "Urban Heights", price: "$3.2M", value: 3200000, stage: "Due Diligence", agent: "Gabriella", avatar: "assets/img/avatar/avatar-03.jpg", customer: "Yuki Sato", closeDate: new Date("05 Aug 2026") },
  { title: "Garden District", price: "$2.8M", value: 2800000, stage: "Due Diligence", agent: "Christopher", avatar: "assets/img/avatar/avatar-04.jpg", customer: "Miguel Santos", closeDate: new Date("12 Aug 2026") },
  { title: "Lakeside Villa", price: "$1.8M", value: 1800000, stage: "Won", agent: "Penelope", avatar: "assets/img/avatar/avatar-05.jpg", customer: "Clara Hoffmann", closeDate: new Date("11 Jul 2026") },
  { title: "Heritage House", price: "$2.2M", value: 2200000, stage: "Won", agent: "Daniel", avatar: "assets/img/avatar/avatar-06.jpg", customer: "Andre Silva", closeDate: new Date("03 Jul 2026") },
  { title: "Summit Estate", price: "$2M", value: 2000000, stage: "Won", agent: "Olivia", avatar: "assets/img/avatar/avatar-07.jpg", customer: "Nadia Rahman", closeDate: new Date("27 Jun 2026") },
];

// ---------------------------------------------------------------------------
// Invoices (12)
// ---------------------------------------------------------------------------
const invoices = [
  { number: "INV-2451", client: "Sarah Jenkins", issueDate: new Date("01 Jun 2026"), dueDate: new Date("15 Jun 2026"), amount: 12500, status: "Paid", avatar: "assets/img/avatar/avatar-01.jpg" },
  { number: "INV-2452", client: "Raj Patel", issueDate: new Date("03 Jun 2026"), dueDate: new Date("17 Jun 2026"), amount: 8400, status: "Pending", avatar: "assets/img/avatar/avatar-03.jpg" },
  { number: "INV-2453", client: "Emily Carter", issueDate: new Date("05 Jun 2026"), dueDate: new Date("19 Jun 2026"), amount: 24750, status: "Overdue", avatar: "assets/img/avatar/avatar-04.jpg" },
  { number: "INV-2454", client: "Victor Moreau", issueDate: new Date("08 Jun 2026"), dueDate: new Date("22 Jun 2026"), amount: 5600, status: "Paid", avatar: "assets/img/avatar/avatar-05.jpg" },
  { number: "INV-2455", client: "Leila Hassan", issueDate: new Date("11 Jun 2026"), dueDate: new Date("25 Jun 2026"), amount: 18900, status: "Draft", avatar: "assets/img/avatar/avatar-06.jpg" },
  { number: "INV-2456", client: "Kevin O'Brien", issueDate: new Date("14 Jun 2026"), dueDate: new Date("28 Jun 2026"), amount: 3200, status: "Paid", avatar: "assets/img/avatar/avatar-07.jpg" },
  { number: "INV-2457", client: "Yuki Sato", issueDate: new Date("17 Jun 2026"), dueDate: new Date("01 Jul 2026"), amount: 9750, status: "Pending", avatar: "assets/img/avatar/avatar-08.jpg" },
  { number: "INV-2458", client: "Miguel Santos", issueDate: new Date("20 Jun 2026"), dueDate: new Date("04 Jul 2026"), amount: 14300, status: "Paid", avatar: "assets/img/avatar/avatar-09.jpg" },
  { number: "INV-2459", client: "Clara Hoffmann", issueDate: new Date("23 Jun 2026"), dueDate: new Date("07 Jul 2026"), amount: 31200, status: "Overdue", avatar: "assets/img/avatar/avatar-10.jpg" },
  { number: "INV-2460", client: "Andre Silva", issueDate: new Date("26 Jun 2026"), dueDate: new Date("10 Jul 2026"), amount: 6850, status: "Pending", avatar: "assets/img/avatar/avatar-11.jpg" },
  { number: "INV-2461", client: "Nadia Rahman", issueDate: new Date("29 Jun 2026"), dueDate: new Date("13 Jul 2026"), amount: 22400, status: "Paid", avatar: "assets/img/avatar/avatar-13.jpg" },
  { number: "INV-2462", client: "Thomas Wright", issueDate: new Date("02 Jul 2026"), dueDate: new Date("16 Jul 2026"), amount: 4950, status: "Draft", avatar: "assets/img/avatar/avatar-14.jpg" },
];

// ---------------------------------------------------------------------------
// Payments (12)
// ---------------------------------------------------------------------------
const payments = [
  { reference: "PAY-20240120-001", invoice: "INV-2024-0032", client: "Acme Corporation", date: new Date("Jan 20, 2024"), method: "Bank Transfer", amount: 8500, status: "Completed", avatar: "assets/img/avatar/avatar-01.jpg" },
  { reference: "PAY-20240118-002", invoice: "INV-2024-0031", client: "Global Tech Solutions", date: new Date("Jan 18, 2024"), method: "Credit Card", amount: 6200, status: "Pending", avatar: "assets/img/avatar/avatar-05.jpg" },
  { reference: "PAY-20240115-003", invoice: "INV-2024-0030", client: "Prime Enterprises", date: new Date("Jan 15, 2024"), method: "Bank Transfer", amount: 9750, status: "Completed", avatar: "assets/img/avatar/avatar-03.jpg" },
  { reference: "PAY-20240112-004", invoice: "INV-2024-0029", client: "Digital Marketing Inc", date: new Date("Jan 12, 2024"), method: "PayPal", amount: 12350, status: "Completed", avatar: "assets/img/avatar/avatar-07.jpg" },
  { reference: "PAY-20240110-005", invoice: "INV-2024-0028", client: "Sunrise Partners", date: new Date("Jan 10, 2024"), method: "Credit Card", amount: 15600, status: "Completed", avatar: "assets/img/avatar/avatar-04.jpg" },
  { reference: "PAY-8806", invoice: "INV-2458", client: "Miguel Santos", date: new Date("04 Jul 2026"), method: "Bank Transfer", amount: 14300, status: "Completed", avatar: "assets/img/avatar/avatar-09.jpg" },
  { reference: "PAY-8807", invoice: "INV-2457", client: "Yuki Sato", date: new Date("06 Jul 2026"), method: "PayPal", amount: 9750, status: "Pending", avatar: "assets/img/avatar/avatar-08.jpg" },
  { reference: "PAY-8808", invoice: "INV-2461", client: "Nadia Rahman", date: new Date("09 Jul 2026"), method: "Bank Transfer", amount: 22400, status: "Completed", avatar: "assets/img/avatar/avatar-13.jpg" },
  { reference: "PAY-8809", invoice: "INV-2459", client: "Clara Hoffmann", date: new Date("11 Jul 2026"), method: "Credit Card", amount: 31200, status: "Failed", avatar: "assets/img/avatar/avatar-10.jpg" },
  { reference: "PAY-8810", invoice: "INV-2460", client: "Andre Silva", date: new Date("13 Jul 2026"), method: "Check", amount: 6850, status: "Pending", avatar: "assets/img/avatar/avatar-11.jpg" },
  { reference: "PAY-8811", invoice: "INV-2455", client: "Leila Hassan", date: new Date("14 Jul 2026"), method: "Bank Transfer", amount: 18900, status: "Completed", avatar: "assets/img/avatar/avatar-06.jpg" },
  { reference: "PAY-8812", invoice: "INV-2462", client: "Thomas Wright", date: new Date("15 Jul 2026"), method: "Credit Card", amount: 4950, status: "Completed", avatar: "assets/img/avatar/avatar-14.jpg" },
];

// ---------------------------------------------------------------------------
// Appointments (10) — relative labels ("Today"/"Tomorrow") converted to real
// dates relative to whenever the seed script is run.
// ---------------------------------------------------------------------------
const appointments = [
  { title: "Property Viewing — Downtown Penthouse", location: "Crestview Penthouse, Beverly Hills", when: addDays(0, 14, 0), duration: "30 mins", client: "Marcus Johnson", avatar: "assets/img/avatar/avatar-01.jpg", status: "Confirmed", icon: "icon-home" },
  { title: "Contract Signing — Sunset Manor", location: "Head Office, Los Angeles", when: addDays(0, 16, 0), duration: "1 hr", client: "Sarah Jenkins", avatar: "assets/img/avatar/avatar-03.jpg", status: "Confirmed", icon: "icon-file-text" },
  { title: "Valuation Visit — Oakwood Apartment", location: "Oakwood Apartment, Pasadena", when: addDays(1, 10, 0), duration: "1 hr", client: "Raj Patel", avatar: "assets/img/avatar/avatar-04.jpg", status: "Pending", icon: "icon-ruler" },
  { title: "Client Consultation — Budget Review", location: "Video Call", when: addDays(1, 13, 0), duration: "45 mins", client: "Emily Carter", avatar: "assets/img/avatar/avatar-05.jpg", status: "Confirmed", icon: "icon-video" },
  { title: "Property Viewing — Willow Creek Villa", location: "Willow Creek Villa, Malibu", when: addDays(4, 11, 0), duration: "1 hr", client: "Victor Moreau", avatar: "assets/img/avatar/avatar-06.jpg", status: "Pending", icon: "icon-home" },
  { title: "Handover — Elm Street Residence", location: "Elm Street Residence, Burbank", when: addDays(-3, 9, 0), duration: "1 hr", client: "Miguel Santos", avatar: "assets/img/avatar/avatar-09.jpg", status: "Completed", icon: "icon-key" },
  { title: "Open House — Marina Bay Penthouse", location: "Marina Bay, Marina del Rey", when: addDays(6, 12, 0), duration: "4 hrs", client: "Walk-ins", avatar: "assets/img/avatar/avatar-07.jpg", status: "Confirmed", icon: "icon-users" },
  { title: "Second Viewing — Bayview Terrace", location: "Bayview Terrace, San Diego", when: addDays(-5, 15, 0), duration: "30 mins", client: "Yuki Sato", avatar: "assets/img/avatar/avatar-08.jpg", status: "Cancelled", icon: "icon-home" },
  { title: "Mortgage Advisor Meeting", location: "Video Call", when: addDays(7, 10, 30), duration: "45 mins", client: "Leila Hassan", avatar: "assets/img/avatar/avatar-10.jpg", status: "Pending", icon: "icon-landmark" },
  { title: "Photo Shoot — Aspen Ridge Estate", location: "Aspen Ridge Estate, Glendale", when: addDays(-7, 8, 0), duration: "3 hrs", client: "Clara Hoffmann", avatar: "assets/img/avatar/avatar-11.jpg", status: "Completed", icon: "icon-camera" },
];

// ---------------------------------------------------------------------------
// Staff (12)
// ---------------------------------------------------------------------------
const staffMembers = [
  { name: "Jennifer Martinez", email: "jennifer.staff@example.com", role: "Senior Agent", department: "Sales", status: "Active", joinDate: new Date("Jan 15, 2022"), avatar: "assets/img/avatar/avatar-02.jpg" },
  { name: "Gabriella White", email: "gabriella@example.com", role: "Manager", department: "Operations", status: "Active", joinDate: new Date("Mar 22, 2021"), avatar: "assets/img/avatar/avatar-03.jpg" },
  { name: "Christopher Rey", email: "christopher@example.com", role: "Junior Agent", department: "Sales", status: "On Leave", joinDate: new Date("Jul 08, 2023"), avatar: "assets/img/avatar/avatar-04.jpg" },
  { name: "Michelle Anderson", email: "michelle@example.com", role: "Viewer", department: "Support", status: "Inactive", joinDate: new Date("Nov 30, 2023"), avatar: "assets/img/avatar/avatar-05.jpg" },
  { name: "David Chen", email: "david.staff@example.com", role: "Senior Agent", department: "Sales", status: "Active", joinDate: new Date("Feb 14, 2022"), avatar: "assets/img/avatar/avatar-20.jpg" },
  { name: "Robert Sinclair", email: "robert@example.com", role: "Admin", department: "Operations", status: "Active", joinDate: new Date("Aug 03, 2020"), avatar: "assets/img/avatar/avatar-24.jpg" },
  { name: "Aisha Karim", email: "aisha@example.com", role: "Junior Agent", department: "Management", status: "On Leave", joinDate: new Date("May 19, 2023"), avatar: "assets/img/avatar/avatar-23.jpg" },
  { name: "Sara Lindgren", email: "sara@example.com", role: "Manager", department: "Operations", status: "Active", joinDate: new Date("Oct 11, 2021"), avatar: "assets/img/avatar/avatar-27.jpg" },
  { name: "James Okonkwo", email: "james@example.com", role: "Junior Agent", department: "Sales", status: "Active", joinDate: new Date("Jan 27, 2023"), avatar: "assets/img/avatar/avatar-26.jpg" },
  { name: "Elena Petrova", email: "elena@example.com", role: "Viewer", department: "Support", status: "Inactive", joinDate: new Date("Sep 05, 2023"), avatar: "assets/img/avatar/avatar-25.jpg" },
  { name: "Tomas Alvarez", email: "tomas@example.com", role: "Senior Agent", department: "Sales", status: "Active", joinDate: new Date("Apr 18, 2022"), avatar: "assets/img/avatar/avatar-28.jpg" },
  { name: "Nina Kowalski", email: "nina@example.com", role: "Junior Agent", department: "Management", status: "Active", joinDate: new Date("Jun 30, 2023"), avatar: "assets/img/avatar/avatar-29.jpg" },
];

// ---------------------------------------------------------------------------
// Reviews (9)
// ---------------------------------------------------------------------------
const reviews = [
  { author: "Marcus Johnson", avatar: "assets/img/avatar/avatar-01.jpg", property: "Crestview Penthouse", rating: 5, comment: "Jennifer knew every detail of the building and answered questions I hadn't thought to ask. The whole process took three weeks end to end.", date: new Date("12 Jul 2026"), replied: true },
  { author: "Sarah Jenkins", avatar: "assets/img/avatar/avatar-03.jpg", property: "Sunset Manor", rating: 4, comment: "Great experience overall. The listing photos undersold the garden — it's much bigger in person.", date: new Date("09 Jul 2026"), replied: true },
  { author: "Raj Patel", avatar: "assets/img/avatar/avatar-04.jpg", property: "Oakwood Apartment", rating: 5, comment: "Responsive, straightforward, no pressure. Exactly what I wanted from an agent.", date: new Date("05 Jul 2026"), replied: false },
  { author: "Emily Carter", avatar: "assets/img/avatar/avatar-05.jpg", property: "Marina Bay Penthouse", rating: 3, comment: "The property was as described, but scheduling the second viewing took longer than I'd have liked.", date: new Date("01 Jul 2026"), replied: false },
  { author: "Victor Moreau", avatar: "assets/img/avatar/avatar-06.jpg", property: "Willow Creek Villa", rating: 5, comment: "David handled a tricky chain without any drama. Would recommend to anyone buying in Malibu.", date: new Date("27 Jun 2026"), replied: true },
  { author: "Leila Hassan", avatar: "assets/img/avatar/avatar-07.jpg", property: "Harbour Point Studio", rating: 4, comment: "Good value and a quick turnaround. The paperwork could be simpler but that's not on the agency.", date: new Date("22 Jun 2026"), replied: false },
  { author: "Yuki Sato", avatar: "assets/img/avatar/avatar-08.jpg", property: "Bayview Terrace", rating: 2, comment: "Two viewings were rescheduled at short notice. The property itself was fine.", date: new Date("18 Jun 2026"), replied: true },
  { author: "Miguel Santos", avatar: "assets/img/avatar/avatar-09.jpg", property: "Elm Street Residence", rating: 5, comment: "Laura went well beyond what I expected, including chasing the surveyor twice.", date: new Date("14 Jun 2026"), replied: false },
  { author: "Clara Hoffmann", avatar: "assets/img/avatar/avatar-10.jpg", property: "Aspen Ridge Estate", rating: 4, comment: "Professional throughout. The virtual tour saved me two trips across town.", date: new Date("10 Jun 2026"), replied: true },
];

// ---------------------------------------------------------------------------
// Taxonomies — categories (6) + amenities (8), both stored in the Taxonomy
// collection since they share the same schema in the frontend.
// ---------------------------------------------------------------------------
const taxonomies = [
  // Categories
  { name: "Villa", icon: "icon-hotel", badge: "bg-secondary", usedIn: 486, status: "Active", kind: "category" },
  { name: "Apartment", icon: "icon-building-2", badge: "bg-primary", usedIn: 912, status: "Active", kind: "category" },
  { name: "Penthouse", icon: "icon-building", badge: "bg-info", usedIn: 234, status: "Active", kind: "category" },
  { name: "Office", icon: "icon-briefcase", badge: "bg-orange", usedIn: 158, status: "Active", kind: "category" },
  { name: "Land", icon: "icon-trees", badge: "bg-teal", usedIn: 97, status: "Inactive", kind: "category" },
  { name: "Commercial", icon: "icon-store", badge: "bg-warning", usedIn: 143, status: "Active", kind: "category" },
  // Amenities
  { name: "Wi-Fi", icon: "icon-wifi", usedIn: 1842, status: "Active", kind: "amenity" },
  { name: "Parking", icon: "icon-car", usedIn: 2104, status: "Active", kind: "amenity" },
  { name: "Swimming Pool", icon: "icon-waves", usedIn: 687, status: "Active", kind: "amenity" },
  { name: "Gym", icon: "icon-dumbbell", usedIn: 914, status: "Active", kind: "amenity" },
  { name: "Security", icon: "icon-shield-check", usedIn: 1556, status: "Active", kind: "amenity" },
  { name: "Garden", icon: "icon-trees", usedIn: 742, status: "Active", kind: "amenity" },
  { name: "Air Conditioning", icon: "icon-snowflake", usedIn: 1320, status: "Active", kind: "amenity" },
  { name: "Elevator", icon: "icon-arrow-up-down", usedIn: 498, status: "Inactive", kind: "amenity" },
];

// ---------------------------------------------------------------------------
// Tours (6)
// ---------------------------------------------------------------------------
const tours = [
  { property: "Mariana High Apartments", location: "Los Angeles, CA", image: "assets/img/dashboard/villa-img-1.jpg", duration: "3:24", views: 1284, status: "Published" },
  { property: "Skyline Residences", location: "Santa Monica, CA", image: "assets/img/dashboard/villa-img-2.jpg", duration: "4:10", views: 968, status: "Published" },
  { property: "The Grand Metropolitan", location: "Pasadena, CA", image: "assets/img/dashboard/villa-img-3.jpg", duration: "2:47", views: 742, status: "Published" },
  { property: "Oceanview Villa", location: "Beverly Hills, CA", image: "assets/img/dashboard/villa-img-4.jpg", duration: "5:32", views: 2140, status: "Published" },
  { property: "Hillcrest Manor", location: "Long Beach, CA", image: "assets/img/dashboard/villa-img-5.jpg", duration: "1:58", views: 386, status: "Draft" },
  { property: "Downtown Business Hub", location: "Malibu, CA", image: "assets/img/dashboard/villa-img-6.jpg", duration: "6:15", views: 1873, status: "Published" },
];

// ---------------------------------------------------------------------------
// Transactions (14)
// ---------------------------------------------------------------------------
const transactions = [
  { reference: "TXN-20240120-045", type: "Credit", description: "Invoice Payment - Acme Corp", date: new Date("Jan 20, 2024"), account: "Checking", amount: 8500, status: "Completed" },
  { reference: "TXN-20240119-044", type: "Debit", description: "Office Supplies Purchase", date: new Date("Jan 19, 2024"), account: "Expenses", amount: 1250, status: "Completed" },
  { reference: "TXN-20240118-043", type: "Credit", description: "Payment - Global Tech", date: new Date("Jan 18, 2024"), account: "Savings", amount: 6200, status: "Completed" },
  { reference: "TXN-20240117-042", type: "Debit", description: "Payroll Distribution", date: new Date("Jan 17, 2024"), account: "Payroll", amount: 18500, status: "Completed" },
  { reference: "TXN-20240116-041", type: "Credit", description: "Invoice Settlement - Prime", date: new Date("Jan 16, 2024"), account: "Checking", amount: 9750, status: "Completed" },
  { reference: "TXN-5506", type: "Debit", description: "Property photography", date: new Date("10 Jul 2026"), account: "Marketing Account", amount: 1850, status: "Completed" },
  { reference: "TXN-5507", type: "Credit", description: "Commission — Coral Heights", date: new Date("08 Jul 2026"), account: "Operating Account", amount: 24450, status: "Completed" },
  { reference: "TXN-5508", type: "Debit", description: "Agent payroll — July", date: new Date("05 Jul 2026"), account: "Payroll Account", amount: 42600, status: "Completed" },
  { reference: "TXN-5509", type: "Debit", description: "MLS subscription renewal", date: new Date("03 Jul 2026"), account: "Operating Account", amount: 2400, status: "Failed" },
  { reference: "TXN-5510", type: "Credit", description: "Commission — Aspen Ridge Estate", date: new Date("01 Jul 2026"), account: "Operating Account", amount: 93600, status: "Completed" },
  { reference: "TXN-5511", type: "Debit", description: "Software licences", date: new Date("28 Jun 2026"), account: "Operating Account", amount: 3150, status: "Completed" },
  { reference: "TXN-5512", type: "Credit", description: "Referral fee — partner agency", date: new Date("26 Jun 2026"), account: "Operating Account", amount: 5200, status: "Pending" },
  { reference: "TXN-5513", type: "Debit", description: "Client entertainment", date: new Date("24 Jun 2026"), account: "Operating Account", amount: 940, status: "Completed" },
  { reference: "TXN-5514", type: "Credit", description: "Commission — Bayview Terrace", date: new Date("21 Jun 2026"), account: "Operating Account", amount: 28200, status: "Completed" },
];

// ---------------------------------------------------------------------------
// Reimbursement types and claims
// ---------------------------------------------------------------------------
const reimbursementTypes = [
  { name: "Daily Subsistence Allowance", code: "ALW-DAILY", kind: "Allowance", category: "Daily Allowance", description: "Daily allowance for approved business travel.", defaultLimit: 120, receiptRequired: false, taxable: false, active: true },
  { name: "Housing Allowance", code: "ALW-HOUSING", kind: "Allowance", category: "Housing", description: "Approved temporary housing support.", defaultLimit: 1800, receiptRequired: true, taxable: true, active: true },
  { name: "Phone & Internet Allowance", code: "ALW-COMMS", kind: "Allowance", category: "Communication", description: "Recurring business communication allowance.", defaultLimit: 100, receiptRequired: false, taxable: false, active: true },
  { name: "Air & Rail Travel", code: "EXP-TRAVEL", kind: "Expense", category: "Travel", description: "Approved airfare, rail, taxi, and local transit costs.", defaultLimit: 2500, receiptRequired: true, taxable: false, active: true },
  { name: "Business Mileage", code: "EXP-MILEAGE", kind: "Expense", category: "Mileage", description: "Mileage reimbursement for approved private-vehicle use.", defaultLimit: 500, receiptRequired: false, taxable: false, active: true },
  { name: "Food & Meals", code: "EXP-MEALS", kind: "Expense", category: "Food & Meals", description: "Meals purchased during approved business activity.", defaultLimit: 150, receiptRequired: true, taxable: false, active: true },
  { name: "Hotel & Accommodation", code: "EXP-HOTEL", kind: "Expense", category: "Accommodation", description: "Accommodation for approved travel and events.", defaultLimit: 1200, receiptRequired: true, taxable: false, active: true },
  { name: "Fuel & Parking", code: "EXP-FUEL", kind: "Expense", category: "Fuel", description: "Fuel, toll, and parking expenses for business journeys.", defaultLimit: 350, receiptRequired: true, taxable: false, active: true },
  { name: "Client Entertainment", code: "EXP-CLIENT", kind: "Expense", category: "Client Entertainment", description: "Pre-approved client meetings and entertainment.", defaultLimit: 750, receiptRequired: true, taxable: false, active: true },
  { name: "Training & Certification", code: "EXP-TRAIN", kind: "Expense", category: "Training", description: "Approved courses, examinations, and professional certifications.", defaultLimit: 2000, receiptRequired: true, taxable: false, active: true },
];

const reimbursements = [
  { claimNumber: "RMB-2026-1001", employeeName: "Jennifer Martinez", employeeEmail: "jennifer@realestate.com", kind: "Expense", category: "Travel", description: "Flight and airport transfer for regional property conference.", amount: 860, expenseDate: new Date("2026-08-16"), submittedDate: new Date("2026-08-18"), status: "Paid", paymentMethod: "Bank Transfer", receiptNumber: "AIR-84925", approvedBy: "Operations Manager", paymentReference: "PAY-RMB-1001", taxable: false, recurring: false },
  { claimNumber: "RMB-2026-1002", employeeName: "Senior Agent", employeeEmail: "senior.agent@realestate.com", kind: "Expense", category: "Food & Meals", description: "Client lunch following the Oakwood property inspection.", amount: 148, expenseDate: new Date("2026-08-22"), submittedDate: new Date("2026-08-23"), status: "Approved", paymentMethod: "Payroll", receiptNumber: "MEAL-2208", approvedBy: "Admin User", taxable: false, recurring: false },
  { claimNumber: "RMB-2026-1003", employeeName: "Workspace Staff", employeeEmail: "staff@realestate.com", kind: "Allowance", category: "Communication", description: "Monthly business phone and internet allowance.", amount: 95, expenseDate: new Date("2026-09-01"), submittedDate: new Date("2026-09-01"), status: "Paid", paymentMethod: "Payroll", approvedBy: "Operations Manager", paymentReference: "PAY-RMB-1003", taxable: false, recurring: true },
  { claimNumber: "RMB-2026-1004", employeeName: "Operations Manager", employeeEmail: "manager@realestate.com", kind: "Expense", category: "Accommodation", description: "Two-night accommodation for the national brokerage summit.", amount: 620, expenseDate: new Date("2026-09-04"), submittedDate: new Date("2026-09-06"), status: "Under Review", paymentMethod: "Not Assigned", receiptNumber: "HTL-49218", taxable: false, recurring: false },
  { claimNumber: "RMB-2026-1005", employeeName: "Jennifer Martinez", employeeEmail: "jennifer@realestate.com", kind: "Expense", category: "Mileage", description: "Client viewings and listing inspections, August mileage.", amount: 284, expenseDate: new Date("2026-08-31"), submittedDate: new Date("2026-09-02"), status: "Submitted", paymentMethod: "Not Assigned", receiptNumber: "MILE-0826", taxable: false, recurring: false },
  { claimNumber: "RMB-2026-1006", employeeName: "Senior Agent", employeeEmail: "senior.agent@realestate.com", kind: "Allowance", category: "Daily Allowance", description: "Three-day subsistence allowance for regional site visits.", amount: 360, expenseDate: new Date("2026-09-08"), submittedDate: new Date("2026-09-09"), status: "Approved", paymentMethod: "Payroll", approvedBy: "Operations Manager", taxable: false, recurring: false },
  { claimNumber: "RMB-2026-1007", employeeName: "Workspace Staff", employeeEmail: "staff@realestate.com", kind: "Expense", category: "Office Supplies", description: "Presentation folders and listing documentation supplies.", amount: 126, expenseDate: new Date("2026-09-10"), submittedDate: new Date("2026-09-11"), status: "Draft", paymentMethod: "Not Assigned", receiptNumber: "OFF-7714", taxable: false, recurring: false },
  { claimNumber: "RMB-2026-1008", employeeName: "Operations Manager", employeeEmail: "manager@realestate.com", kind: "Expense", category: "Client Entertainment", description: "Unapproved event hospitality claim retained for audit history.", amount: 980, expenseDate: new Date("2026-08-28"), submittedDate: new Date("2026-08-30"), status: "Rejected", paymentMethod: "Not Assigned", receiptNumber: "EVT-3380", approvedBy: "Admin User", notes: "Rejected because the policy limit was exceeded.", taxable: false, recurring: false },
];

// ---------------------------------------------------------------------------
// Notifications (5) — attached to the first seeded user (Admin) below.
// ---------------------------------------------------------------------------
const notificationTemplates = [
  { title: "New Lead Assigned", message: "Lead #LD-954 has been assigned to you.", avatar: "assets/img/avatar/avatar-03.jpg" },
  { title: "Home Tour Scheduled", message: "Client scheduled tour for Sunset Manor.", initials: "HT", badgeClass: "bg-secondary-transparent text-secondary", online: true },
  { title: "Offer Received", message: "New offer submitted for Oakwood Apartment.", avatar: "assets/img/avatar/avatar-07.jpg" },
  { title: "Listing Sync Completed", message: "54 new listings synced with the MLS Portal.", icon: "icon-server", badgeClass: "bg-warning text-white" },
  { title: "Scheduled Meeting", message: "Meeting with buyer Sarah Jenkins tomorrow.", initials: "SM", badgeClass: "bg-primary-transparent text-primary", online: true },
];

// Exported so other scripts (e.g. export-json.js) can reuse the exact same
// demo dataset without duplicating it.
module.exports.seedData = {
  users,
  agents,
  leads,
  properties,
  customers,
  deals,
  invoices,
  payments,
  appointments,
  staffMembers,
  reviews,
  taxonomies,
  tours,
  transactions,
  reimbursements,
  reimbursementTypes,
  notificationTemplates,
};

// ---------------------------------------------------------------------------
// Import / destroy
// ---------------------------------------------------------------------------
const importData = async () => {
  const createdUsers = [];
  let seededUserCount = 0;
  for (const doc of users) {
    const existing = await User.findOne({ email: doc.email });
    if (existing) createdUsers.push(existing);
    else {
      // Saved individually (not insertMany) so the password-hashing pre-save hook runs.
      createdUsers.push(await User.create(doc));
      seededUserCount++;
    }
  }
  console.log(seededUserCount ? `Seeded ${seededUserCount} missing Users` : `Skipping Users (all ${users.length} demo accounts already exist)`);

  const simpleCollections = [
    { name: "Agents", Model: Agent, data: agents },
    { name: "Leads", Model: Lead, data: leads },
    { name: "Properties", Model: Property, data: properties },
    { name: "Customers", Model: Customer, data: customers },
    { name: "Deals", Model: Deal, data: deals },
    { name: "Invoices", Model: Invoice, data: invoices },
    { name: "Payments", Model: Payment, data: payments },
    { name: "Appointments", Model: Appointment, data: appointments },
    { name: "Staff", Model: Staff, data: staffMembers },
    { name: "Reviews", Model: Review, data: reviews },
    { name: "Taxonomies", Model: Taxonomy, data: taxonomies },
    { name: "Tours", Model: Tour, data: tours },
    { name: "Transactions", Model: Transaction, data: transactions },
    { name: "Reimbursement Types", Model: ReimbursementType, data: reimbursementTypes },
    { name: "Reimbursements", Model: Reimbursement, data: reimbursements },
  ];

  for (const { name, Model, data } of simpleCollections) {
    const existingCount = await Model.countDocuments();
    if (existingCount > 0) {
      console.log(`Skipping ${name} (already has ${existingCount} documents)`);
      continue;
    }
    await Model.insertMany(data);
    console.log(`Seeded ${data.length} ${name}`);
  }

  // Notifications need a `user` reference — attach all to the admin (first created/found user)
  const existingNotifCount = await Notification.countDocuments();
  if (existingNotifCount > 0) {
    console.log(`Skipping Notifications (already has ${existingNotifCount} documents)`);
  } else if (createdUsers.length) {
    const notificationUser = createdUsers.find(user => user.role === 'admin') || createdUsers[0];
    const notifications = notificationTemplates.map((n) => ({ ...n, user: notificationUser._id }));
    await Notification.insertMany(notifications);
    console.log(`Seeded ${notifications.length} Notifications`);
  }

  console.log("\nSeed complete.");
  for (const user of users) console.log(`${user.role.padEnd(13)} -> email: ${user.email.padEnd(31)} / password: ${user.password}`);
  process.exit(0);
};

const destroyData = async () => {
  const models = [
    User, Agent, Lead, Property, Customer, Deal, Invoice, Payment,
    Appointment, Staff, Review, Taxonomy, Tour, Transaction, Reimbursement, ReimbursementType, Notification, ChatMessage, NotificationDelivery,
  ];
  for (const Model of models) {
    await Model.deleteMany();
    console.log(`Cleared ${Model.modelName}`);
  }
  console.log("\nAll collections cleared.");
  process.exit(0);
};

// Only auto-run (connect to Mongo and import/destroy) when this file is
// executed directly, e.g. `node src/seed/seed.js`. This lets other scripts
// (like export-json.js) `require()` it just to reuse `seedData` above.
if (require.main === module) {
  (async () => {
    await connectDB();
    if (process.argv.includes("--destroy")) {
      await destroyData();
    } else {
      await importData();
    }
  })();
}
