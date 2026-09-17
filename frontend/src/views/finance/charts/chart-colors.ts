const FALLBACK = {
  primary: "#70BF4C",
  secondary: "#084E7F",
  gray400: "#90979F",
  labelColor: "#45505C",
  borderColor: "#E8E8E8",
};

const token = (name: string, fallback: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim() ||
  fallback;

export const colors = {
  get primary() {
    return token("--color-primary", FALLBACK.primary);
  },
  get secondary() {
    return token("--color-secondary", FALLBACK.secondary);
  },
  get gray400() {
    return token("--color-gray-400", FALLBACK.gray400);
  },
  get labelColor() {
    return token("--color-default", FALLBACK.labelColor);
  },
  get borderColor() {
    return token("--color-border-color", FALLBACK.borderColor);
  },

  get baseAxis() {
    return {
      labels: {
        style: {
          colors: token("--color-default", FALLBACK.labelColor),
          fontSize: "11px",
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    };
  },
};
