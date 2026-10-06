export function Status({ value }: { value: string }) {
  return <span className={`status status-${value.toLowerCase()}`}>{value}</span>;
}