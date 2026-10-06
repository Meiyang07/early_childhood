import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Send } from 'lucide-react';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address.');
      return;
    }
    // UI only — no API call
    setSent(true);
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
          <h2>Forgot Password</h2>

          {!sent ? (
            <>
              <p className="login-welcome">
                Enter the email linked to your admin account. We will send a 6-digit
                verification code.
              </p>

              <form onSubmit={submit}>
                <div className="login-field">
                  <label htmlFor="email">Email address</label>
                  <div className="password-input">
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoFocus
                    />
                    <span
                      style={{
                        position: 'absolute',
                        right: 10,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#77849b',
                        pointerEvents: 'none',
                      }}
                    >
                      <Mail size={19} />
                    </span>
                  </div>
                </div>

                {error && <p className="login-error" role="alert">{error}</p>}

                <button className="login-button" type="submit">
                  Send OTP
                </button>
              </form>
            </>
          ) : (
            <>
              <p className="login-welcome">
                A 6-digit code was sent to <strong>{email}</strong>. Check your inbox
                and enter it on the next screen.
              </p>

              <button
                className="login-button"
                type="button"
                onClick={() => navigate('/verify-otp', { state: { email } })}
              >
                Continue to verification
              </button>

              <button
                type="button"
                className="forgot-password"
                style={{ display: 'block', margin: '18px auto 0', background: 'transparent', border: 0 }}
                onClick={() => setSent(false)}
              >
                Use a different email
              </button>
            </>
          )}

          <Link
            to="/login"
            className="login-security"
            style={{ textDecoration: 'none', justifyContent: 'center' }}
          >
            <ArrowLeft size={16} /> Back to sign in
          </Link>
        </section>
      </div>
    </main>
  );
}