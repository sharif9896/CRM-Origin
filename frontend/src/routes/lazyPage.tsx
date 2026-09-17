import { Suspense, useEffect, type ComponentType, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { HSStaticMethods } from "preline";

const PrelineInit = () => {
  useEffect(() => {
    HSStaticMethods.autoInit();
  }, []);
  return null;
};

const LazyPage = ({ Page, fallback }: { Page: ComponentType; fallback: ReactNode }) => {
  const { pathname } = useLocation();
  return (
    <Suspense key={pathname} fallback={fallback}>
      <Page />
      <PrelineInit />
    </Suspense>
  );
};

export default LazyPage;
