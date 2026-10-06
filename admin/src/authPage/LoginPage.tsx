import { useState, type FormEvent } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Eye, EyeOff, LockKeyhole } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export function LoginPage() {
  const { user, login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');

  if (user) return <Navigate to="/admin" replace />;

  function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    try {
      login(username, password);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <main className="login-page">
      <div className="login-orb peach" aria-hidden="true" />
      <div className="login-orb blue" aria-hidden="true" />
      <div className="login-orb lilac" aria-hidden="true" />
      <div className="login-orb mint" aria-hidden="true" />
      <div className="login-confetti" aria-hidden="true">
        <i /><i /><i /><i /><i /><i />
      </div>

      <div className="login-layout">
        <section className="login-brand" aria-label="Early Childhood Montessori">
          <img
            src="/assets/school-logo.jpg"
            alt="Early Childhood Education Centre, Pokhara"
            width="390"
            height="390"
          />
          <h1>Early Childhood</h1>
          <p>Montessori</p>
        </section>

        <div className="login-divider" aria-hidden="true" />

        <section className="login-card">
          <h2>ADMIN Portal</h2>
          <p className="login-welcome">Welcome back. Sign in to your school workspace.</p>

          <form onSubmit={submit}>
            <div className="login-field">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                autoComplete="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={3}
                maxLength={40}
                autoFocus
              />
            </div>

            <div className="login-field">
              <label htmlFor="password">Password</label>
              <div className="password-input">
                <input
                  id="password"
                  autoComplete="current-password"
                  type={visible ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  maxLength={128}
                />
                <button
                  type="button"
                  aria-label={visible ? 'Hide password' : 'Show password'}
                  onClick={() => setVisible((v) => !v)}
                >
                  {visible ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            <Link to="/forgot-password" className="forgot-password">
              Forgot Password?
            </Link>

            {error && <p className="login-error" role="alert">{error}</p>}

            <button className="login-button" type="submit">
              Log in
            </button>
          </form>

          <p className="login-security">
            <LockKeyhole size={16} /> Local admin account
          </p>
        </section>
      </div>
    </main>
  );
}