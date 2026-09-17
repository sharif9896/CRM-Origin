/**
 * Realistic, internally consistent CRM seed data.
 *
 * People and contact details are fictional and use reserved example.com/555
 * destinations. Photos are remote Unsplash assets so a fresh database has a
 * polished UI without requiring binary files in the repository.
 */
const at = (value) => new Date(`${value}T12:00:00.000Z`);
const relativeDate = (days, hour = 10, minute = 0) => {
  const value = new Date();
  value.setHours(hour, minute, 0, 0);
  value.setDate(value.getDate() + days);
  return value;
};

const unsplash = (id, width = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=84`;
const portrait = (id) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&crop=faces&w=480&h=480&q=86`;

const portraitIds = [
  "1494790108377-be9c29b29330", "1507003211169-0a1dd7228f2d",
  "1534528741775-53994a69daeb", "1500648767791-00dcc994a43e",
  "1531123897727-8f129e1688ce", "1560250097-0b93528c311a",
  "1573496359142-b8d87734a5a2", "1506794778202-cad84cf45f1d",
  "1580489944761-15a19d654956", "1507591064344-4c6ce005b128",
  "1544005313-94ddf0286df2", "1552058544-f2b08422138a",
  "1517841905240-472988babdf9", "1524504388940-b1c1722653e1",
  "1508214751196-bcfd4ca60f91", "1519345182560-3f2917c472ef",
  "1539571696357-5a69c17a67c6", "1488426862026-3ee34a7d66df",
];
const avatar = (index) => portrait(portraitIds[index % portraitIds.length]);

const propertyPhotoIds = [
  "1600585154340-be6161a56a0c", "1600566753190-17f0baa2a6c3",
  "1600607687939-ce8a6c25118c", "1600607687920-4e2a09cf159d",
  "1600585154526-990dced4db0d", "1600596542815-ffad4c1539a9",
  "1600607688969-a5bfcd646154", "1600607688066-890987f18a86",
  "1600566753086-00f18fb6b3ea", "1600210492486-724fe5c67fb0",
  "1600566753051-f0b89df2dd90", "1600573472550-8090b5e0745e",
  "1564013799919-ab600027ffc6", "1511818966892-d7d671e672a2",
  "1486406146926-c627a92ad1ab", "1522708323590-d24dbb6b0267",
  "1505693416388-ac5ce068fe85", "1556912172-45b7abe8b7e1",
  "1613490493576-7fde63acd811", "1494526585095-c41746248156",
  "1493809842364-78817add7ffb",
];
const propertyGallery = (index) => [0, 5, 9, 13].map(
  (offset) => unsplash(propertyPhotoIds[(index + offset) % propertyPhotoIds.length]),
);

const users = [
  { name: "Arjun Malhotra", email: "admin@realestate.com", password: "password123", phone: "+1 310 555 0100", avatar: avatar(1), role: "admin", isEmailVerified: true },
  { name: "Nisha Kapoor", email: "manager@realestate.com", password: "password123", phone: "+1 310 555 0101", avatar: avatar(0), role: "manager", isEmailVerified: true },
  { name: "Sofia Bennett", email: "senior.agent@realestate.com", password: "password123", phone: "+1 310 555 0102", avatar: avatar(2), role: "senior-agent", isEmailVerified: true },
  { name: "Jennifer Martinez", email: "jennifer@realestate.com", password: "password123", phone: "+1 310 555 0103", avatar: avatar(4), role: "agent", isEmailVerified: true },
  { name: "Priya Shah", email: "staff@realestate.com", password: "password123", phone: "+1 310 555 0104", avatar: avatar(6), role: "staff", isEmailVerified: true },
  { name: "Evan Brooks", email: "viewer@realestate.com", password: "password123", phone: "+1 310 555 0105", avatar: avatar(3), role: "viewer", isEmailVerified: true },
  { name: "Marcus Johnson", email: "customer@realestate.com", password: "password123", phone: "+1 310 555 0106", avatar: avatar(5), role: "customer", isEmailVerified: true },
];

const agents = [
  { name: "Sofia Bennett", rank: "Platinum", email: "senior.agent@realestate.com", phone: "+1 310 555 0110", role: "Senior Luxury Advisor", status: "Active", listings: 14, deals: 31, revenue: 4280000, rating: 4.9, avatar: avatar(2) },
  { name: "Jennifer Martinez", rank: "Platinum", email: "jennifer@realestate.com", phone: "+1 310 555 0111", role: "Residential Sales Agent", status: "Active", listings: 11, deals: 27, revenue: 3510000, rating: 4.8, avatar: avatar(4) },
  { name: "David Chen", rank: "Gold", email: "david.chen@example.com", phone: "+1 310 555 0112", role: "Commercial Property Advisor", status: "Active", listings: 9, deals: 19, revenue: 2920000, rating: 4.7, avatar: avatar(7) },
  { name: "Laura Bennett", rank: "Gold", email: "laura.bennett@example.com", phone: "+1 310 555 0113", role: "Buyer Representative", status: "Active", listings: 8, deals: 22, revenue: 2640000, rating: 4.8, avatar: avatar(8) },
  { name: "Michael Reed", rank: "Gold", email: "michael.reed@example.com", phone: "+1 310 555 0114", role: "Investment Property Advisor", status: "Away", listings: 7, deals: 17, revenue: 2380000, rating: 4.6, avatar: avatar(9) },
  { name: "Amina Yusuf", rank: "Silver", email: "amina.yusuf@example.com", phone: "+1 310 555 0115", role: "Leasing Specialist", status: "Active", listings: 10, deals: 15, revenue: 1760000, rating: 4.7, avatar: avatar(10) },
  { name: "Daniel Kim", rank: "Silver", email: "daniel.kim@example.com", phone: "+1 310 555 0116", role: "New Development Agent", status: "Active", listings: 6, deals: 13, revenue: 1940000, rating: 4.5, avatar: avatar(11) },
  { name: "Elena Rossi", rank: "Silver", email: "elena.rossi@example.com", phone: "+1 310 555 0117", role: "Relocation Consultant", status: "Inactive", listings: 4, deals: 10, revenue: 1210000, rating: 4.6, avatar: avatar(12) },
];
const agentAvatar = Object.fromEntries(agents.map((agent) => [agent.name, agent.avatar]));

const staffMembers = [
  { name: "Arjun Malhotra", email: "admin@realestate.com", role: "System Administrator", department: "Administration", status: "Active", joinDate: at("2020-02-10"), avatar: avatar(1) },
  { name: "Nisha Kapoor", email: "manager@realestate.com", role: "Operations Manager", department: "Operations", status: "Active", joinDate: at("2021-04-19"), avatar: avatar(0) },
  { name: "Sofia Bennett", email: "senior.agent@realestate.com", role: "Senior Agent", department: "Sales", status: "Active", joinDate: at("2021-08-02"), avatar: avatar(2) },
  { name: "Jennifer Martinez", email: "jennifer@realestate.com", role: "Agent", department: "Sales", status: "Active", joinDate: at("2022-01-17"), avatar: avatar(4) },
  { name: "Priya Shah", email: "staff@realestate.com", role: "CRM Coordinator", department: "Customer Success", status: "Active", joinDate: at("2023-03-06"), avatar: avatar(6) },
  { name: "Noah Williams", email: "noah.williams@example.com", role: "Finance Analyst", department: "Finance", status: "Active", joinDate: at("2022-09-12"), avatar: avatar(13) },
  { name: "Grace Lee", email: "grace.lee@example.com", role: "Marketing Lead", department: "Marketing", status: "Active", joinDate: at("2022-06-27"), avatar: avatar(14) },
  { name: "Omar Rahman", email: "omar.rahman@example.com", role: "Property Coordinator", department: "Operations", status: "On Leave", joinDate: at("2023-11-13"), avatar: avatar(15) },
  { name: "Chloe Morgan", email: "chloe.morgan@example.com", role: "Compliance Officer", department: "Legal & Compliance", status: "Active", joinDate: at("2021-10-04"), avatar: avatar(16) },
  { name: "Lucas Silva", email: "lucas.silva@example.com", role: "Photographer", department: "Marketing", status: "Active", joinDate: at("2024-02-19"), avatar: avatar(17) },
  { name: "Maya Ortiz", email: "maya.ortiz@example.com", role: "Office Administrator", department: "Administration", status: "Pending", joinDate: at("2026-09-28"), avatar: avatar(3) },
  { name: "Henry Walker", email: "henry.walker@example.com", role: "Facilities Specialist", department: "Operations", status: "Inactive", joinDate: at("2022-12-05"), avatar: avatar(5) },
];

const propertyRows = [
  { name: "Pacific Crest Villa", location: "Malibu, CA", type: "Villa", price: 4850000, beds: 5, baths: 5, garage: 3, sqft: 4380, status: "For Sale", availableFrom: at("2026-10-01"), amenities: ["Swimming Pool", "Ocean View", "Smart Home", "Security", "Parking"], agent: "Sofia Bennett", ownerName: "Mason Property Holdings", ownerEmail: "owner.pacific@example.com", ownerWhatsapp: "+1 310 555 0200", description: "Contemporary coastal villa with a double-height living room, infinity pool, private cinema, and uninterrupted Pacific views." },
  { name: "Marina Sky Penthouse", location: "Marina del Rey, CA", type: "Penthouse", price: 3675000, beds: 4, baths: 4, garage: 2, sqft: 3210, status: "For Sale", availableFrom: at("2026-09-25"), amenities: ["Elevator", "Concierge", "Roof Deck", "Gym", "Parking"], agent: "Jennifer Martinez", ownerName: "Harborline Investments", ownerEmail: "owner.marina@example.com", ownerWhatsapp: "+1 310 555 0201", description: "Full-floor penthouse with wraparound marina views, private elevator entry, chef kitchen, and an expansive entertainment terrace." },
  { name: "Oak & Laurel Residence", location: "Pasadena, CA", type: "Villa", price: 2180000, beds: 4, baths: 3, garage: 2, sqft: 2860, status: "Pending", availableFrom: at("2026-11-15"), amenities: ["Garden", "Fireplace", "Guest House", "Security", "Parking"], agent: "Laura Bennett", ownerName: "Catherine Moore", ownerEmail: "catherine.moore@example.com", ownerWhatsapp: "+1 310 555 0202", description: "Restored character residence combining original millwork with a renovated kitchen, landscaped garden, and detached guest studio." },
  { name: "Wilshire Executive Offices", location: "Los Angeles, CA", type: "Office", price: 5920000, beds: 0, baths: 6, garage: 18, sqft: 11400, status: "For Sale", availableFrom: at("2026-12-01"), amenities: ["Reception", "Boardroom", "Elevator", "Security", "Parking"], agent: "David Chen", ownerName: "Wilshire Capital Partners", ownerEmail: "facilities@wilshirecapital.example", ownerWhatsapp: "+1 310 555 0203", description: "Turnkey Class A office floor with glass meeting suites, executive boardroom, secure access, and dedicated parking." },
  { name: "Silver Lake Garden Loft", location: "Silver Lake, CA", type: "Apartment", price: 895000, beds: 2, baths: 2, garage: 1, sqft: 1280, status: "For Sale", availableFrom: at("2026-09-30"), amenities: ["Garden", "Balcony", "Air Conditioning", "Parking"], agent: "Amina Yusuf", ownerName: "Adrian Foster", ownerEmail: "adrian.foster@example.com", ownerWhatsapp: "+1 310 555 0204", description: "Light-filled loft with polished concrete floors, a private garden patio, custom storage, and walkable neighborhood access." },
  { name: "Bel Air Modern Estate", location: "Bel Air, CA", type: "Villa", price: 8250000, beds: 6, baths: 7, garage: 4, sqft: 7100, status: "For Sale", availableFrom: at("2026-10-20"), amenities: ["Swimming Pool", "Cinema", "Wine Cellar", "Gym", "Smart Home", "Security"], agent: "Michael Reed", ownerName: "Summit Residential Trust", ownerEmail: "owner.belair@example.com", ownerWhatsapp: "+1 310 555 0205", description: "Architect-designed estate featuring seamless indoor-outdoor rooms, a wellness suite, screening room, and resort pool terrace." },
  { name: "Arts District Live-Work Loft", location: "Downtown Los Angeles, CA", type: "Apartment", price: 675000, beds: 1, baths: 1, garage: 1, sqft: 1040, status: "For Rent", availableFrom: at("2026-10-05"), amenities: ["Wi-Fi", "Elevator", "Security", "Parking", "Pet Friendly"], agent: "Daniel Kim", ownerName: "DTLA Living Group", ownerEmail: "leasing@dtlaliving.example", ownerWhatsapp: "+1 310 555 0206", description: "Authentic warehouse conversion with tall ceilings, oversized windows, flexible studio space, and secure resident parking." },
  { name: "Santa Monica Courtyard Home", location: "Santa Monica, CA", type: "Villa", price: 2795000, beds: 4, baths: 4, garage: 2, sqft: 3025, status: "Sold", availableFrom: at("2026-08-01"), amenities: ["Garden", "Solar Power", "Smart Home", "Air Conditioning", "Parking"], agent: "Jennifer Martinez", ownerName: "Olivia Grant", ownerEmail: "olivia.grant@example.com", ownerWhatsapp: "+1 310 555 0207", description: "Warm modern home organized around a private courtyard, with sustainable finishes, flexible work space, and beach access nearby." },
  { name: "Hollywood Hills View House", location: "Hollywood Hills, CA", type: "Villa", price: 3980000, beds: 4, baths: 4, garage: 2, sqft: 3540, status: "For Sale", availableFrom: at("2026-10-12"), amenities: ["City View", "Swimming Pool", "Fireplace", "Smart Home", "Security"], agent: "Sofia Bennett", ownerName: "Canyon View Properties", ownerEmail: "owner.hollywood@example.com", ownerWhatsapp: "+1 310 555 0208", description: "Hillside residence with panoramic city views, retractable glass walls, pool deck, media lounge, and a secluded primary suite." },
  { name: "Beverly Grove Townhome", location: "Beverly Grove, CA", type: "Villa", price: 1895000, beds: 3, baths: 3, garage: 2, sqft: 2240, status: "Pending", availableFrom: at("2026-11-01"), amenities: ["Roof Deck", "Fireplace", "Air Conditioning", "Parking"], agent: "Laura Bennett", ownerName: "Beverly Grove Homes", ownerEmail: "sales@beverlygrove.example", ownerWhatsapp: "+1 310 555 0209", description: "Refined end-unit townhome with open-plan living, a private roof deck, direct garage access, and designer finishes." },
  { name: "Ocean Avenue Residence", location: "Santa Monica, CA", type: "Apartment", price: 1450000, beds: 3, baths: 2, garage: 2, sqft: 1810, status: "For Sale", availableFrom: at("2026-09-27"), amenities: ["Ocean View", "Concierge", "Gym", "Elevator", "Parking"], agent: "Amina Yusuf", ownerName: "Ocean Avenue Residences", ownerEmail: "concierge@oceanavenue.example", ownerWhatsapp: "+1 310 555 0210", description: "Corner residence opposite Palisades Park with ocean-facing living areas, a renovated kitchen, concierge service, and two parking spaces." },
  { name: "Culver Creative Campus", location: "Culver City, CA", type: "Office", price: 7350000, beds: 0, baths: 8, garage: 26, sqft: 16800, status: "For Rent", availableFrom: at("2026-12-15"), amenities: ["Reception", "Courtyard", "Boardroom", "Bike Storage", "Parking", "Security"], agent: "David Chen", ownerName: "Westside Commercial LLC", ownerEmail: "leasing@westsidecommercial.example", ownerWhatsapp: "+1 310 555 0211", description: "Creative office campus with collaborative studios, landscaped courtyards, production rooms, and flexible full-building occupancy." },
  { name: "Manhattan Beach Retreat", location: "Manhattan Beach, CA", type: "Villa", price: 5425000, beds: 5, baths: 5, garage: 3, sqft: 4210, status: "Sold", availableFrom: at("2026-07-10"), amenities: ["Ocean View", "Roof Deck", "Wine Cellar", "Elevator", "Parking"], agent: "Michael Reed", ownerName: "Strand Homes Inc.", ownerEmail: "owner.strand@example.com", ownerWhatsapp: "+1 310 555 0212", description: "Coastal retreat designed for entertaining with a rooftop kitchen, ocean-view great room, elevator, and temperature-controlled wine room." },
  { name: "Echo Park Terrace Apartment", location: "Echo Park, CA", type: "Apartment", price: 520000, beds: 2, baths: 1, garage: 1, sqft: 890, status: "For Rent", availableFrom: at("2026-10-01"), amenities: ["Balcony", "Wi-Fi", "Air Conditioning", "Parking", "Pet Friendly"], agent: "Elena Rossi", ownerName: "Eastside Rental Partners", ownerEmail: "rentals@eastsidepartners.example", ownerWhatsapp: "+1 310 555 0213", description: "Updated two-bedroom apartment with a leafy terrace, efficient workspace, in-unit laundry, and quick access to the lake." },
  { name: "Century City Corner Suite", location: "Century City, CA", type: "Office", price: 3150000, beds: 0, baths: 4, garage: 12, sqft: 6800, status: "For Sale", availableFrom: at("2026-11-20"), amenities: ["Reception", "Boardroom", "City View", "Elevator", "Security", "Parking"], agent: "David Chen", ownerName: "Century Asset Management", ownerEmail: "assets@centuryam.example", ownerWhatsapp: "+1 310 555 0214", description: "High-floor corner office with skyline views, fourteen private offices, adaptable meeting space, and premium building services." },
  { name: "Venice Canal Bungalow", location: "Venice, CA", type: "Villa", price: 2485000, beds: 3, baths: 3, garage: 1, sqft: 1985, status: "For Sale", availableFrom: at("2026-10-18"), amenities: ["Water View", "Garden", "Fireplace", "Air Conditioning"], agent: "Jennifer Martinez", ownerName: "Canal House Trust", ownerEmail: "owner.canal@example.com", ownerWhatsapp: "+1 310 555 0215", description: "Private canal-side bungalow with a landscaped deck, bright living room, flexible guest suite, and easy beach access." },
  { name: "Downtown Skyline Penthouse", location: "Downtown Los Angeles, CA", type: "Penthouse", price: 2890000, beds: 3, baths: 4, garage: 2, sqft: 2740, status: "Pending", availableFrom: at("2026-10-30"), amenities: ["City View", "Concierge", "Gym", "Swimming Pool", "Elevator"], agent: "Sofia Bennett", ownerName: "Skyline Tower Holdings", ownerEmail: "residences@skylinetower.example", ownerWhatsapp: "+1 310 555 0216", description: "Sophisticated tower penthouse with dramatic skyline exposure, hotel-style amenities, private storage, and resident valet service." },
  { name: "Brentwood Family Residence", location: "Brentwood, CA", type: "Villa", price: 3295000, beds: 5, baths: 4, garage: 2, sqft: 3720, status: "Sold", availableFrom: at("2026-06-15"), amenities: ["Garden", "Guest House", "Fireplace", "Solar Power", "Parking"], agent: "Laura Bennett", ownerName: "Richard Hayes", ownerEmail: "richard.hayes@example.com", ownerWhatsapp: "+1 310 555 0217", description: "Inviting family residence with generous living rooms, a detached studio, mature landscaping, and a quiet neighborhood setting." },
];

const properties = propertyRows.map((property, index) => {
  const images = propertyGallery(index);
  return { ...property, agentAvatar: agentAvatar[property.agent], image: images[0], images };
});

const customerRows = [
  ["Marcus Johnson", "customer@realestate.com", "+1 310 555 0300", "Pacific Crest Villa", "website", "Hot"],
  ["Sarah Jenkins", "sarah.jenkins@example.com", "+1 310 555 0301", "Marina Sky Penthouse", "referral", "Warm"],
  ["Raj Patel", "raj.patel@example.com", "+1 310 555 0302", "Oak & Laurel Residence", "website", "Converted"],
  ["Emily Carter", "emily.carter@example.com", "+1 310 555 0303", "Silver Lake Garden Loft", "social", "New"],
  ["Victor Moreau", "victor.moreau@example.com", "+1 310 555 0304", "Bel Air Modern Estate", "referral", "Hot"],
  ["Leila Hassan", "leila.hassan@example.com", "+1 310 555 0305", "Ocean Avenue Residence", "property portal", "Warm"],
  ["Yuki Sato", "yuki.sato@example.com", "+1 310 555 0306", "Arts District Live-Work Loft", "website", "Converted"],
  ["Miguel Santos", "miguel.santos@example.com", "+1 310 555 0307", "Venice Canal Bungalow", "open house", "Hot"],
  ["Clara Hoffmann", "clara.hoffmann@example.com", "+1 310 555 0308", "Hollywood Hills View House", "website", "Warm"],
  ["Andre Silva", "andre.silva@example.com", "+1 310 555 0309", "Century City Corner Suite", "partner", "Converted"],
  ["Nadia Rahman", "nadia.rahman@example.com", "+1 310 555 0310", "Manhattan Beach Retreat", "referral", "Converted"],
  ["Thomas Wright", "thomas.wright@example.com", "+1 310 555 0311", "Echo Park Terrace Apartment", "website", "New"],
  ["Amelia Brooks", "amelia.brooks@example.com", "+1 310 555 0312", "Beverly Grove Townhome", "email campaign", "Warm"],
  ["Kevin O'Brien", "kevin.obrien@example.com", "+1 310 555 0313", "Culver Creative Campus", "commercial referral", "Hot"],
  ["Fatima Noor", "fatima.noor@example.com", "+1 310 555 0314", "Downtown Skyline Penthouse", "social", "New"],
  ["Priya Venkat", "priya.venkat@example.com", "+1 310 555 0315", "Brentwood Family Residence", "open house", "Converted"],
];
const customers = customerRows.map(([name, email, phone, interestedIn, source, status], index) => ({
  name, email, phone, interestedIn, source, status,
  joined: at(`2026-${String((index % 8) + 1).padStart(2, "0")}-${String((index % 20) + 2).padStart(2, "0")}`),
  avatar: avatar(index + 5),
}));
const customerAvatar = Object.fromEntries(customers.map((customer) => [customer.name, customer.avatar]));

const leadRows = [
  ["Isabella Moore", "isabella.moore@example.com", "+1 310 555 0400", "Hot", 2500000, 4000000, "Luxury portal", "Villa", "Sofia Bennett", "Needs a west-facing pool and a private office."],
  ["Liam Anderson", "liam.anderson@example.com", "+1 310 555 0401", "Warm", 700000, 950000, "Website", "Apartment", "Jennifer Martinez", "Relocating in November; prefers a walkable neighborhood."],
  ["Ava Thompson", "ava.thompson@example.com", "+1 310 555 0402", "New", 1800000, 2400000, "Open house", "Villa", "Laura Bennett", "Requested school district and commute comparisons."],
  ["Noah Garcia", "noah.garcia@example.com", "+1 310 555 0403", "Converted", 500000, 750000, "Referral", "Apartment", "Amina Yusuf", "Lease signed for Arts District loft."],
  ["Mia Robinson", "mia.robinson@example.com", "+1 310 555 0404", "Hot", 2800000, 3600000, "Social", "Penthouse", "Sofia Bennett", "Pre-approved and ready to view this week."],
  ["Ethan Clark", "ethan.clark@example.com", "+1 310 555 0405", "Warm", 4500000, 8000000, "Partner", "Office", "David Chen", "Searching for a 12,000+ sq ft creative headquarters."],
  ["Sophia Lewis", "sophia.lewis@example.com", "+1 310 555 0406", "New", 850000, 1200000, "Website", "Apartment", "Elena Rossi", "Needs pet-friendly building with two parking spaces."],
  ["James Walker", "james.walker@example.com", "+1 310 555 0407", "Hot", 3500000, 5000000, "Referral", "Villa", "Michael Reed", "Cash buyer focused on long-term appreciation."],
  ["Charlotte Hall", "charlotte.hall@example.com", "+1 310 555 0408", "Warm", 1200000, 1900000, "Email campaign", "Apartment", "Jennifer Martinez", "Interested in a managed building near the beach."],
  ["Benjamin Young", "benjamin.young@example.com", "+1 310 555 0409", "Converted", 2200000, 3000000, "Open house", "Villa", "Laura Bennett", "Offer accepted on Beverly Grove Townhome."],
  ["Harper King", "harper.king@example.com", "+1 310 555 0410", "New", 600000, 850000, "Property portal", "Apartment", "Amina Yusuf", "First-time buyer requesting lender introduction."],
  ["Alexander Scott", "alexander.scott@example.com", "+1 310 555 0411", "Warm", 2500000, 3400000, "Website", "Office", "David Chen", "Professional services firm seeking a corner floor."],
  ["Evelyn Green", "evelyn.green@example.com", "+1 310 555 0412", "Hot", 2000000, 2900000, "Referral", "Villa", "Jennifer Martinez", "Second viewing requested for Venice Canal Bungalow."],
  ["Daniel Adams", "daniel.adams@example.com", "+1 310 555 0413", "New", 400000, 650000, "Social", "Apartment", "Elena Rossi", "Looking for an investment rental with stable yield."],
  ["Abigail Baker", "abigail.baker@example.com", "+1 310 555 0414", "Warm", 2800000, 3800000, "Luxury portal", "Penthouse", "Sofia Bennett", "Needs concierge service and secure guest parking."],
  ["Henry Nelson", "henry.nelson@example.com", "+1 310 555 0415", "Converted", 3000000, 3600000, "Referral", "Villa", "Laura Bennett", "Completed on Brentwood Family Residence."],
  ["Ella Carter", "ella.carter@example.com", "+1 310 555 0416", "Hot", 4800000, 6500000, "Commercial referral", "Office", "David Chen", "Board approval received; site review pending."],
  ["Jackson Mitchell", "jackson.mitchell@example.com", "+1 310 555 0417", "New", 950000, 1500000, "Website", "Apartment", "Amina Yusuf", "Wants ocean view and on-site fitness facilities."],
];
const leads = leadRows.map(([name, email, phone, status, budgetMin, budgetMax, source, propertyType, assignedTo, notes], index) => ({
  name, email, phone, status, budget: `$${(budgetMin / 1000000).toFixed(1)}M - $${(budgetMax / 1000000).toFixed(1)}M`, budgetMin, budgetMax,
  source, propertyType, assignedTo, avatar: avatar(index), notes,
  createdAt: at(`2026-${String((index % 9) + 1).padStart(2, "0")}-${String((index % 18) + 3).padStart(2, "0")}`),
}));

const dealRows = [
  ["Pacific Crest Villa", 4850000, "Negotiation", "Sofia Bennett", "Marcus Johnson", "2026-10-28"],
  ["Marina Sky Penthouse", 3675000, "Due Diligence", "Jennifer Martinez", "Sarah Jenkins", "2026-10-15"],
  ["Oak & Laurel Residence", 2180000, "Won", "Laura Bennett", "Raj Patel", "2026-02-24"],
  ["Silver Lake Garden Loft", 895000, "New", "Amina Yusuf", "Emily Carter", "2026-11-12"],
  ["Bel Air Modern Estate", 8250000, "Negotiation", "Michael Reed", "Victor Moreau", "2026-12-08"],
  ["Ocean Avenue Residence", 1450000, "New", "Amina Yusuf", "Leila Hassan", "2026-11-20"],
  ["Arts District Live-Work Loft", 675000, "Won", "Daniel Kim", "Yuki Sato", "2026-03-18"],
  ["Venice Canal Bungalow", 2485000, "Due Diligence", "Jennifer Martinez", "Miguel Santos", "2026-10-07"],
  ["Hollywood Hills View House", 3980000, "Negotiation", "Sofia Bennett", "Clara Hoffmann", "2026-11-04"],
  ["Century City Corner Suite", 3150000, "Won", "David Chen", "Andre Silva", "2026-05-22"],
  ["Manhattan Beach Retreat", 5425000, "Won", "Michael Reed", "Nadia Rahman", "2026-06-29"],
  ["Echo Park Terrace Apartment", 520000, "New", "Elena Rossi", "Thomas Wright", "2026-11-30"],
  ["Beverly Grove Townhome", 1895000, "Due Diligence", "Laura Bennett", "Amelia Brooks", "2026-10-19"],
  ["Culver Creative Campus", 7350000, "Negotiation", "David Chen", "Kevin O'Brien", "2026-12-18"],
  ["Downtown Skyline Penthouse", 2890000, "New", "Sofia Bennett", "Fatima Noor", "2026-12-02"],
  ["Brentwood Family Residence", 3295000, "Won", "Laura Bennett", "Priya Venkat", "2026-08-14"],
];
const deals = dealRows.map(([title, value, stage, agent, customer, closeDate], index) => ({
  title, value, price: `$${value.toLocaleString("en-US")}`, stage, agent, avatar: agentAvatar[agent], customer,
  closeDate: at(closeDate), createdAt: at(`2026-${String((index % 9) + 1).padStart(2, "0")}-${String((index % 20) + 1).padStart(2, "0")}`),
}));

const invoiceRows = [
  ["INV-2601", "Raj Patel", "2026-02-25", "2026-03-11", 21800, "Paid", "Buyer representation and closing coordination"],
  ["INV-2602", "Yuki Sato", "2026-03-19", "2026-04-02", 6750, "Paid", "Lease placement and documentation"],
  ["INV-2603", "Andre Silva", "2026-05-23", "2026-06-06", 31500, "Paid", "Commercial acquisition advisory"],
  ["INV-2604", "Nadia Rahman", "2026-06-30", "2026-07-14", 54250, "Paid", "Residential transaction advisory"],
  ["INV-2605", "Priya Venkat", "2026-08-15", "2026-08-29", 32950, "Paid", "Residential transaction advisory"],
  ["INV-2606", "Marcus Johnson", "2026-09-10", "2026-09-24", 24250, "Pending", "Offer and negotiation retainer"],
  ["INV-2607", "Sarah Jenkins", "2026-09-11", "2026-09-25", 18375, "Pending", "Due diligence coordination"],
  ["INV-2608", "Miguel Santos", "2026-08-28", "2026-09-11", 12425, "Overdue", "Inspection and transaction management"],
  ["INV-2609", "Clara Hoffmann", "2026-09-14", "2026-09-28", 19900, "Draft", "Negotiation advisory"],
  ["INV-2610", "Kevin O'Brien", "2026-09-05", "2026-09-19", 36750, "Pending", "Commercial search engagement"],
  ["INV-2611", "Amelia Brooks", "2026-09-02", "2026-09-16", 9475, "Overdue", "Purchase coordination retainer"],
  ["INV-2612", "Fatima Noor", "2026-09-16", "2026-09-30", 14450, "Draft", "Penthouse search advisory"],
];
const invoices = invoiceRows.map(([number, client, issueDate, dueDate, amount, status, description]) => ({
  number, client, issueDate: at(issueDate), dueDate: at(dueDate), amount, status,
  items: [{ description, quantity: 1, unitPrice: amount, total: amount, tax: 0 }],
  avatar: customerAvatar[client], notes: "Payment terms: net 14 days. Please quote the invoice number with remittance.",
}));

const payments = [
  ["PAY-26001", "INV-2601", "Raj Patel", "2026-03-04", "Bank Transfer", 21800, "Completed"],
  ["PAY-26002", "INV-2602", "Yuki Sato", "2026-03-28", "Credit Card", 6750, "Completed"],
  ["PAY-26003", "INV-2603", "Andre Silva", "2026-06-01", "Bank Transfer", 31500, "Completed"],
  ["PAY-26004", "INV-2604", "Nadia Rahman", "2026-07-08", "Bank Transfer", 54250, "Completed"],
  ["PAY-26005", "INV-2605", "Priya Venkat", "2026-08-22", "Bank Transfer", 32950, "Completed"],
  ["PAY-26006", "INV-2606", "Marcus Johnson", "2026-09-15", "Credit Card", 12000, "Pending"],
  ["PAY-26007", "INV-2607", "Sarah Jenkins", "2026-09-16", "Bank Transfer", 18375, "Pending"],
  ["PAY-26008", "INV-2608", "Miguel Santos", "2026-09-12", "Credit Card", 12425, "Failed"],
  ["PAY-26009", "INV-2610", "Kevin O'Brien", "2026-09-17", "Check", 20000, "Pending"],
  ["PAY-26010", "INV-2611", "Amelia Brooks", "2026-09-15", "PayPal", 9475, "Completed"],
].map(([reference, invoice, client, date, method, amount, status]) => ({ reference, invoice, client, date: at(date), method, amount, status, avatar: customerAvatar[client] }));

const appointmentRows = [
  ["Private viewing — Pacific Crest Villa", "Pacific Crest Villa, Malibu", 1, 11, 0, "60 mins", "Marcus Johnson", "Confirmed", "icon-home", "Please prepare the recent inspection report."],
  ["Second viewing — Marina Sky Penthouse", "Marina Sky Penthouse, Marina del Rey", 2, 14, 30, "45 mins", "Sarah Jenkins", "Confirmed", "icon-home", "Client is bringing an interior designer."],
  ["Valuation review — Silver Lake Garden Loft", "Silver Lake Garden Loft, Silver Lake", 3, 10, 0, "45 mins", "Emily Carter", "Pending", "icon-ruler", "Review comparable sales before arrival."],
  ["Investment consultation", "Video call", 4, 9, 30, "30 mins", "Victor Moreau", "Confirmed", "icon-video", "Discuss financing assumptions and resale horizon."],
  ["Open house — Ocean Avenue Residence", "Ocean Avenue Residence, Santa Monica", 5, 12, 0, "3 hrs", "Leila Hassan", "Confirmed", "icon-users", "Concierge will provide guest access."],
  ["Inspection — Venice Canal Bungalow", "Venice Canal Bungalow, Venice", 7, 13, 0, "90 mins", "Miguel Santos", "Pending", "icon-search", "General and roof inspectors attending."],
  ["Contract review — Hollywood Hills View House", "Head Office, Los Angeles", 8, 16, 0, "60 mins", "Clara Hoffmann", "Confirmed", "icon-file-text", "Counsel will join remotely."],
  ["Site tour — Culver Creative Campus", "Culver Creative Campus, Culver City", 10, 10, 30, "90 mins", "Kevin O'Brien", "Pending", "icon-building", "Facilities team of four attending."],
  ["Photography — Downtown Skyline Penthouse", "Downtown Skyline Penthouse, Downtown Los Angeles", -2, 8, 0, "2 hrs", "Fatima Noor", "Completed", "icon-camera", "Twilight exterior set completed."],
  ["Handover — Brentwood Family Residence", "Brentwood Family Residence, Brentwood", -14, 15, 0, "60 mins", "Priya Venkat", "Completed", "icon-key", "Keys and appliance manuals delivered."],
  ["Lease signing — Arts District Live-Work Loft", "Head Office, Los Angeles", -21, 11, 0, "45 mins", "Yuki Sato", "Completed", "icon-file-text", "Signed documents uploaded to client file."],
  ["Viewing — Echo Park Terrace Apartment", "Echo Park Terrace Apartment, Echo Park", -4, 17, 30, "30 mins", "Thomas Wright", "Cancelled", "icon-home", "Client requested a new date next week."],
];
const appointments = appointmentRows.map(([title, location, days, hour, minute, duration, client, status, icon, notes]) => ({
  title, location, when: relativeDate(days, hour, minute), duration, client, avatar: customerAvatar[client], status, icon,
  requesterEmail: customers.find((customer) => customer.name === client)?.email || "",
  requesterWhatsapp: customers.find((customer) => customer.name === client)?.phone || "",
  notificationStatus: status === "Cancelled" ? "skipped" : status === "Pending" ? "queued" : "sent", notes,
}));

const reviewRows = [
  ["Marcus Johnson", "Pacific Crest Villa", 5, "The agent understood our requirements immediately and organized a focused, well-prepared viewing.", false, ""],
  ["Sarah Jenkins", "Marina Sky Penthouse", 5, "Every document and building detail was available before we asked. The process has been exceptionally organized.", true, "Thank you, Sarah. We will keep the due diligence timeline moving and send the final building file this week."],
  ["Raj Patel", "Oak & Laurel Residence", 5, "Laura handled the negotiation calmly and kept every milestone on schedule through closing.", true, "It was a pleasure representing you. We hope you enjoy the new home."],
  ["Emily Carter", "Silver Lake Garden Loft", 4, "Beautiful property and a useful neighborhood briefing. I would have liked an earlier evening appointment.", false, ""],
  ["Victor Moreau", "Bel Air Modern Estate", 5, "Michael's investment analysis was specific, practical, and much more useful than a standard sales presentation.", true, "Thank you. We will include the revised operating-cost model in your next briefing."],
  ["Leila Hassan", "Ocean Avenue Residence", 4, "The virtual preview matched the property well and saved us a lot of time before the in-person tour.", false, ""],
  ["Yuki Sato", "Arts District Live-Work Loft", 5, "Fast lease process, clear communication, and no last-minute surprises.", true, "We are glad the move went smoothly. Welcome to the neighborhood."],
  ["Miguel Santos", "Venice Canal Bungalow", 4, "The inspection planning has been thorough and all questions are answered quickly.", false, ""],
  ["Clara Hoffmann", "Hollywood Hills View House", 5, "Sofia balances market knowledge with honest advice. We always know where the negotiation stands.", true, "Thank you, Clara. We will continue to update you after each seller response."],
  ["Andre Silva", "Century City Corner Suite", 5, "David coordinated legal, facilities, and finance teams without losing momentum.", true, "Thank you, Andre. We appreciate the trust your team placed in us."],
  ["Nadia Rahman", "Manhattan Beach Retreat", 4, "Professional from first tour through completion. The digital transaction room was especially helpful.", false, ""],
  ["Priya Venkat", "Brentwood Family Residence", 5, "A smooth purchase and handover. The team caught small issues early and resolved them before closing.", true, "Thank you, Priya. We wish your family many happy years in Brentwood."],
];
const reviews = reviewRows.map(([author, property, rating, comment, replied, reply], index) => ({
  author, avatar: customerAvatar[author], property, rating, comment, date: at(`2026-${String((index % 8) + 2).padStart(2, "0")}-${String((index % 19) + 3).padStart(2, "0")}`), replied, reply,
}));

const taxonomies = [
  { name: "Villa", icon: "icon-hotel", badge: "bg-secondary", usedIn: 9, status: "Active", kind: "category" },
  { name: "Apartment", icon: "icon-building-2", badge: "bg-primary", usedIn: 4, status: "Active", kind: "category" },
  { name: "Penthouse", icon: "icon-building", badge: "bg-info", usedIn: 2, status: "Active", kind: "category" },
  { name: "Office", icon: "icon-briefcase", badge: "bg-orange", usedIn: 3, status: "Active", kind: "category" },
  { name: "Land", icon: "icon-trees", badge: "bg-teal", usedIn: 0, status: "Inactive", kind: "category" },
  { name: "Commercial", icon: "icon-store", badge: "bg-warning", usedIn: 3, status: "Active", kind: "category" },
  { name: "Wi-Fi", icon: "icon-wifi", usedIn: 6, status: "Active", kind: "amenity" },
  { name: "Parking", icon: "icon-car", usedIn: 16, status: "Active", kind: "amenity" },
  { name: "Swimming Pool", icon: "icon-waves", usedIn: 5, status: "Active", kind: "amenity" },
  { name: "Gym", icon: "icon-dumbbell", usedIn: 5, status: "Active", kind: "amenity" },
  { name: "Security", icon: "icon-shield-check", usedIn: 10, status: "Active", kind: "amenity" },
  { name: "Garden", icon: "icon-trees", usedIn: 7, status: "Active", kind: "amenity" },
  { name: "Air Conditioning", icon: "icon-snowflake", usedIn: 9, status: "Active", kind: "amenity" },
  { name: "Elevator", icon: "icon-arrow-up-down", usedIn: 8, status: "Active", kind: "amenity" },
  { name: "Smart Home", icon: "icon-house-plug", usedIn: 5, status: "Active", kind: "amenity" },
  { name: "Concierge", icon: "icon-bell", usedIn: 4, status: "Active", kind: "amenity" },
];

const tours = [0, 1, 3, 5, 8, 11, 12, 16].map((propertyIndex, index) => ({
  property: properties[propertyIndex].name, location: properties[propertyIndex].location,
  image: properties[propertyIndex].image, duration: ["3:42", "4:18", "2:56", "5:21", "4:07", "3:33", "5:08", "4:44"][index],
  views: [2840, 2315, 1180, 3950, 2675, 940, 3120, 1785][index], status: index === 5 ? "Draft" : "Published",
}));

const transactions = [
  ["TXN-26001", "Credit", "Commission — Oak & Laurel Residence", "2026-02-25", "Operating Account", 65400, "Completed"],
  ["TXN-26002", "Debit", "February campaign and listing media", "2026-02-28", "Marketing Account", 8200, "Completed"],
  ["TXN-26003", "Credit", "Commission — Arts District Live-Work Loft", "2026-03-19", "Operating Account", 20250, "Completed"],
  ["TXN-26004", "Debit", "CRM and listing platform subscriptions", "2026-03-30", "Operating Account", 4650, "Completed"],
  ["TXN-26005", "Credit", "Commission — Century City Corner Suite", "2026-05-23", "Operating Account", 94500, "Completed"],
  ["TXN-26006", "Debit", "Commercial property valuation services", "2026-05-25", "Operating Account", 7200, "Completed"],
  ["TXN-26007", "Credit", "Commission — Manhattan Beach Retreat", "2026-06-30", "Operating Account", 162750, "Completed"],
  ["TXN-26008", "Debit", "June payroll distribution", "2026-06-30", "Payroll Account", 68400, "Completed"],
  ["TXN-26009", "Debit", "Professional photography and aerial media", "2026-07-12", "Marketing Account", 5850, "Completed"],
  ["TXN-26010", "Credit", "Referral partnership income", "2026-07-28", "Operating Account", 12400, "Completed"],
  ["TXN-26011", "Credit", "Commission — Brentwood Family Residence", "2026-08-15", "Operating Account", 98850, "Completed"],
  ["TXN-26012", "Debit", "August open-house events", "2026-08-23", "Marketing Account", 6300, "Completed"],
  ["TXN-26013", "Debit", "August payroll distribution", "2026-08-31", "Payroll Account", 70200, "Completed"],
  ["TXN-26014", "Credit", "Advisory retainer — Culver Creative Campus", "2026-09-06", "Operating Account", 36750, "Completed"],
  ["TXN-26015", "Debit", "Agent travel and mileage reimbursements", "2026-09-10", "Expense Account", 3280, "Completed"],
  ["TXN-26016", "Credit", "Buyer representation retainers", "2026-09-14", "Operating Account", 42625, "Pending"],
  ["TXN-26017", "Debit", "Quarterly insurance premium", "2026-09-15", "Operating Account", 9400, "Pending"],
  ["TXN-26018", "Debit", "Duplicate listing media charge", "2026-09-16", "Marketing Account", 850, "Failed"],
].map(([reference, type, description, date, account, amount, status]) => ({ reference, type, description, date: at(date), account, amount, status }));

const reimbursementTypes = [
  { name: "Daily Subsistence Allowance", code: "ALW-DAILY", kind: "Allowance", category: "Daily Allowance", description: "Daily allowance for approved out-of-area business travel.", defaultLimit: 125, receiptRequired: false, taxable: false, active: true },
  { name: "Housing Allowance", code: "ALW-HOUSING", kind: "Allowance", category: "Housing", description: "Temporary housing support approved by Human Resources.", defaultLimit: 1800, receiptRequired: true, taxable: true, active: true },
  { name: "Phone & Internet Allowance", code: "ALW-COMMS", kind: "Allowance", category: "Communication", description: "Monthly business communication allowance.", defaultLimit: 100, receiptRequired: false, taxable: false, active: true },
  { name: "Air & Rail Travel", code: "EXP-TRAVEL", kind: "Expense", category: "Travel", description: "Approved air, rail, taxi, and transit costs.", defaultLimit: 2500, receiptRequired: true, taxable: false, active: true },
  { name: "Business Mileage", code: "EXP-MILEAGE", kind: "Expense", category: "Mileage", description: "Mileage reimbursement for approved private-vehicle use.", defaultLimit: 500, receiptRequired: false, taxable: false, active: true },
  { name: "Food & Meals", code: "EXP-MEALS", kind: "Expense", category: "Food & Meals", description: "Meals purchased during approved business activity.", defaultLimit: 175, receiptRequired: true, taxable: false, active: true },
  { name: "Hotel & Accommodation", code: "EXP-HOTEL", kind: "Expense", category: "Accommodation", description: "Accommodation for approved travel and events.", defaultLimit: 1200, receiptRequired: true, taxable: false, active: true },
  { name: "Fuel & Parking", code: "EXP-FUEL", kind: "Expense", category: "Fuel", description: "Fuel, toll, and parking costs for business journeys.", defaultLimit: 350, receiptRequired: true, taxable: false, active: true },
  { name: "Client Entertainment", code: "EXP-CLIENT", kind: "Expense", category: "Client Entertainment", description: "Pre-approved client meetings and hospitality.", defaultLimit: 750, receiptRequired: true, taxable: false, active: true },
  { name: "Training & Certification", code: "EXP-TRAIN", kind: "Expense", category: "Training", description: "Approved courses, examinations, and professional certifications.", defaultLimit: 2000, receiptRequired: true, taxable: false, active: true },
];

const reimbursements = [
  { claimNumber: "RMB-2026-1001", employeeName: "Sofia Bennett", employeeEmail: "senior.agent@realestate.com", kind: "Expense", category: "Travel", description: "Airfare and transfer for the West Coast luxury property forum.", amount: 860, expenseDate: at("2026-08-16"), submittedDate: at("2026-08-18"), status: "Paid", paymentMethod: "Bank Transfer", receiptNumber: "AIR-84925", approvedBy: "Nisha Kapoor", paymentReference: "PAY-RMB-1001", taxable: false, recurring: false },
  { claimNumber: "RMB-2026-1002", employeeName: "Jennifer Martinez", employeeEmail: "jennifer@realestate.com", kind: "Expense", category: "Food & Meals", description: "Client lunch following the Marina Sky inspection.", amount: 148, expenseDate: at("2026-08-22"), submittedDate: at("2026-08-23"), status: "Approved", paymentMethod: "Payroll", receiptNumber: "MEAL-2208", approvedBy: "Nisha Kapoor", taxable: false, recurring: false },
  { claimNumber: "RMB-2026-1003", employeeName: "Priya Shah", employeeEmail: "staff@realestate.com", kind: "Allowance", category: "Communication", description: "Monthly business phone and internet allowance.", amount: 95, expenseDate: at("2026-09-01"), submittedDate: at("2026-09-01"), status: "Paid", paymentMethod: "Payroll", approvedBy: "Nisha Kapoor", paymentReference: "PAY-RMB-1003", taxable: false, recurring: true },
  { claimNumber: "RMB-2026-1004", employeeName: "Nisha Kapoor", employeeEmail: "manager@realestate.com", kind: "Expense", category: "Accommodation", description: "Two nights for the national brokerage operations summit.", amount: 620, expenseDate: at("2026-09-04"), submittedDate: at("2026-09-06"), status: "Under Review", paymentMethod: "Not Assigned", receiptNumber: "HTL-49218", taxable: false, recurring: false },
  { claimNumber: "RMB-2026-1005", employeeName: "Jennifer Martinez", employeeEmail: "jennifer@realestate.com", kind: "Expense", category: "Mileage", description: "August client viewings and listing inspections.", amount: 284, expenseDate: at("2026-08-31"), submittedDate: at("2026-09-02"), status: "Submitted", paymentMethod: "Not Assigned", receiptNumber: "MILE-0826", taxable: false, recurring: false },
  { claimNumber: "RMB-2026-1006", employeeName: "Sofia Bennett", employeeEmail: "senior.agent@realestate.com", kind: "Allowance", category: "Daily Allowance", description: "Three-day subsistence allowance for regional site visits.", amount: 375, expenseDate: at("2026-09-08"), submittedDate: at("2026-09-09"), status: "Approved", paymentMethod: "Payroll", approvedBy: "Nisha Kapoor", taxable: false, recurring: false },
  { claimNumber: "RMB-2026-1007", employeeName: "Priya Shah", employeeEmail: "staff@realestate.com", kind: "Expense", category: "Office Supplies", description: "Presentation folders and transaction documentation supplies.", amount: 126, expenseDate: at("2026-09-10"), submittedDate: at("2026-09-11"), status: "Draft", paymentMethod: "Not Assigned", receiptNumber: "OFF-7714", taxable: false, recurring: false },
  { claimNumber: "RMB-2026-1008", employeeName: "Nisha Kapoor", employeeEmail: "manager@realestate.com", kind: "Expense", category: "Client Entertainment", description: "Hospitality expense submitted above the pre-approved policy limit.", amount: 980, expenseDate: at("2026-08-28"), submittedDate: at("2026-08-30"), status: "Rejected", paymentMethod: "Not Assigned", receiptNumber: "EVT-3380", approvedBy: "Arjun Malhotra", taxable: false, recurring: false, notes: "Rejected because the approved policy limit was exceeded." },
  { claimNumber: "RMB-2026-1009", employeeName: "Lucas Silva", employeeEmail: "lucas.silva@example.com", kind: "Expense", category: "Fuel", description: "Fuel and parking for three property photography assignments.", amount: 212, expenseDate: at("2026-09-12"), submittedDate: at("2026-09-13"), status: "Submitted", paymentMethod: "Company Card", receiptNumber: "FUEL-0912", taxable: false, recurring: false },
  { claimNumber: "RMB-2026-1010", employeeName: "Chloe Morgan", employeeEmail: "chloe.morgan@example.com", kind: "Expense", category: "Training", description: "Annual fair housing and brokerage compliance certification.", amount: 475, expenseDate: at("2026-09-03"), submittedDate: at("2026-09-04"), status: "Paid", paymentMethod: "Bank Transfer", receiptNumber: "CERT-2609", approvedBy: "Nisha Kapoor", paymentReference: "PAY-RMB-1010", taxable: false, recurring: false },
];

const notificationTemplates = [
  { title: "High-value lead assigned", message: "Isabella Moore was assigned to Sofia Bennett for immediate follow-up.", avatar: avatar(0), online: true },
  { title: "Viewing confirmed", message: "Pacific Crest Villa is scheduled for tomorrow at 11:00 AM.", initials: "PV", badgeClass: "bg-secondary-transparent text-secondary", online: true },
  { title: "Offer moved to due diligence", message: "Marina Sky Penthouse has entered the due-diligence stage.", avatar: customerAvatar["Sarah Jenkins"] },
  { title: "Payment received", message: "INV-2605 was paid in full by Priya Venkat.", icon: "icon-circle-dollar-sign", badgeClass: "bg-success-transparent text-success" },
  { title: "Reimbursement awaiting review", message: "RMB-2026-1004 requires an administrator decision.", icon: "icon-receipt", badgeClass: "bg-warning-transparent text-warning" },
  { title: "New customer review", message: "Clara Hoffmann left a five-star review for the sales team.", avatar: customerAvatar["Clara Hoffmann"] },
  { title: "Invoice overdue", message: "INV-2608 is overdue and needs collection follow-up.", initials: "AR", badgeClass: "bg-danger-transparent text-danger" },
  { title: "Property media published", message: "The Pacific Crest Villa tour is live in the media library.", icon: "icon-video", badgeClass: "bg-primary-transparent text-primary" },
];

const chatTemplates = [
  { senderEmail: "manager@realestate.com", recipientEmail: "senior.agent@realestate.com", text: "The Pacific Crest offer is approved for the next negotiation round.", createdAt: relativeDate(-2, 9, 15), read: true },
  { senderEmail: "senior.agent@realestate.com", recipientEmail: "manager@realestate.com", text: "Thanks. I have sent the revised terms and updated the deal record.", createdAt: relativeDate(-2, 9, 22), read: true },
  { senderEmail: "staff@realestate.com", recipientEmail: "jennifer@realestate.com", text: "The Marina Sky disclosure package is complete and in the shared file.", createdAt: relativeDate(-1, 14, 10), read: true },
  { senderEmail: "jennifer@realestate.com", recipientEmail: "staff@realestate.com", text: "Perfect, I will review it before the client call this afternoon.", createdAt: relativeDate(-1, 14, 18), read: true },
  { senderEmail: "admin@realestate.com", recipientEmail: "manager@realestate.com", text: "Please review the September reimbursement queue before payroll closes.", createdAt: relativeDate(0, 8, 35), read: false },
  { senderEmail: "manager@realestate.com", recipientEmail: "admin@realestate.com", text: "Understood. I will finish the approvals by 3 PM.", createdAt: relativeDate(0, 8, 41), read: false },
  { senderEmail: "senior.agent@realestate.com", recipientEmail: "jennifer@realestate.com", text: "Can you cover the Ocean Avenue open house on Saturday?", createdAt: relativeDate(0, 10, 5), read: false },
  { senderEmail: "jennifer@realestate.com", recipientEmail: "senior.agent@realestate.com", text: "Yes, I have reserved the time and will coordinate with the concierge.", createdAt: relativeDate(0, 10, 12), read: false },
];

const auditLogs = [
  { actor: "Arjun Malhotra", action: "updated", resource: "roles", recordId: "manager", label: "Manager sidebar permissions", createdAt: at("2026-09-16") },
  { actor: "Nisha Kapoor", action: "approved", resource: "reimbursements", recordId: "RMB-2026-1006", label: "Daily allowance claim", createdAt: at("2026-09-15") },
  { actor: "Jennifer Martinez", action: "updated", resource: "deals", recordId: "Marina Sky Penthouse", label: "Moved deal to due diligence", createdAt: at("2026-09-14") },
  { actor: "Priya Shah", action: "created", resource: "appointments", recordId: "Pacific Crest Villa", label: "Private property viewing", createdAt: at("2026-09-13") },
  { actor: "Sofia Bennett", action: "created", resource: "leads", recordId: "Isabella Moore", label: "Luxury buyer lead", createdAt: at("2026-09-12") },
  { actor: "Nisha Kapoor", action: "updated", resource: "properties", recordId: "Culver Creative Campus", label: "Commercial listing availability", createdAt: at("2026-09-10") },
];

const organization = {
  key: "organization", companyName: "Thumani Real Estate", timezone: "America/Los_Angeles",
  currency: "USD", website: "https://socailsync.com", contactEmail: "admin@realestate.com",
  address: "1000 Wilshire Boulevard, Los Angeles, CA 90017",
};

module.exports = {
  users, agents, leads, properties, customers, deals, invoices, payments,
  appointments, staffMembers, reviews, taxonomies, tours, transactions,
  reimbursements, reimbursementTypes, notificationTemplates, chatTemplates,
  auditLogs, organization,
};
