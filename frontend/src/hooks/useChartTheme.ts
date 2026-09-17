import { useState } from "react";
import { useTheme } from "../store/hooks";
import type { Theme } from "../store/themeSlice";

type Palette = {
  theme: Theme;
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  orange: string;
  gray: string;
  label: string;
  border: string;
  dark: string;
};

const FALLBACK: Palette = {
  theme: "dark",
  primary: "#70BF4C",
  secondary: "#084E7F",
  success: "#138743",
  warning: "#FDAF22",
  danger: "#BF0000",
  info: "#286EF0",
  orange: "#E65100",
  gray: "#90979F",
  label: "#45505C",
  border: "#E8E8E8",
  dark: "#020311",
};

const readPalette = (theme: Theme): Palette => {
  const style = getComputedStyle(document.documentElement);
  const token = (name: string, fallback: string) =>
    style.getPropertyValue(name).trim() || fallback;

  return {
    theme,
    primary: token("--color-primary", FALLBACK.primary),
    secondary: token("--color-secondary", FALLBACK.secondary),
    success: token("--color-success", FALLBACK.success),
    warning: token("--color-warning", FALLBACK.warning),
    danger: token("--color-danger", FALLBACK.danger),
    info: token("--color-info", FALLBACK.info),
    orange: token("--color-orange", FALLBACK.orange),
    gray: token("--color-gray-400", FALLBACK.gray),
    label: token("--color-default", FALLBACK.label),
    border: token("--color-border-color", FALLBACK.border),
    dark: token("--color-dark", FALLBACK.dark),
  };
};

export function useChartTheme() {
  const theme = useTheme();
  const [palette, setPalette] = useState<Palette>(() => readPalette(theme));

  
  
  if (palette.theme !== theme) {
    document.documentElement.setAttribute("data-theme", theme);
    setPalette(readPalette(theme));
  }

  return {
    ...palette,
    base: {
      chart: {
        toolbar: { show: false },
        fontFamily: "inherit",
        background: "transparent",
      },
      grid: { borderColor: palette.border, strokeDashArray: 4 },
      tooltip: { theme: palette.theme },
      legend: { labels: { colors: palette.label } },
      dataLabels: { enabled: false },
      xaxis: {
        labels: { style: { colors: palette.label, fontSize: "11px" } },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: { labels: { style: { colors: palette.label, fontSize: "11px" } } },
    },
  };
}
