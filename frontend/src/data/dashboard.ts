export const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export const revenueOverview = {
  rentals: [58, 85, 42, 30, 83, 100, 80, 95, 75, 95, 75, 97],
  sales: [42, 55, 76, 110, 59, 35, 48, 43, 71, 38, 45, 43],
};

export const visitsInquiries = {
  visits: [360, 350, 360, 380, 390, 420, 450, 550, 480, 400, 450, 400],
  inquiries: [300, 290, 300, 310, 360, 370, 400, 420, 370, 310, 350, 310],
};

export const newLeadsSpark = [
  { x: "1", y: [40, 90] },
  { x: "2", y: [15, 60] },
  { x: "3", y: [40, 90] },
  { x: "4", y: [15, 60] },
  { x: "5", y: [40, 90] },
  { x: "6", y: [15, 60] },
  { x: "7", y: [30, 80] },
];

export const propertyVisitsSpark = [35, 55, 70, 80, 75, 50, 65];

export const propertyCategoriesChart = {
  categories: ["Apartments", "Houses", "Villas", "Commercial", "Land"],
  data: [140, 100, 135, 125, 90],
};

export const propertyStatusChart = {
  series: [50, 25, 15, 10],
  labels: ["Sold", "Pending", "Rent", "Active"],
};

export const propertyDistribution = [
  { label: "Residental", percent: 25, dot: "bg-secondary", bar: "bg-secondary" },
  { label: "Commercial", percent: 10, dot: "bg-primary", bar: "bg-primary" },
  { label: "Industrial", percent: 15, dot: "bg-warning", bar: "bg-warning" },
  { label: "Land", percent: 8, dot: "bg-danger", bar: "bg-danger" },
];

export const salesPipeline = [
  { label: "New Leads", count: 45, amount: "$56,565", gradient: "bg-secondary-gradient" },
  { label: "Contacted", count: 32, amount: "$45,535", gradient: "bg-primary-gradient" },
  { label: "Qualified", count: 28, amount: "$32,658", gradient: "bg-warning-gradient" },
  { label: "Proposal", count: 18, amount: "$24,569", gradient: "bg-info-gradient" },
  { label: "Negotiation", count: 12, amount: "$18,547", gradient: "bg-danger-gradient" },
  { label: "Closed", count: 8, amount: "$16,698", gradient: "bg-success-gradient" },
];

export const featuredListings = [
  {
    id: 1,
    name: "Mariana High Apartments",
    image: "assets/img/dashboard/villa-img-1.jpg",
    location: "1450 Avenue,Los Angeles",
    price: "$35,12,500",
    type: "Villa",
    typeClass: "bg-danger",
    tag: "For Sale",
    tagClass: "bg-info",
    beds: 4,
    baths: 4,
    area: "1526 Sq Ft.",
  },
  {
    id: 2,
    name: "Skyline Residences",
    image: "assets/img/dashboard/villa-img-2.jpg",
    location: "720 Sunset, Los Angeles,",
    price: "$48,75,000",
    type: "Penthouse",
    typeClass: "bg-danger",
    tag: "Rent",
    tagClass: "bg-orange",
    beds: 3,
    baths: 2,
    area: "1456 Sq Ft.",
  },
];

export const propertyStatusLegend = [
  { label: "Available", value: 142, dot: "bg-secondary" },
  { label: "Rented", value: 64, dot: "bg-primary" },
  { label: "Sold", value: 48, dot: "bg-teal" },
  { label: "Pending", value: 38, dot: "bg-warning" },
];

export type TopAgent = {
  rank: number;
  name: string;
  role: string;
  avatar?: string;
  initials?: string;
  sales: number;
  revenue: string;
};

export const topAgents: TopAgent[] = [
  { rank: 1, name: "Jennifer Martinez", role: "Senior Agent", avatar: "assets/img/avatar/avatar-02.jpg", sales: 48, revenue: "$4.2M" },
  { rank: 2, name: "David Kim", role: "Lead Agent", avatar: "assets/img/avatar/avatar-03.jpg", sales: 34, revenue: "$3.5M" },
  { rank: 3, name: "Maria Wilson", role: "Property Specialist", initials: "MW", sales: 29, revenue: "$5.2M" },
  { rank: 4, name: "Liam O'Connor", role: "Sales Agent", avatar: "assets/img/avatar/avatar-06.jpg", sales: 41, revenue: "$7.2M" },
];

export type RecentLead = {
  id: number;
  name: string;
  email: string;
  avatar: string;
  property: string;
  propertyImage: string;
  source: string;
  status: "New" | "Warm" | "Hot";
  date: string;
};

export const recentLeads: RecentLead[] = [
  {
    id: 1,
    name: "Alexander Kenn",
    email: "alex@example.com",
    avatar: "assets/img/avatar/avatar-02.jpg",
    property: "Mariana Height Apartments",
    propertyImage: "assets/img/dashboard/villa-img-1.jpg",
    source: "Website",
    status: "New",
    date: "11 Sep 2026, 10:40 AM",
  },
  {
    id: 2,
    name: "Gabriella White",
    email: "gab@example.com",
    avatar: "assets/img/avatar/avatar-03.jpg",
    property: "Sunset Villa",
    propertyImage: "assets/img/dashboard/villa-img-2.jpg",
    source: "Social Media",
    status: "Warm",
    date: "05 Sep 2026, 11:40 AM",
  },
  {
    id: 3,
    name: "Christopher Rey",
    email: "chris@example.com",
    avatar: "assets/img/avatar/avatar-04.jpg",
    property: "Downtown Loft",
    propertyImage: "assets/img/dashboard/villa-img-3.jpg",
    source: "Referrals",
    status: "Hot",
    date: "12 Aug 2026, 07:40 PM",
  },
  {
    id: 4,
    name: "Penelope Ton",
    email: "pen@example.com",
    avatar: "assets/img/avatar/avatar-05.jpg",
    property: "Palm Residency",
    propertyImage: "assets/img/dashboard/villa-img-4.jpg",
    source: "Agent",
    status: "New",
    date: "16 Aug 2026, 09:22 PM",
  },
  {
    id: 5,
    name: "Catherine Lan",
    email: "cath@example.com",
    avatar: "assets/img/avatar/avatar-06.jpg",
    property: "Ocean View Condo",
    propertyImage: "assets/img/dashboard/villa-img-5.jpg",
    source: "Website",
    status: "New",
    date: "18 May 2026, 11:22 AM",
  },
];

export const recentLeadStatusClass: Record<RecentLead["status"], string> = {
  New: "text-success border-success",
  Warm: "text-warning border-warning",
  Hot: "text-danger border-danger",
};

export const propertyLocations = [
  { name: "Washington", value: [-120.5, 47.5], price: "$25k" },
  { name: "Nevada", value: [-117.0, 38.5], price: "$35k" },
  { name: "Utah", value: [-111.5, 39.5], price: "$42k" },
  { name: "Arizona", value: [-111.5, 34.0], price: "$28k" },
  { name: "Wyoming", value: [-107.5, 43.0], price: "$19k" },
  { name: "Colorado", value: [-105.5, 39.0], price: "$50k" },
  { name: "Kansas", value: [-98.5, 38.5], price: "$32k" },
  { name: "Texas", value: [-99.5, 31.5], price: "$65k" },
  { name: "Austin", value: [-97.74, 30.26], price: "$48k" },
  { name: "Illinois", value: [-89.0, 40.0], price: "$55k" },
  { name: "Ohio", value: [-82.5, 40.0], price: "$38k" },
];
