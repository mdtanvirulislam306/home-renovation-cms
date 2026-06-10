import nodemailer from "nodemailer";
import { getSmtpConfig } from "@/lib/smtp-config";

async function createTransporter() {
  const config = await getSmtpConfig();
  if (!config) {
    throw new Error("SMTP is not configured. Add email settings in Admin → Settings → Email.");
  }

  return {
    transporter: nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: { user: config.user, pass: config.pass },
    }),
    config,
  };
}

export async function sendInquiryNotification(data: {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
  siteName?: string;
}) {
  const { transporter, config } = await createTransporter();
  const siteName = data.siteName || "GreenScape Pro";

  await transporter.sendMail({
    from: config.from,
    to: config.adminEmail,
    subject: `New Inquiry from ${data.name}`,
    html: `
      <h2>New Contact Inquiry</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone || "N/A"}</p>
      <p><strong>Service:</strong> ${data.service || "General"}</p>
      <p><strong>Message:</strong></p>
      <p>${data.message}</p>
    `,
  });

  await transporter.sendMail({
    from: config.from,
    to: data.email,
    subject: `We received your message — ${siteName}`,
    html: `
      <h2>Thank you, ${data.name}!</h2>
      <p>We've received your inquiry and will get back to you within 24 hours.</p>
      <p>Best regards,<br/>${siteName} Team</p>
    `,
  });
}

export async function sendInquiryReply(data: {
  to: string;
  toName: string;
  subject: string;
  message: string;
  originalMessage?: string;
  siteName?: string;
}) {
  const { transporter, config } = await createTransporter();
  const siteName = data.siteName || "GreenScape Pro";
  const htmlMessage = data.message.replace(/\n/g, "<br/>");

  await transporter.sendMail({
    from: config.from,
    to: data.to,
    subject: data.subject,
    html: `
      <p>Hi ${data.toName},</p>
      <div>${htmlMessage}</div>
      ${
        data.originalMessage
          ? `<hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb;" />
             <p style="color:#6b7280;font-size:13px;"><strong>Your original message:</strong></p>
             <p style="color:#6b7280;font-size:13px;">${data.originalMessage.replace(/\n/g, "<br/>")}</p>`
          : ""
      }
      <p style="margin-top:24px;">Best regards,<br/>${siteName} Team</p>
    `,
  });
}
