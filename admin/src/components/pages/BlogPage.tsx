import { RecordsPage } from "./records/RecordsPage";
import { RecordsTable } from "./records/RecordsTable";


export function BlogPage() {
  return (
    <RecordsPage
      kind="blog"
      renderView={(props) => <RecordsTable kind="blog" {...props} />}
    />
  );
}