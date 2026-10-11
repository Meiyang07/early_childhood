import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ADMISSION_STATUSES,
  PROGRAMS,
  type AdmissionApplication,
} from "@/types/adimission";
import { Baby, Mail, Phone, School, User, UserCog } from "lucide-react";
import { cn } from "@/lib/utils";

const GENDERS = ["Male", "Female", "Other"];
const REFERRAL_SOURCES = [
  "Google Search",
  "Facebook",
  "Instagram",
  "Friend / Family",
  "Walk-in",
  "Other",
];

export type AdmissionFormValues = {
  childInfo: {
    fullName: string;
    dateOfBirth: string;
    gender: string;
    applyingForProgram: string;
  };
  guardianInfo: {
    fullName: string;
    phoneNumber: string;
    email: string;
    homeAddress: string;
  };
  additionalInfo: {
    previousSchool: string;
    medicalConditions: string;
    referralSource: string;
  };
  status: string;
};

const today = () => new Date().toISOString().split("T")[0];

const EMPTY: AdmissionFormValues = {
  childInfo: {
    fullName: "",
    dateOfBirth: today(),
    gender: "Female",
    applyingForProgram: PROGRAMS[0],
  },
  guardianInfo: {
    fullName: "",
    phoneNumber: "",
    email: "",
    homeAddress: "",
  },
  additionalInfo: {
    previousSchool: "",
    medicalConditions: "",
    referralSource: REFERRAL_SOURCES[0],
  },
  status: "Pending",
};

function toFormValues(app?: AdmissionApplication | null): AdmissionFormValues {
  if (!app) return EMPTY;
  return {
    childInfo: {
      fullName: app.childInfo.fullName,
      dateOfBirth: app.childInfo.dateOfBirth.split("T")[0],
      gender: app.childInfo.gender,
      applyingForProgram: app.childInfo.applyingForProgram,
    },
    guardianInfo: { ...app.guardianInfo },
    additionalInfo: { ...app.additionalInfo },
    status: app.status,
  };
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-card/50 p-5 transition-colors hover:border-border/80">
      <header className="mb-4 flex items-center gap-3">
        <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </span>
        <div>
          <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
          <p className="text-xs text-muted-foreground">
            {title === "Child information" && "Basic details about the applicant"}
            {title === "Guardian information" &&
              "Primary contact for this application"}
            {title === "Additional information" && "Background and medical notes"}
          </p>
        </div>
      </header>
      <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
        {children}
      </div>
    </section>
  );
}

function Field({
  label,
  required,
  children,
  className,
  hint,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
  hint?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function IconInput({
  icon,
  ...props
}: React.ComponentProps<typeof Input> & { icon: ReactNode }) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
        {icon}
      </span>
      <Input {...props} className={cn("pl-9", props.className)} />
    </div>
  );
}

