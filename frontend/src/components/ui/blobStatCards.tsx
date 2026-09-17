import type { Tone } from "./tones";

export type BlobStatCard = {
  label: string;
  value: string | number;
  icon: string;
  tone: Tone;
};

const TONES: Record<Tone, { blob: string; tile: string }> = {
  primary: { blob: "bg-primary/5", tile: "bg-primary/15 text-primary group-hover:bg-primary/25" },
  secondary: { blob: "bg-secondary/5", tile: "bg-secondary/15 text-secondary group-hover:bg-secondary/25" },
  success: { blob: "bg-success/5", tile: "bg-success/15 text-success group-hover:bg-success/25" },
  warning: { blob: "bg-warning/5", tile: "bg-warning/15 text-warning group-hover:bg-warning/25" },
  danger: { blob: "bg-danger/5", tile: "bg-danger/15 text-danger group-hover:bg-danger/25" },
  info: { blob: "bg-info/5", tile: "bg-info/15 text-info group-hover:bg-info/25" },
  orange: { blob: "bg-orange/5", tile: "bg-orange/15 text-orange group-hover:bg-orange/25" },
};

const BlobStatCards = ({ cards }: { cards: BlobStatCard[] }) => (
  <div className="grid grid-cols-12 gap-4 lg:gap-6 mb-4 lg:mb-6">
    {cards.map((card) => {
      const tone = TONES[card.tone];
      return (
        <div key={card.label} className="col-span-12 sm:col-span-6 xxl:col-span-3">
          <div className="bg-white rounded-lg border border-border-color shadow-sm hover:shadow-md transition-all duration-300 p-5 flex items-center gap-4 relative group overflow-hidden h-full">
            <div
              className={`absolute -right-8 top-1/2 -translate-y-1/2 w-32 h-32 rounded-full blur-2xl ${tone.blob}`}
            />
            <div className="flex-shrink-0 z-10">
              <div
                className={`flex items-center justify-center w-14 h-14 rounded-lg text-2xl transition-all duration-300 ${tone.tile}`}
              >
                <i className={card.icon} />
              </div>
            </div>
            <div className="flex-grow z-10 min-w-0">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                {card.label}
              </p>
              <h2 className="text-2xl max-lg:text-xl font-bold text-gray-900 leading-tight mb-0">
                {card.value}
              </h2>
            </div>
          </div>
        </div>
      );
    })}
  </div>
);

export default BlobStatCards;
