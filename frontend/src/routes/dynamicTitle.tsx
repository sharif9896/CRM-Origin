import { useEffect } from "react";

const appTitle = "Realstate CRM | Thumani";

export default function DynamicTitle() {
  useEffect(() => {
    document.title = appTitle;
  }, []);

  return null;
}