export function AdmissionFormModal({
  open,
  application,
  onClose,
  onSubmit,
  isPending,
}: {
  open: boolean;
  application?: AdmissionApplication | null;
  onClose: () => void;
  onSubmit: (values: AdmissionFormValues) => void;
  isPending?: boolean;
}) {
  const editing = !!application;

  const [form, setForm] = useState<AdmissionFormValues>(() =>
    toFormValues(application),
  );
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setForm(toFormValues(application));
      setError("");
    }
  }, [open, application]);

  function setChild(key: keyof AdmissionFormValues["childInfo"], value: string) {
    setForm((f) => ({ ...f, childInfo: { ...f.childInfo, [key]: value } }));
  }
  function setGuardian(
    key: keyof AdmissionFormValues["guardianInfo"],
    value: string,
  ) {
    setForm((f) => ({ ...f, guardianInfo: { ...f.guardianInfo, [key]: value } }));
  }
  function setAdditional(
    key: keyof AdmissionFormValues["additionalInfo"],
    value: string,
  ) {
    setForm((f) => ({
      ...f,
      additionalInfo: { ...f.additionalInfo, [key]: value },
    }));
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (form.childInfo.fullName.trim().length < 2) {
      setError("Child's full name is required.");
      return;
    }
    if (!form.guardianInfo.fullName.trim()) {
      setError("Guardian name is required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.guardianInfo.email)) {
      setError("A valid guardian email is required.");
      return;
    }
    if (!/^[\d+\-\s()]{7,}$/.test(form.guardianInfo.phoneNumber)) {
      setError("A valid phone number is required.");
      return;
    }
    onSubmit(form);
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        style={{ width: "min(680px, 96vw)", maxWidth: "none" }}
        className={cn(
          "!max-w-none gap-0 overflow-hidden p-0",
          "flex max-h-[94vh] flex-col",
        )}
      >
        <DialogHeader className="relative shrink-0 border-b border-border bg-gradient-to-br from-primary/5 via-transparent to-transparent px-8 py-6">
          <div className="flex items-start gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              {editing ? <UserCog size={20} /> : <Baby size={20} />}
            </span>
            <div className="min-w-0">
              <DialogTitle className="text-xl tracking-tight">
                {editing ? "Edit application" : "New admission application"}
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm">
                {editing
                  ? "Update the details of this admission application."
                  : "Fill in the child, guardian and additional information below."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form
          onSubmit={submit}
          className="flex min-h-0 flex-1 flex-col"
          id="admission-form"
        >
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-8 py-6">
            <Section title="Child information" icon={<Baby size={18} />}>
              <Field label="Full name" required className="sm:col-span-2">
                <IconInput
                  icon={<User size={16} />}
                  autoFocus
                  value={form.childInfo.fullName}
                  onChange={(e) => setChild("fullName", e.target.value)}
                  maxLength={120}
                  placeholder="Emma Charlotte Smith"
                />
              </Field>

              <Field label="Date of birth" required>
                <Input
                  type="date"
                  value={form.childInfo.dateOfBirth}
                  max={today()}
                  onChange={(e) => setChild("dateOfBirth", e.target.value)}
                />
              </Field>

              <Field label="Gender" required>
                <Select
                  value={form.childInfo.gender}
                  onValueChange={(v) => setChild("gender", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GENDERS.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field
                label="Applying for program"
                required
                className="sm:col-span-2"
              >
                <Select
                  value={form.childInfo.applyingForProgram}
                  onValueChange={(v) => setChild("applyingForProgram", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROGRAMS.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </Section>

            <Section title="Guardian information" icon={<User size={18} />}>
              <Field label="Full name" required className="sm:col-span-2">
                <IconInput
                  icon={<User size={16} />}
                  value={form.guardianInfo.fullName}
                  onChange={(e) => setGuardian("fullName", e.target.value)}
                  maxLength={120}
                  placeholder="John Michael Smith"
                />
              </Field>

              <Field label="Phone number" required>
                <IconInput
                  icon={<Phone size={16} />}
                  value={form.guardianInfo.phoneNumber}
                  onChange={(e) => setGuardian("phoneNumber", e.target.value)}
                  maxLength={20}
                  placeholder="9876543210"
                />
              </Field>

              <Field label="Email" required>
                <IconInput
                  icon={<Mail size={16} />}
                  type="email"
                  value={form.guardianInfo.email}
                  onChange={(e) => setGuardian("email", e.target.value)}
                  maxLength={160}
                  placeholder="john.smith@example.com"
                />
              </Field>

              <Field label="Home address" className="sm:col-span-2">
                <Input
                  value={form.guardianInfo.homeAddress}
                  onChange={(e) => setGuardian("homeAddress", e.target.value)}
                  maxLength={240}
                  placeholder="123 Maple Street, Springfield, IL"
                />
              </Field>
            </Section>

            <Section title="Additional information" icon={<School size={18} />}>
              <Field label="Previous school">
                <IconInput
                  icon={<School size={16} />}
                  value={form.additionalInfo.previousSchool}
                  onChange={(e) =>
                    setAdditional("previousSchool", e.target.value)
                  }
                  maxLength={160}
                  placeholder="Little Stars Preschool"
                />
              </Field>

              <Field label="Referral source">
                <Select
                  value={form.additionalInfo.referralSource}
                  onValueChange={(v) => setAdditional("referralSource", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {REFERRAL_SOURCES.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Medical conditions" className="sm:col-span-2">
                <Textarea
                  rows={3}
                  value={form.additionalInfo.medicalConditions}
                  onChange={(e) =>
                    setAdditional("medicalConditions", e.target.value)
                  }
                  maxLength={500}
                  placeholder="Allergies, chronic conditions, medication…"
                />
              </Field>

              {editing && (
                <Field label="Status" className="sm:col-span-2">
                  <Select
                    value={form.status}
                    onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ADMISSION_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            </Section>

            {error && (
              <p
                role="alert"
                className="rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive"
              >
                {error}
              </p>
            )}
          </div>

          <DialogFooter className="shrink-0 border-t border-border bg-muted/40 px-8 py-4">
            <div className="flex w-full items-center justify-between gap-3">
              <p className="hidden text-xs text-muted-foreground sm:block">
                <span className="text-destructive">*</span> Required fields
              </p>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="primary-button min-w-[140px]"
                  disabled={isPending}
                >
                  {isPending
                    ? "Saving…"
                    : editing
                      ? "Save changes"
                      : "Create application"}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}