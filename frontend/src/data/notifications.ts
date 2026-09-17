export type Notification = {
  id: string;
  title: string;
  message: string;
  time: string;
  avatar?: string;
  initials?: string;
  icon?: string;
  badgeClass?: string;
  online?: boolean;
  read?: boolean;
};

export const notifications: Notification[] = [
  {
    id: "1",
    title: "New Lead Assigned",
    message: "Lead #LD-954 has been assigned to you.",
    time: "30 min",
    avatar: "assets/img/avatar/avatar-03.jpg",
  },
  {
    id: "2",
    title: "Home Tour Scheduled",
    message: "Client scheduled tour for Sunset Manor.",
    time: "25 min",
    initials: "HT",
    badgeClass: "bg-secondary-transparent text-secondary",
    online: true,
  },
  {
    id: "3",
    title: "Offer Received",
    message: "New offer submitted for Oakwood Apartment.",
    time: "15 min",
    avatar: "assets/img/avatar/avatar-07.jpg",
  },
  {
    id: "4",
    title: "Listing Sync Completed",
    message: "54 new listings synced with the MLS Portal.",
    time: "1 day ago",
    icon: "icon-server",
    badgeClass: "bg-warning text-white",
  },
  {
    id: "5",
    title: "Scheduled Meeting",
    message: "Meeting with buyer Sarah Jenkins tomorrow.",
    time: "2 hrs ago",
    initials: "SM",
    badgeClass: "bg-primary-transparent text-primary",
    online: true,
  },
];
