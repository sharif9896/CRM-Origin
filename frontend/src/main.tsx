import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PrimeReactProvider, type APIOptions } from "primereact/api";
import "./style/icons/lucide-static/font/lucide.css";
import "./index.css";
import "./style/enterprise.css";
import { base_path } from "./environment";
import { LayoutProvider } from "./context/layoutContext";
import { store } from "./store";
import { initTheme } from "./store/themeSlice";
import ALLRoutes from "./routes/router";
import DynamicTitle from "./routes/dynamicTitle";

/**
 * PrimeReact writes z-index inline on its overlays, so a stylesheet rule can
 * never lift them — these values are the only way to stack them. Overlays must
 * clear the modal (z-80) and Preline's dropdowns; `autoZIndex` then increments
 * from each base so the last-opened overlay wins among its own kind.
 */
const primeConfig: Partial<APIOptions> = {
  autoZIndex: true,
  zIndex: {
    modal: 1200,
    overlay: 1200,
    menu: 1200,
    tooltip: 1300,
  },
};

/*
 * Push the stored theme to <html> before the first render. The store reads it
 * during module evaluation, so this runs ahead of React's first paint and a
 * dark-mode user never flashes the light default.
 */
store.dispatch(initTheme());

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PrimeReactProvider value={primeConfig}>
        <LayoutProvider>
          <BrowserRouter basename={base_path}>
            <ALLRoutes />
            <DynamicTitle />
          </BrowserRouter>
        </LayoutProvider>
      </PrimeReactProvider>
    </Provider>
  </StrictMode>,
);
