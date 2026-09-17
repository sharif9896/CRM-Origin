import { useContext } from "react";
import { LayoutContext } from "../context/layoutContextObject";

export const useLayout = () => {
  const ctx = useContext(LayoutContext);
  if (!ctx) throw new Error("useLayout must be used within a LayoutProvider");
  return ctx;
};
