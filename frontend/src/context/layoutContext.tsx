import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { LayoutContext } from "./layoutContextObject";

const MOBILE_BREAKPOINT = 991;

/** Sidebar state only — the theme lives in the Redux store (store/themeSlice). */
export const LayoutProvider = ({ children }: { children: ReactNode }) => {
  const [miniSidebar, setMiniSidebar] = useState(false);
  const [expandMenu, setExpandMenu] = useState(false);
  const [mobileSidebar, setMobileSidebar] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("mini-sidebar", miniSidebar);
    document.body.classList.toggle("expand-menu", miniSidebar && expandMenu);
  }, [miniSidebar, expandMenu]);

  useEffect(() => {
    document.documentElement.classList.toggle("menu-opened", mobileSidebar);
  }, [mobileSidebar]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth <= MOBILE_BREAKPOINT) {
        setMiniSidebar(false);
        setExpandMenu(false);
      } else {
        setMobileSidebar(false);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const toggleMiniSidebar = useCallback(() => {
    if (window.innerWidth <= MOBILE_BREAKPOINT) return;
    setMiniSidebar((v) => !v);
    setExpandMenu(false);
  }, []);

  const openMobileSidebar = useCallback(() => setMobileSidebar(true), []);
  const closeMobileSidebar = useCallback(() => setMobileSidebar(false), []);

  const value = useMemo(
    () => ({
      miniSidebar,
      expandMenu,
      mobileSidebar,
      toggleMiniSidebar,
      setExpandMenu,
      openMobileSidebar,
      closeMobileSidebar,
    }),
    [
      miniSidebar,
      expandMenu,
      mobileSidebar,
      toggleMiniSidebar,
      openMobileSidebar,
      closeMobileSidebar,
    ],
  );

  return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>;
};
