import type { Tone } from "./tones";

export type StatCard = {
  label: string;
  value: number | string;
  icon: string;
  tone: Tone;
};

const TONES: Record<
  Tone,
  { card: string; blur: string; label: string; badge: string }
> = {
  primary: {
    card: "from-primary/10 via-primary/5 border-primary/20",
    blur: "bg-primary/15",
    label: "text-primary/60",
    badge: "bg-primary/15 text-primary",
  },
  secondary: {
    card: "from-secondary/10 via-secondary/5 border-secondary/20",
    blur: "bg-secondary/15",
    label: "text-secondary/60",
    badge: "bg-secondary/15 text-secondary",
  },
  success: {
    card: "from-success/10 via-success/5 border-success/20",
    blur: "bg-success/15",
    label: "text-success/60",
    badge: "bg-success/15 text-success",
  },
  warning: {
    card: "from-warning/10 via-warning/5 border-warning/20",
    blur: "bg-warning/15",
    label: "text-warning/60",
    badge: "bg-warning/15 text-warning",
  },
  danger: {
    card: "from-danger/10 via-danger/5 border-danger/20",
    blur: "bg-danger/15",
    label: "text-danger/60",
    badge: "bg-danger/15 text-danger",
  },
  info: {
    card: "from-info/10 via-info/5 border-info/20",
    blur: "bg-info/15",
    label: "text-info/60",
    badge: "bg-info/15 text-info",
  },
  orange: {
    card: "from-orange/10 via-orange/5 border-orange/20",
    blur: "bg-orange/15",
    label: "text-orange/60",
    badge: "bg-orange/15 text-orange",
  },
};

const BLOBS = [
  "-left-6 -top-6",
  "-right-6 -bottom-6",
  "-left-6 -bottom-6",
  "-right-6 -top-6",
];

const StatCards = ({
  cards,
  span = "sm:col-span-6 xxl:col-span-3",
}: {
  cards: StatCard[];
  span?: string;
}) => (
  <div className="grid grid-cols-12 gap-4 lg:gap-6 mb-4 lg:mb-6">
    {cards.map((card, i) => {
      const tone = TONES[card.tone];
      return (
        <div key={card.label} className={`col-span-12 ${span}`}>
          <div
            className={`bg-gradient-to-br to-transparent rounded-lg border shadow-lg hover:shadow-xl transition-all duration-300 p-5 relative overflow-hidden group h-full flex flex-col ${tone.card}`}
          >
            <div
              className={`absolute w-24 h-24 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500 ${BLOBS[i % BLOBS.length]} ${tone.blur}`}
            />
            <div className="relative z-10 flex items-center justify-between gap-3 flex-1">
              <div>
                <p
                  className={`text-xs font-semibold uppercase tracking-wide mb-1 ${tone.label}`}
                >
                  {card.label}
                </p>
                <h2 className="text-3xl max-lg:text-2xl max-md:text-[22px] font-bold text-gray-900 leading-none mb-0">
                  {card.value}
                </h2>
              </div>
              <span
                className={`size-14 shrink-0 flex items-center justify-center rounded-2xl text-xl group-hover:scale-110 transition-transform duration-300 ${tone.badge}`}
              >
                <i className={card.icon} />
              </span>
            </div>
          </div>
        </div>
      );
    })}
  </div>
);

export default StatCards;
