import { lazy, type ComponentType, type ReactNode } from "react";
import LazyPage from "./lazyPage";

type Importer = () => Promise<{ default: ComponentType }>;

/** `fallback` is the page-shaped skeleton shown while the chunk loads. */
export const lazyRoute = (importer: Importer, fallback: ReactNode) => {
  const Page = lazy(importer);
  return <LazyPage Page={Page} fallback={fallback} />;
};
