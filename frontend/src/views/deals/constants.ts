export const compactMoney = (value: number) =>
  value >= 1_000_000 ? `$${(value / 1_000_000).toFixed(1)}M` : `$${Math.round(value / 1000)}K`;

export const fullMoney = (value: number) => `$${value.toLocaleString("en-US")}`;
