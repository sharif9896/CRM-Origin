import type { Tone } from "./tones";

export type AccentStatCard = {
  label: string;
  value: string | number;
  icon: string;
  tone: Tone;
  caption?: string;
  trend?: string;
  trendIcon?: string;
  compactValue?: boolean;
};

const TONES: Record<Tone, { bar: string; badge: string; pill: string }> = {
  primary: {
    bar: "from-primary to-primary/60",
    badge: "bg-primary/10 text-primary group-hover:bg-primary/20",
    pill: "text-primary bg-primary/10",
  },
  secondary: {
    bar: "from-secondary to-secondary/60",
    badge: "bg-secondary/10 text-secondary group-hover:bg-secondary/20",
    pill: "text-secondary bg-secondary/10",
  },
  success: {
    bar: "from-success to-success/60",
    badge: "bg-success/10 text-success group-hover:bg-success/20",
    pill: "text-success bg-success/10",
  },
  warning: {
    bar: "from-warning to-warning/60",
    badge: "bg-warning/10 text-warning group-hover:bg-warning/20",
    pill: "text-warning bg-warning/10",
  },
  danger: {
    bar: "from-danger to-danger/60",
    badge: "bg-danger/10 text-danger group-hover:bg-danger/20",
    pill: "text-danger bg-danger/10",
  },
  info: {
    bar: "from-info to-info/60",
    badge: "bg-info/10 text-info group-hover:bg-info/20",
    pill: "text-info bg-info/10",
  },
  orange: {
    bar: "from-orange to-orange/60",
    badge: "bg-orange/10 text-orange group-hover:bg-orange/20",
    pill: "text-orange bg-orange/10",
  },
};

const AccentStatCards = ({ cards }: { cards: AccentStatCard[] }) => (
  <div className="grid grid-cols-12 gap-4 lg:gap-6 mb-4 lg:mb-6">
    {cards.map((card) => {
      const tone = TONES[card.tone];
      return (
        <div key={card.label} className="col-span-12 sm:col-span-6 xxl:col-span-3">
          <div className="bg-white rounded-xl border border-border-color shadow-sm hover:shadow-md transition-all duration-300 p-5 relative group overflow-hidden h-full flex flex-col">
            <div
              className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b group-hover:w-1.5 transition-all duration-300 ${tone.bar}`}
            />
            <div className="flex items-start justify-between gap-3 pl-2 flex-1">
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  {card.label}
                </p>
                <h2
                  className={
                    card.compactValue
                      ? "text-2xl font-bold text-gray-900 mb-0.5"
                      : "text-3xl max-lg:text-2xl max-md:text-[22px] font-bold text-gray-900 mb-2"
                  }
                >
                  {card.value}
                </h2>
                <p className="text-xs text-gray-600 mb-3 h-4">{card.caption ?? ""}</p>
                {card.compactValue && <p className="text-xs text-gray-600 mb-3 h-1" />}
                {card.trend && (
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg ${tone.pill}`}
                    >
                      <i className={`${card.trendIcon ?? "icon-arrow-up"} text-sm`} />
                      <span>{card.trend}</span>
                    </span>
                  </div>
                )}
              </div>
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-lg text-xl transition-all duration-300 shrink-0 ${tone.badge}`}
              >
                <i className={card.icon} />
              </div>
            </div>
          </div>
        </div>
      );
    })}
  </div>
);

export default AccentStatCards;
