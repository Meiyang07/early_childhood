import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { AuthProvider } from '@/lib/auth';
import { PortalProvider } from '@/lib/portal';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { AppLayout } from '@/components/layout/AppLayout';
import { LoginPage } from './authPage/LoginPage';
import { ForgotPasswordPage } from './authPage/ForgotPassword';
import { VerifyOtpPage } from './authPage/VerifyOtp';
import { ResetPasswordPage } from './authPage/ResetPasswordPage';
import { OverviewPage } from './components/pages/overview/OverviewPage';
import { RecordsPage } from './components/pages/records/RecordsPage';
import { SettingsPage } from './components/pages/settings/SettingsPage';
import { NotFoundPage } from './components/pages/NotFoundPage/NotFoundPage';


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
      { path: ':section', element: <RecordsPage /> },
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