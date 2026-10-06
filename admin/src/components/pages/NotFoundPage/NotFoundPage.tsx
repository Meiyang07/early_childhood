import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <main className="unavailable">
      <h1>Page not found</h1>
      <Link className="primary-button" to="/admin">Open dashboard</Link>
    </main>
  );
}