import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { AuthProvider } from '@/lib/auth';

import { RequireAuth } from '@/components/auth/RequireAuth';
import { AppLayout } from '@/components/layout/AppLayout';
import { LoginPage } from './authPage/LoginPage';
import { ForgotPasswordPage } from './authPage/ForgotPassword';
import { VerifyOtpPage } from './authPage/VerifyOtp';
import { ResetPasswordPage } from './authPage/ResetPasswordPage';
import { OverviewPage } from '@/components/pages/overview/OverviewPage';

import { SettingsPage } from '@/components/pages/SettingsPage';
import { NotFoundPage } from '@/components/pages/NotFoundPage/NotFoundPage';

import { StaffPage } from './components/pages/StaffPage';


import { AdmissionsPage } from './components/pages/Adimission/AdmissionPage';
import { ReviewsPage } from './components/pages/Review/ReviewPage';
import { ProgramsPage } from './components/pages/programs/ProgramPage';
import { GalleryPage } from './components/pages/gallery/GalleryPage';
import { EventsPage } from './components/pages/event/EventPage';
import { BlogPage } from './components/pages/blog/BlogPage';

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
      
        <RouterProvider router={router} />
     
    </AuthProvider>
  );
}