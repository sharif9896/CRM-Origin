import { createContext } from "react";

/** Theme lives in the Redux store (store/themeSlice); this context is sidebar state only. */
export type LayoutContextValue = {
  miniSidebar: boolean;
  expandMenu: boolean;
  mobileSidebar: boolean;
  toggleMiniSidebar: () => void;
  setExpandMenu: (value: boolean) => void;
  openMobileSidebar: () => void;
  closeMobileSidebar: () => void;
};

export const LayoutContext = createContext<LayoutContextValue | null>(null);
