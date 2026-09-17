import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Theme = "light" | "dark";

const THEME_KEY = "data-theme";

/** Light unless the user has explicitly toggled to dark. */
const DEFAULT_THEME: Theme = "light";

const isTheme = (value: unknown): value is Theme => value === "light" || value === "dark";

/**
 * The saved theme, or the default when nothing valid is stored.
 * `__THEME_CONFIG__` is the template's older format, still read so a
 * preference saved by a previous build survives.
 */
const readStoredTheme = (): Theme => {
  try {
    const saved = localStorage.getItem(THEME_KEY) ?? sessionStorage.getItem(THEME_KEY);
    if (isTheme(saved)) return saved;

    const raw = localStorage.getItem("__THEME_CONFIG__");
    const legacy = raw ? (JSON.parse(raw) as { theme?: unknown } | null)?.theme : undefined;
    if (isTheme(legacy)) return legacy;
  } catch {
    void 0;
  }
  return DEFAULT_THEME;
};

const persistTheme = (theme: Theme) => {
  try {
    localStorage.setItem(THEME_KEY, theme);
    sessionStorage.setItem(THEME_KEY, theme);
    const config = JSON.stringify({ theme });
    localStorage.setItem("__THEME_CONFIG__", config);
    sessionStorage.setItem("__THEME_CONFIG__", config);
    const label = theme === "dark" ? "Dark" : "Light";
    localStorage.setItem("__THEME_LABEL__", label);
    sessionStorage.setItem("__THEME_LABEL__", label);
  } catch {
    void 0;
  }
};

/**
 * The <html data-theme> attribute is what the CSS actually keys off, so the
 * DOM is written here alongside storage — the reducer stays the single place
 * the theme changes.
 */
const commit = (theme: Theme) => {
  document.documentElement.setAttribute(THEME_KEY, theme);
  persistTheme(theme);
};

const themeSlice = createSlice({
  name: "theme",
  initialState: { value: readStoredTheme() },
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.value = action.payload;
      commit(state.value);
    },
    toggleTheme: (state) => {
      state.value = state.value === "dark" ? "light" : "dark";
      commit(state.value);
    },
    /** Pushes the initial state to <html> without changing it. */
    initTheme: (state) => {
      commit(state.value);
    },
  },
});

export const { setTheme, toggleTheme, initTheme } = themeSlice.actions;
export default themeSlice.reducer;
