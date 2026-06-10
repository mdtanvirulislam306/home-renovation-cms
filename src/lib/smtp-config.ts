import { connectDB } from "@/lib/db";
import Settings from "@/models/Settings";

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
  adminEmail: string;
}

const MASKED_PASSWORD = /^[*•.]+$/;

export function isMaskedPassword(value?: string): boolean {
  if (!value) return true;
  return MASKED_PASSWORD.test(value.trim());
}

export async function getSmtpConfig(): Promise<SmtpConfig | null> {
  await connectDB();
  const settings = await Settings.findOne().lean();
  const smtp = settings?.smtp;

  const host = smtp?.host || process.env.SMTP_HOST || "";
  const user = smtp?.user || process.env.SMTP_USER || "";
  const pass = smtp?.pass || process.env.SMTP_PASS || "";

  if (!host || !user || !pass) return null;

  return {
    host,
    port: smtp?.port || parseInt(process.env.SMTP_PORT || "587", 10),
    secure: smtp?.secure ?? false,
    user,
    pass,
    from: smtp?.from || process.env.SMTP_FROM || user,
    adminEmail: smtp?.adminEmail || process.env.ADMIN_EMAIL || user,
  };
}

export function maskSmtpForClient<T extends { smtp?: { pass?: string } }>(settings: T): T {
  if (!settings.smtp?.pass) {
    return {
      ...settings,
      smtp: settings.smtp
        ? { ...settings.smtp, pass: "", hasPassword: false }
        : settings.smtp,
    };
  }
  return {
    ...settings,
    smtp: { ...settings.smtp, pass: "", hasPassword: true },
  };
}
