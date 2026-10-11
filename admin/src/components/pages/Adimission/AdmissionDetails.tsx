import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Baby,
  Calendar,
  GraduationCap,
  Heart,
  Mail,
  MapPin,
  Phone,
  School,
  Sparkles,
  User,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import {
  AdmissionApplication,
} from "@/types/adimission";
import { AdmissionStatusBadge } from "./AdimissionStatusBadge";
import { cn } from "@/lib/utils";

/* ---------- Helpers ---------- */
function fmtLong(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { dateStyle: "long" });
}
function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
function initials(name: string) {
  return name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
function age(dateOfBirth: string) {
  const dob = new Date(dateOfBirth);
  const now = new Date();
  let years = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) years--;
  return years;
}

/* ---------- Info row ---------- */
function InfoRow({
  icon,
  label,
  value,
  className,
}: {
  icon: ReactNode;
  label: string;
  value?: string | null;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start gap-3", className)}>
      <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="truncate text-sm font-medium text-foreground">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

/* ---------- Section card ---------- */
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
    <section className="rounded-xl border border-border bg-card">
      <header className="flex items-center gap-2.5 border-b border-border px-4 py-3">
        <span className="grid size-7 place-items-center rounded-md bg-primary/10 text-primary">
          {icon}
        </span>
        <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
      </header>
      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
        {children}
      </div>
    </section>
  );
}

export function AdmissionDetails({
  application,
  onClose,
}: {
  application: AdmissionApplication | null;
  onClose: () => void;
}) {
  const open = !!application;

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="flex w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-xl">
        {application && (
          <>
            {/* ---------- Hero header ---------- */}
            <SheetHeader className="relative shrink-0 border-b border-border bg-gradient-to-br from-primary/8 via-transparent to-transparent px-6 pb-5 pt-6">
              <div className="flex items-start gap-4">
                <div className="grid size-14 shrink-0 place-items-center rounded-full bg-primary text-lg font-semibold text-primary-foreground shadow-sm">
                  {initials(application.childInfo.fullName)}
                </div>
                <div className="min-w-0 flex-1 pr-8">
                  <SheetTitle className="truncate text-lg tracking-tight">
                    {application.childInfo.fullName}
                  </SheetTitle>
                  <SheetDescription className="mt-0.5 text-sm">
                    {application.childInfo.gender} ·{" "}
                    {age(application.childInfo.dateOfBirth)} yrs ·{" "}
                    {application.childInfo.applyingForProgram}
                  </SheetDescription>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <AdmissionStatusBadge status={application.status} />
                    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-0.5 text-xs text-muted-foreground">
                      <Calendar size={12} />
                      Submitted {fmtDateTime(application.submittedAt)}
                    </span>
                  </div>
                </div>
              </div>
            </SheetHeader>

            {/* ---------- Scrollable body ---------- */}
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-muted/30 px-6 py-5">
              {/* Child */}
              <Section title="Child information" icon={<Baby size={15} />}>
                <InfoRow
                  icon={<User size={14} />}
                  label="Full name"
                  value={application.childInfo.fullName}
                  className="sm:col-span-2"
                />
                <InfoRow
                  icon={<GraduationCap size={14} />}
                  label="Applying for"
                  value={application.childInfo.applyingForProgram}
                />
                <InfoRow
                  icon={<Calendar size={14} />}
                  label="Date of birth"
                  value={fmtLong(application.childInfo.dateOfBirth)}
                />
                <InfoRow
                  icon={<Sparkles size={14} />}
                  label="Gender"
                  value={application.childInfo.gender}
                />
                <InfoRow
                  icon={<Calendar size={14} />}
                  label="Age"
                  value={`${age(application.childInfo.dateOfBirth)} years`}
                />
              </Section>

              {/* Guardian */}
              <Section title="Guardian information" icon={<Users size={15} />}>
                <InfoRow
                  icon={<User size={14} />}
                  label="Full name"
                  value={application.guardianInfo.fullName}
                  className="sm:col-span-2"
                />
                <InfoRow
                  icon={<Phone size={14} />}
                  label="Phone"
                  value={application.guardianInfo.phoneNumber}
                />
                <InfoRow
                  icon={<Mail size={14} />}
                  label="Email"
                  value={application.guardianInfo.email}
                />
                <InfoRow
                  icon={<MapPin size={14} />}
                  label="Home address"
                  value={application.guardianInfo.homeAddress}
                  className="sm:col-span-2"
                />
              </Section>

              {/* Additional */}
              <Section title="Additional information" icon={<School size={15} />}>
                <InfoRow
                  icon={<School size={14} />}
                  label="Previous school"
                  value={application.additionalInfo.previousSchool}
                />
                <InfoRow
                  icon={<Sparkles size={14} />}
                  label="Referral source"
                  value={application.additionalInfo.referralSource}
                />
                <InfoRow
                  icon={<Heart size={14} />}
                  label="Medical conditions"
                  value={application.additionalInfo.medicalConditions}
                  className="sm:col-span-2"
                />
              </Section>
            </div>

            {/* ---------- Sticky footer ---------- */}
            <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-border bg-background px-6 py-4">
              <p className="text-xs text-muted-foreground">
                Application ID ·{" "}
                <span className="font-mono">{application._id.slice(-8)}</span>
              </p>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </footer>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}