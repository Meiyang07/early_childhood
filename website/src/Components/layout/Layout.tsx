import { Outlet } from 'react-router-dom';
import { ReadingProgress } from './ReadingProgress';
import { Header } from './Header';
import { Partners } from './Partners';
import { Footer } from './Footer';

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <ReadingProgress />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Partners />
      <Footer />
    </div>
  );
}