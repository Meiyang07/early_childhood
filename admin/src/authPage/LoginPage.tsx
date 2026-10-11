// src/pages/LoginPage.tsx
import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useAuth } from "@/lib/auth";
import type { ApiError } from "@/lib/api";

export function LoginPage() {
  const { user, login, isLoading } = useAuth();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Already logged in → go to dashboard
  if (user) return <Navigate to={from} replace />;
  // Don't flash the form before /me resolves
  if (isLoading) return null;

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login({ email: email.trim(), password });
    } catch (e) {
      const err = e as ApiError;
      setError(err?.message ?? "Unable to sign in");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      {/* …orbs unchanged… */}
      <div className="login-layout">
        <section className="login-brand" aria-label="Early Childhood Montessori">
          <img src="/assets/school-logo.jpg" alt="Early Childhood Education Centre, Pokhara" width={390} height={390} />
          <h1>Early Childhood</h1>
          <p>Montessori</p>
        </section>

        <div className="login-divider" aria-hidden="true" />

        <section className="login-card">
          <h2>ADMIN Portal</h2>
          <p className="login-welcome">Welcome back. Sign in to your school workspace.</p>

          <form onSubmit={submit}>
            <div className="login-field">
              <label htmlFor="username">Email</label>
              <input
                id="username"
                type="email"
                autoComplete="username"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                disabled={submitting}
              />
            </div>

            <div className="login-field">
              <label htmlFor="password">Password</label>
              <div className="password-input">
                <input
                  id="password"
                  type={visible ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  disabled={submitting}
                />
                <button
                  type="button"
                  aria-label={visible ? "Hide password" : "Show password"}
                  onClick={() => setVisible((v) => !v)}
                >
                  {visible ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            {error && <p className="login-error" role="alert">{error}</p>}

            <button className="login-button" type="submit" disabled={submitting}>
              {submitting ? "Signing in…" : "Log in"}
            </button>
          </form>

          <p className="login-security">
            <LockKeyhole size={16} /> Secure admin session
          </p>
        </section>
      </div>
    </main>
  );
}