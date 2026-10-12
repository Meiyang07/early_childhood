// src/pages/settings/SettingsPage.tsx
import { useState, type FormEvent } from "react";
import { Clock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordForm } from "@/components/auth/PasswordForm";
import { useAuth } from "@/lib/auth";

/**
 * Static settings page.
 *  - School details live in a local constant, editable in this form only.
 *  - Nothing is persisted server-side; values reset on refresh.
 *  - The Admin Account block reads live data from useAuth().
 */

type Settings = {
  schoolName: string;
  adminName: string;
  email: string;
  phone: string;
  address: string;
  workingDays: string;
  openTime: string;   // "HH:mm"
  closeTime: string;  // "HH:mm"
};

const INITIAL: Settings = {
  schoolName: "Sunrise Early Childhood Center",
  adminName: "Admin",
  email: "hello@sunrise-ec.edu.np",
  phone: "+977 1 555 0123",
  address: "Ward 4, Lalitpur, Bagmati Province, Nepal",
  workingDays: "Monday – Friday",
  openTime: "08:30",
  closeTime: "16:30",
};

const schema = z
  .object({
    schoolName: z.string().trim().min(2, "School name is required").max(120),
    adminName: z.string().trim().min(1, "Admin name is required").max(60),
    email: z.string().email("Enter a valid email").max(200),
    phone: z.string().trim().min(5, "Phone is too short").max(40),
    address: z.string().trim().min(3, "Address is required").max(300),
    workingDays: z.string().trim().min(3, "Working days are required").max(60),
    openTime: z
      .string()
      .regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, "Use HH:mm format"),
    closeTime: z
      .string()
      .regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, "Use HH:mm format"),
  })
  .refine((v) => v.openTime < v.closeTime, {
    message: "Closing time must be after opening time.",
    path: ["closeTime"],
  });

function timeLabel(value: string): string {
  if (!/^\d{2}:\d{2}$/.test(value)) return "—";
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  }).format(new Date(`2000-01-01T${value}:00Z`));
}

export function SettingsPage() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<Settings>(INITIAL);
  const [error, setError] = useState("");

  function set<K extends keyof Settings>(key: K, value: Settings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
    if (error) setError("");
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    const parsed = schema.safeParse(settings);
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    // Static page — no server call. Just confirm.
    setSettings(parsed.data);
    toast.success("Settings saved");
  }

  const field = (key: keyof Settings, label: string, type = "text") => (
    <div className="form-field" key={key}>
      <label htmlFor={`settings-${key}`}>{label}</label>
      <Input
        id={`settings-${key}`}
        type={type}
        value={settings[key]}
        onChange={(e) => set(key, e.target.value)}
        maxLength={key === "address" ? 300 : 120}
        required
      />
    </div>
  );

  return (
    <div className="settings-layout">
      {/* ---------- School Details (editable form) ---------- */}
      <section className="panel settings-panel">
        <h2>School Details</h2>

        <form onSubmit={submit}>
          <div className="form-grid">
            {field("schoolName", "School name")}
            {field("adminName", "Admin display name")}
            {field("email", "School email", "email")}
            {field("phone", "Phone")}
            {field("address", "Address")}
            {field("workingDays", "Working days")}
            {field("openTime", "Opening time", "time")}
            {field("closeTime", "Closing time", "time")}
          </div>

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <div className="settings-actions">
            <Button type="submit" className="primary-button">
              Save settings
            </Button>
          </div>
        </form>
      </section>

      {/* ---------- Aside: dynamic admin + static info ---------- */}
      <aside className="settings-aside">
        <section className="panel">
          <ShieldCheck size={27} />
          <h2>Admin Account</h2>
          <strong>{user?.username ?? "—"}</strong>
          <p className="account-email">{user?.email ?? "—"}</p>
          <span className="status status-active">Local administrator</span>
          <PasswordForm />
        </section>

        <section className="settings-connection">
          <h2>Independent workspace</h2>
          <p>
            Records and content are saved for this admin panel. The public
            school website has its own content.
          </p>
          <p>
            <Clock size={16} /> {settings.workingDays}
            <br />
            {timeLabel(settings.openTime)} – {timeLabel(settings.closeTime)}
          </p>
        </section>
      </aside>
    </div>
  );
}