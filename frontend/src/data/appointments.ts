import type { Appointment, AppointmentStatus } from "./types";

export const APPOINTMENT_STATUSES: AppointmentStatus[] = [
  "Confirmed",
  "Pending",
  "Completed",
  "Cancelled",
];

export const appointmentStatusClass: Record<AppointmentStatus, string> = {
  Confirmed: "text-success border-success",
  Pending: "text-warning border-warning",
  Completed: "text-info border-info",
  Cancelled: "text-danger border-danger",
};

export const appointments: Appointment[] = [
  { id: "1", title: "Property Viewing — Downtown Penthouse", location: "Crestview Penthouse, Beverly Hills", when: "Today, 2:00 PM – 2:30 PM", duration: "30 mins", client: "Marcus Johnson", avatar: "assets/img/avatar/avatar-01.jpg", status: "Confirmed", icon: "icon-home" },
  { id: "2", title: "Contract Signing — Sunset Manor", location: "Head Office, Los Angeles", when: "Today, 4:00 PM – 5:00 PM", duration: "1 hr", client: "Sarah Jenkins", avatar: "assets/img/avatar/avatar-03.jpg", status: "Confirmed", icon: "icon-file-text" },
  { id: "3", title: "Valuation Visit — Oakwood Apartment", location: "Oakwood Apartment, Pasadena", when: "Tomorrow, 10:00 AM – 11:00 AM", duration: "1 hr", client: "Raj Patel", avatar: "assets/img/avatar/avatar-04.jpg", status: "Pending", icon: "icon-ruler" },
  { id: "4", title: "Client Consultation — Budget Review", location: "Video Call", when: "Tomorrow, 1:00 PM – 1:45 PM", duration: "45 mins", client: "Emily Carter", avatar: "assets/img/avatar/avatar-05.jpg", status: "Confirmed", icon: "icon-video" },
  { id: "5", title: "Property Viewing — Willow Creek Villa", location: "Willow Creek Villa, Malibu", when: "22 Jul, 11:00 AM – 12:00 PM", duration: "1 hr", client: "Victor Moreau", avatar: "assets/img/avatar/avatar-06.jpg", status: "Pending", icon: "icon-home" },
  { id: "6", title: "Handover — Elm Street Residence", location: "Elm Street Residence, Burbank", when: "18 Jul, 9:00 AM – 10:00 AM", duration: "1 hr", client: "Miguel Santos", avatar: "assets/img/avatar/avatar-09.jpg", status: "Completed", icon: "icon-key" },
  { id: "7", title: "Open House — Marina Bay Penthouse", location: "Marina Bay, Marina del Rey", when: "24 Jul, 12:00 PM – 4:00 PM", duration: "4 hrs", client: "Walk-ins", avatar: "assets/img/avatar/avatar-07.jpg", status: "Confirmed", icon: "icon-users" },
  { id: "8", title: "Second Viewing — Bayview Terrace", location: "Bayview Terrace, San Diego", when: "16 Jul, 3:00 PM – 3:30 PM", duration: "30 mins", client: "Yuki Sato", avatar: "assets/img/avatar/avatar-08.jpg", status: "Cancelled", icon: "icon-home" },
  { id: "9", title: "Mortgage Advisor Meeting", location: "Video Call", when: "25 Jul, 10:30 AM – 11:15 AM", duration: "45 mins", client: "Leila Hassan", avatar: "assets/img/avatar/avatar-10.jpg", status: "Pending", icon: "icon-landmark" },
  { id: "10", title: "Photo Shoot — Aspen Ridge Estate", location: "Aspen Ridge Estate, Glendale", when: "14 Jul, 8:00 AM – 11:00 AM", duration: "3 hrs", client: "Clara Hoffmann", avatar: "assets/img/avatar/avatar-11.jpg", status: "Completed", icon: "icon-camera" },
];
