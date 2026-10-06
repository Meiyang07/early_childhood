import { RecordsPage } from "./records/RecordsPage";
import { RecordsTable } from "./records/RecordsTable";


export function EventsPage() {
  return (
    <RecordsPage
      kind="events"
      renderView={(props) => <RecordsTable kind="events" {...props} />}
    />
  );
}