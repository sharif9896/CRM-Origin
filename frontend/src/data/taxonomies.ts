import type { Taxonomy, Tour } from "./types";

export const TAXONOMY_STATUSES = ["Active", "Inactive"];

export const taxonomyStatusClass: Record<Taxonomy["status"], string> = {
  Active: "text-success border-success",
  Inactive: "text-danger border-danger",
};

export const categories: Taxonomy[] = [
  { id: "1", name: "Villa", icon: "icon-hotel", badge: "bg-secondary", usedIn: 486, status: "Active" },
  { id: "2", name: "Apartment", icon: "icon-building-2", badge: "bg-primary", usedIn: 912, status: "Active" },
  { id: "3", name: "Penthouse", icon: "icon-building", badge: "bg-info", usedIn: 234, status: "Active" },
  { id: "4", name: "Office", icon: "icon-briefcase", badge: "bg-orange", usedIn: 158, status: "Active" },
  { id: "5", name: "Land", icon: "icon-trees", badge: "bg-teal", usedIn: 97, status: "Inactive" },
  { id: "6", name: "Commercial", icon: "icon-store", badge: "bg-warning", usedIn: 143, status: "Active" },
];

export const amenities: Taxonomy[] = [
  { id: "1", name: "Wi-Fi", icon: "icon-wifi", usedIn: 1842, status: "Active" },
  { id: "2", name: "Parking", icon: "icon-car", usedIn: 2104, status: "Active" },
  { id: "3", name: "Swimming Pool", icon: "icon-waves", usedIn: 687, status: "Active" },
  { id: "4", name: "Gym", icon: "icon-dumbbell", usedIn: 914, status: "Active" },
  { id: "5", name: "Security", icon: "icon-shield-check", usedIn: 1556, status: "Active" },
  { id: "6", name: "Garden", icon: "icon-trees", usedIn: 742, status: "Active" },
  { id: "7", name: "Air Conditioning", icon: "icon-snowflake", usedIn: 1320, status: "Active" },
  { id: "8", name: "Elevator", icon: "icon-arrow-up-down", usedIn: 498, status: "Inactive" },
];

export const tours: Tour[] = [
  { id: "1", property: "Mariana High Apartments", location: "Los Angeles, CA", image: "assets/img/dashboard/villa-img-1.jpg", duration: "3:24", views: 1284, status: "Published" },
  { id: "2", property: "Skyline Residences", location: "Santa Monica, CA", image: "assets/img/dashboard/villa-img-2.jpg", duration: "4:10", views: 968, status: "Published" },
  { id: "3", property: "The Grand Metropolitan", location: "Pasadena, CA", image: "assets/img/dashboard/villa-img-3.jpg", duration: "2:47", views: 742, status: "Published" },
  { id: "4", property: "Oceanview Villa", location: "Beverly Hills, CA", image: "assets/img/dashboard/villa-img-4.jpg", duration: "5:32", views: 2140, status: "Published" },
  { id: "5", property: "Hillcrest Manor", location: "Long Beach, CA", image: "assets/img/dashboard/villa-img-5.jpg", duration: "1:58", views: 386, status: "Draft" },
  { id: "6", property: "Downtown Business Hub", location: "Malibu, CA", image: "assets/img/dashboard/villa-img-6.jpg", duration: "6:15", views: 1873, status: "Published" },
];
