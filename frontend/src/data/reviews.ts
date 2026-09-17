import type { Review } from "./types";

export const reviews: Review[] = [
  { id: "1", author: "Marcus Johnson", avatar: "assets/img/avatar/avatar-01.jpg", property: "Crestview Penthouse", rating: 5, comment: "Jennifer knew every detail of the building and answered questions I hadn't thought to ask. The whole process took three weeks end to end.", date: "12 Jul 2026", replied: true },
  { id: "2", author: "Sarah Jenkins", avatar: "assets/img/avatar/avatar-03.jpg", property: "Sunset Manor", rating: 4, comment: "Great experience overall. The listing photos undersold the garden — it's much bigger in person.", date: "09 Jul 2026", replied: true },
  { id: "3", author: "Raj Patel", avatar: "assets/img/avatar/avatar-04.jpg", property: "Oakwood Apartment", rating: 5, comment: "Responsive, straightforward, no pressure. Exactly what I wanted from an agent.", date: "05 Jul 2026", replied: false },
  { id: "4", author: "Emily Carter", avatar: "assets/img/avatar/avatar-05.jpg", property: "Marina Bay Penthouse", rating: 3, comment: "The property was as described, but scheduling the second viewing took longer than I'd have liked.", date: "01 Jul 2026", replied: false },
  { id: "5", author: "Victor Moreau", avatar: "assets/img/avatar/avatar-06.jpg", property: "Willow Creek Villa", rating: 5, comment: "David handled a tricky chain without any drama. Would recommend to anyone buying in Malibu.", date: "27 Jun 2026", replied: true },
  { id: "6", author: "Leila Hassan", avatar: "assets/img/avatar/avatar-07.jpg", property: "Harbour Point Studio", rating: 4, comment: "Good value and a quick turnaround. The paperwork could be simpler but that's not on the agency.", date: "22 Jun 2026", replied: false },
  { id: "7", author: "Yuki Sato", avatar: "assets/img/avatar/avatar-08.jpg", property: "Bayview Terrace", rating: 2, comment: "Two viewings were rescheduled at short notice. The property itself was fine.", date: "18 Jun 2026", replied: true },
  { id: "8", author: "Miguel Santos", avatar: "assets/img/avatar/avatar-09.jpg", property: "Elm Street Residence", rating: 5, comment: "Laura went well beyond what I expected, including chasing the surveyor twice.", date: "14 Jun 2026", replied: false },
  { id: "9", author: "Clara Hoffmann", avatar: "assets/img/avatar/avatar-10.jpg", property: "Aspen Ridge Estate", rating: 4, comment: "Professional throughout. The virtual tour saved me two trips across town.", date: "10 Jun 2026", replied: true },
];
