import { useRef, useState, type FormEvent, type KeyboardEvent, type ClipboardEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

const LENGTH = 6;

export function VerifyOtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string } | null)?.email ?? '';

  const [digits, setDigits] = useState<string[]>(Array(LENGTH).fill(''));
  const [error, setError] = useState('');
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  function setDigit(index: number, value: string) {
    if (!/^\d?$/.test(value)) return;
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    setError('');
    if (value && index < LENGTH - 1) inputs.current[index + 1]?.focus();
  }

  function onKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
    if (event.key === 'ArrowLeft' && index > 0) inputs.current[index - 1]?.focus();
    if (event.key === 'ArrowRight' && index < LENGTH - 1) inputs.current[index + 1]?.focus();
  }

  function onPaste(event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    const text = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, LENGTH);
    if (!text) return;
    const next = Array(LENGTH).fill('');
    for (let i = 0; i < text.length; i++) next[i] = text[i];
    setDigits(next);
    inputs.current[Math.min(text.length, LENGTH - 1)]?.focus();
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    const code = digits.join('');
    if (code.length !== LENGTH) {
      setError('Enter all 6 digits.');
      return;
    }
    // UI only — no API call
    navigate('/reset-password', { state: { email, code } });
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
          <h2>Verify OTP</h2>
          <p className="login-welcome">
            {email ? (
              <>Enter the 6-digit code sent to <strong>{email}</strong>.</>
            ) : (
              <>Enter the 6-digit code from your email.</>
            )}
          </p>

          <form onSubmit={submit}>
            <div
              style={{
                display: 'flex',
                gap: 10,
                justifyContent: 'center',
                margin: '24px 0 6px',
              }}
            >
              {digits.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputs.current[i] = el; }}
                  value={digit}
                  onChange={(e) => setDigit(i, e.target.value.replace(/\D/g, ''))}
                  onKeyDown={(e) => onKeyDown(i, e)}
                  onPaste={onPaste}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={1}
                  aria-label={`Digit ${i + 1}`}
                  autoFocus={i === 0}
                  style={{
                    width: 48,
                    height: 56,
                    textAlign: 'center',
                    fontSize: 24,
                    fontWeight: 600,
                    background: '#f8fafc',
                    color: '#243146',
                    border: '1px solid #cad1dc',
                    borderRadius: 12,
                    outline: 'none',
                  }}
                />
              ))}
            </div>

            {error && <p className="login-error" role="alert">{error}</p>}

            <button className="login-button" type="submit">
              Verify code
            </button>
          </form>

          <p className="login-security" style={{ marginTop: 20 }}>
            <ShieldCheck size={16} /> Codes expire after 10 minutes
          </p>

          <Link
            to="/forgot-password"
            className="login-security"
            style={{ textDecoration: 'none', justifyContent: 'center' }}
          >
            <ArrowLeft size={16} /> Use a different email
          </Link>
        </section>
      </div>
    </main>
  );
}