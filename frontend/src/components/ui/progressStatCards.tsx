import type { Tone } from "./tones";

export type ProgressStatCard = {
  label: string;
  value: string | number;
  icon: string;
  tone: Tone;
  percent: number;
};

const TONES: Record<Tone, { watermark: string; bar: string }> = {
  primary: { watermark: "text-primary/20", bar: "from-primary to-primary/60" },
  secondary: { watermark: "text-secondary/20", bar: "from-secondary to-secondary/60" },
  success: { watermark: "text-success/20", bar: "from-success to-success/60" },
  warning: { watermark: "text-warning/20", bar: "from-warning to-warning/60" },
  danger: { watermark: "text-danger/20", bar: "from-danger to-danger/60" },
  info: { watermark: "text-info/20", bar: "from-info to-info/60" },
  orange: { watermark: "text-orange/20", bar: "from-orange to-orange/60" },
};

const ProgressStatCards = ({ cards }: { cards: ProgressStatCard[] }) => (
  <div className="grid grid-cols-12 gap-4 lg:gap-6 mb-4 lg:mb-6">
    {cards.map((card) => {
      const tone = TONES[card.tone];
      return (
        <div key={card.label} className="col-span-12 sm:col-span-6 xl:col-span-3">
          <div className="bg-white rounded-lg border border-border-color shadow-sm hover:shadow-md transition-shadow p-6 relative group h-full flex flex-col">
            <div className="flex items-start justify-between mb-4 flex-1">
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-600 tracking-wider mb-2">
                  {card.label}
                </p>
                <h2 className="text-3xl max-lg:text-2xl max-md:text-[22px] font-bold text-gray-900 leading-tight mb-0">
                  {card.value}
                </h2>
              </div>
              <div className={`text-3xl group-hover:scale-110 transition-transform ${tone.watermark}`}>
                <i className={card.icon} />
              </div>
            </div>
            <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r rounded-full ${tone.bar}`}
                style={{ width: `${card.percent}%` }}
              />
            </div>
          </div>
        </div>
      );
    })}
  </div>
);

export default ProgressStatCards;
