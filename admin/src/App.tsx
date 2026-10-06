import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { AuthProvider } from '@/lib/auth';
import { PortalProvider } from '@/lib/portal';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { AppLayout } from '@/components/layout/AppLayout';
import { LoginPage } from './authPage/LoginPage';
import { ForgotPasswordPage } from './authPage/ForgotPassword';
import { VerifyOtpPage } from './authPage/VerifyOtp';
import { ResetPasswordPage } from './authPage/ResetPasswordPage';
import { OverviewPage } from '@/components/pages/overview/OverviewPage';

import { SettingsPage } from '@/components/pages/SettingsPage';
import { NotFoundPage } from '@/components/pages/NotFoundPage/NotFoundPage';
import { AdmissionsPage } from './components/pages/AdmissionPage';
import { StaffPage } from './components/pages/StaffPage';
import { ReviewsPage } from './components/pages/ReviewPage';
import { ProgramsPage } from './components/pages/ProgramsPage';
import { GalleryPage } from './components/pages/GalleryPage';
import { EventsPage } from './components/pages/EventsPage';
import { BlogPage } from './components/pages/BlogPage';

const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/admin" replace /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  { path: '/verify-otp', element: <VerifyOtpPage /> },
  { path: '/reset-password', element: <ResetPasswordPage /> },
  {
    path: '/admin',
    element: (
      <RequireAuth>
        <AppLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <OverviewPage /> },
      { path: 'admissions', element: <AdmissionsPage /> },
      { path: 'staff', element: <StaffPage /> },
      { path: 'reviews', element: <ReviewsPage /> },
    
      { path: 'programs', element: <ProgramsPage /> },
      { path: 'gallery', element: <GalleryPage /> },
      { path: 'events', element: <EventsPage /> },
      { path: 'blog', element: <BlogPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);

export default function App() {
  return (
    <AuthProvider>
      <PortalProvider>
        <RouterProvider router={router} />
      </PortalProvider>
    </AuthProvider>
  );
}