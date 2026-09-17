import type { LeadStatus } from "./types";

export const leadStatusClass: Record<LeadStatus, string> = {
  New: "text-success border-success",
  Warm: "text-warning border-warning",
  Hot: "text-danger border-danger",
  Converted: "text-info border-info",
};

export const LEAD_STATUSES: LeadStatus[] = ["New", "Warm", "Hot", "Converted"];
