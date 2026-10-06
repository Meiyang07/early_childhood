import { RecordsPage } from "./records/RecordsPage";
import { RecordsTable } from "./records/RecordsTable";


export function ProgramsPage() {
  return (
    <RecordsPage
      kind="programs"
      renderView={(props) => <RecordsTable kind="programs" {...props} />}
    />
  );
}