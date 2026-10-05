import { Route, Routes } from 'react-router-dom';

import { useLocation } from 'react-router-dom';
import { useSiteMotion } from './hooks/useSiteMotion';
import { Layout } from './Components/layout';
import { ROUTES } from './routes/path';
import { AboutPage, AdmissionsPage, BlogPage, ContactPage, EnrollmentPage, EventsPage, GalleryPage, HomePage, NotFoundPage, ProgramsPage, TeamPage } from './Components/pages';

function AppRoutes() {
  const { pathname } = useLocation();
  useSiteMotion(pathname);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.ABOUT} element={<AboutPage />} />
        <Route path={ROUTES.PROGRAMS} element={<ProgramsPage />} />
        <Route path={ROUTES.ADMISSIONS} element={<AdmissionsPage />} />
        <Route path={ROUTES.ENROLL} element={<EnrollmentPage />} />
        <Route path={ROUTES.TEAM} element={<TeamPage />} />
        <Route path={ROUTES.GALLERY} element={<GalleryPage />} />
        <Route path={ROUTES.EVENTS} element={<EventsPage />} />
        <Route path={ROUTES.BLOG} element={<BlogPage />} />
        <Route path={ROUTES.CONTACT} element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return <AppRoutes />;
}