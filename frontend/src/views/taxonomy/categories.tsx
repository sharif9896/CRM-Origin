import type { Taxonomy } from "../../data/types";
import { useCrud } from "../../hooks/useCrud";
import TaxonomyTable from "./taxonomyTable";
import CategoryCards from "./categoryCards";

const Categories = () => {
  // Separate fetch just to feed the summary cards above the table; the
  // table itself manages its own live data via the "category" kind filter.
  const cardsCrud = useCrud<Taxonomy>("taxonomies", { pageSize: 100, params: { kind: "category" } });

  return (
    <TaxonomyTable
      title="Categories"
      entity="Category"
      kind="category"
      searchNoun="category"
      beforeTable={<CategoryCards items={cardsCrud.rows} />}
    />
  );
};

export default Categories;
