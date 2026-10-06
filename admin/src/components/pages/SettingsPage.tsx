import { useEffect, useState, type FormEvent } from 'react';
import { ShieldCheck, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePortal } from '@/lib/portal';
import { useAuth } from '@/lib/auth';
import { settingsSchema, timeLabel, type Settings } from '@/types/admin';
import { PasswordForm } from '@/components/auth/PasswordForm';

export function SettingsPage() {
  const { data, updateSettings } = usePortal();
  const { user } = useAuth();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (data) setSettings(data.settings);
  }, [data]);

  if (!data || !settings) return null;

  function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    const valid = settingsSchema.safeParse(settings);
    if (!valid.success) {
      setError(valid.error.issues[0].message);
      return;
    }
    updateSettings(valid.data);
    toast.success('Settings saved');
  }

  const field = (key: keyof Settings, label: string, type = 'text') => (
    <div className="form-field" key={key}>
      <label htmlFor={`settings-${key}`}>{label}</label>
      <Input
        id={`settings-${key}`}
        type={type}
        value={settings[key]}
        onChange={(e) => setSettings((prev) => ({ ...prev!, [key]: e.target.value }))}
        maxLength={key === 'address' ? 300 : 120}
        required
      />
    </div>
  );

  return (
    <div className="settings-layout">
      <section className="panel settings-panel">
        <h2>School Details</h2>
        <form onSubmit={submit}>
          <div className="form-grid">
            {field('schoolName', 'School name')}
            {field('adminName', 'Admin display name')}
            {field('email', 'School email', 'email')}
            {field('phone', 'Phone')}
            {field('address', 'Address')}
            {field('workingDays', 'Working days')}
            {field('openTime', 'Opening time', 'time')}
            {field('closeTime', 'Closing time', 'time')}
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="settings-actions">
            <Button type="submit" className="primary-button">Save settings</Button>
          </div>
        </form>
      </section>

      <aside className="settings-aside">
        <section className="panel">
          <ShieldCheck size={27} />
          <h2>Admin Account</h2>
          <strong>{user?.name ?? settings.adminName}</strong>
          <p className="account-email">{user?.username}</p>
          <span className="status status-active">Local administrator</span>
          <PasswordForm />
        </section>

        <section className="settings-connection">
          <h2>Independent workspace</h2>
          <p>Records and content are saved for this admin panel. The public school website has its own content.</p>
          <p>
            <Clock size={16} /> {settings.workingDays}<br />
            {timeLabel(settings.openTime)} – {timeLabel(settings.closeTime)}
          </p>
        </section>
      </aside>
    </div>
  );
}