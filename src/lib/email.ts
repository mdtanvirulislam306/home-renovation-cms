import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587", 10),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendInquiryNotification(data: {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
}) {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: adminEmail,
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
    from: process.env.SMTP_FROM,
    to: data.email,
    subject: "We received your message — GreenScape Pro",
    html: `
      <h2>Thank you, ${data.name}!</h2>
      <p>We've received your inquiry and will get back to you within 24 hours.</p>
      <p>Best regards,<br/>GreenScape Pro Team</p>
    `,
  });
}
