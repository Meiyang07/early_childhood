interface MailtoOptions {
  to: string;
  subject: string;
  body: string;
}

export function buildMailto({ to, subject, body }: MailtoOptions): string {
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function openMailto(options: MailtoOptions): string {
  const href = buildMailto(options);
  window.location.href = href;
  return href;
}