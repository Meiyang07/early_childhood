import { RecordsPage } from "./records/RecordsPage";
import { StaffGrid } from "./records/StaffGrid";


export function StaffPage() {
  return (
    <RecordsPage
      kind="staff"
      renderView={(props) => <StaffGrid {...props} />}
    />
  );
}