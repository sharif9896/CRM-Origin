import type { Deal, DealStage } from "./types";

export const DEAL_STAGES: DealStage[] = ["New", "Negotiation", "Due Diligence", "Won"];

export const dealStageClass: Record<DealStage, string> = {
  New: "bg-primary/10 text-primary",
  Negotiation: "bg-warning/10 text-warning",
  "Due Diligence": "bg-info/10 text-info",
  Won: "bg-success/10 text-success",
};

export const dealStageHover: Record<DealStage, string> = {
  New: "hover:border-primary/50",
  Negotiation: "hover:border-warning/50",
  "Due Diligence": "hover:border-info/50",
  Won: "",
};

export const deals: Deal[] = [
  { id: "1", title: "Mariana Luxury Villa", price: "$850,000", value: 850000, stage: "New", agent: "Jennifer", avatar: "assets/img/avatar/avatar-02.jpg", customer: "Alexander Kenn", closeDate: "12 Aug 2026" },
  { id: "2", title: "Sunset Beach House", price: "$725,000", value: 725000, stage: "New", agent: "Gabriella", avatar: "assets/img/avatar/avatar-03.jpg", customer: "Sarah Jenkins", closeDate: "19 Aug 2026" },
  { id: "3", title: "Downtown Penthouse", price: "$1.2M", value: 1200000, stage: "New", agent: "Christopher", avatar: "assets/img/avatar/avatar-04.jpg", customer: "Raj Patel", closeDate: "24 Aug 2026" },
  { id: "4", title: "Hillcrest Manor", price: "$2.1M", value: 2100000, stage: "Negotiation", agent: "Penelope", avatar: "assets/img/avatar/avatar-05.jpg", customer: "Emily Carter", closeDate: "02 Aug 2026" },
  { id: "5", title: "Riverside Plaza", price: "$1.5M", value: 1500000, stage: "Negotiation", agent: "Daniel", avatar: "assets/img/avatar/avatar-06.jpg", customer: "Victor Moreau", closeDate: "08 Aug 2026" },
  { id: "6", title: "Oceanview Estates", price: "$1.8M", value: 1800000, stage: "Negotiation", agent: "Olivia", avatar: "assets/img/avatar/avatar-07.jpg", customer: "Leila Hassan", closeDate: "15 Aug 2026" },
  { id: "7", title: "Palm Residency", price: "$2.5M", value: 2500000, stage: "Due Diligence", agent: "Jennifer", avatar: "assets/img/avatar/avatar-02.jpg", customer: "Kevin O'Brien", closeDate: "29 Jul 2026" },
  { id: "8", title: "Urban Heights", price: "$3.2M", value: 3200000, stage: "Due Diligence", agent: "Gabriella", avatar: "assets/img/avatar/avatar-03.jpg", customer: "Yuki Sato", closeDate: "05 Aug 2026" },
  { id: "9", title: "Garden District", price: "$2.8M", value: 2800000, stage: "Due Diligence", agent: "Christopher", avatar: "assets/img/avatar/avatar-04.jpg", customer: "Miguel Santos", closeDate: "12 Aug 2026" },
  { id: "10", title: "Lakeside Villa", price: "$1.8M", value: 1800000, stage: "Won", agent: "Penelope", avatar: "assets/img/avatar/avatar-05.jpg", customer: "Clara Hoffmann", closeDate: "11 Jul 2026" },
  { id: "11", title: "Heritage House", price: "$2.2M", value: 2200000, stage: "Won", agent: "Daniel", avatar: "assets/img/avatar/avatar-06.jpg", customer: "Andre Silva", closeDate: "03 Jul 2026" },
  { id: "12", title: "Summit Estate", price: "$2M", value: 2000000, stage: "Won", agent: "Olivia", avatar: "assets/img/avatar/avatar-07.jpg", customer: "Nadia Rahman", closeDate: "27 Jun 2026" },
];
