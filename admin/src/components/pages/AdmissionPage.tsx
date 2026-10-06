import { RecordsPage } from "./records/RecordsPage";
import { RecordsTable } from "./records/RecordsTable";


export function AdmissionsPage() {
  return (
    <RecordsPage
      kind="admissions"
      renderView={(props) => <RecordsTable kind="admissions" {...props} />}
    />
  );
}