import { useEffect } from "react";
import { HSStaticMethods } from "preline";

export function usePrelineRefresh(deps: string | number) {
  useEffect(() => {
    HSStaticMethods.autoInit();
  }, [deps]);
}
