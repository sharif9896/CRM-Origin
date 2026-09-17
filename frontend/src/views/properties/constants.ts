import type { PropertyStatus, PropertyType } from "../../data/types";

export const propertyStatusClass: Record<PropertyStatus, string> = {
  "For Sale": "text-info border-info",
  "For Rent": "text-orange border-orange",
  Sold: "text-success border-success",
  Pending: "text-warning border-warning",
};

export const propertyStatusSolid: Record<PropertyStatus, string> = {
  "For Sale": "bg-info",
  "For Rent": "bg-orange",
  Sold: "bg-success",
  Pending: "bg-warning",
};

export const propertyTypeClass: Record<PropertyType, string> = {
  Villa: "bg-danger",
  Apartment: "bg-secondary",
  Penthouse: "bg-danger",
  Office: "bg-teal",
};

export const PROPERTY_STATUSES: PropertyStatus[] = ["For Sale", "For Rent", "Sold", "Pending"];

export const PROPERTY_TYPES: PropertyType[] = ["Villa", "Apartment", "Penthouse", "Office"];

export const formatPrice = (value: number) => `$${value.toLocaleString("en-US")}`;
