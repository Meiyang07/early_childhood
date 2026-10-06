import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, Eye, EyeOff, LockKeyhole } from 'lucide-react';

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string } | null)?.email ?? '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Use at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    // UI only — no API call
    setDone(true);
    setTimeout(() => navigate('/login', { replace: true }), 1800);
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
          <h2>Set New Password</h2>

          {!done ? (
            <>
              <p className="login-welcome">
                {email ? (
                  <>Choose a new password for <strong>{email}</strong>.</>
                ) : (
                  <>Choose a new password for your admin account.</>
                )}
              </p>

              <form onSubmit={submit}>
                <div className="login-field">
                  <label htmlFor="new-password">New password</label>
                  <div className="password-input">
                    <input
                      id="new-password"
                      type={visible ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="At least 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      autoFocus
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

                <div className="login-field">
                  <label htmlFor="confirm-password">Confirm password</label>
                  <input
                    id="confirm-password"
                    type={visible ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Enter the same password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    minLength={8}
                  />
                </div>

                {error && <p className="login-error" role="alert">{error}</p>}

                <button className="login-button" type="submit">
                  Reset password
                </button>
              </form>
            </>
          ) : (
            <>
              <p className="login-welcome">
                Your password has been updated. Redirecting you to sign in…
              </p>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  color: '#79d4a0',
                  marginTop: 10,
                }}
              >
                <CheckCircle2 size={44} />
              </div>
            </>
          )}

          {!done && (
            <Link
              to="/login"
              className="login-security"
              style={{ textDecoration: 'none', justifyContent: 'center' }}
            >
              <LockKeyhole size={16} /> Back to sign in
            </Link>
          )}
        </section>
      </div>
    </main>
  );
}