import "server-only";
import { createTransport } from "nodemailer";

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

/**
 * Send transactional email.
 * Falls back to console logging in development when SMTP is not configured.
 */
export async function sendEmail(payload: EmailPayload): Promise<void> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM } = process.env;

  // Console fallback — used in dev / when SMTP is not wired
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.log(
      "📧 [sendEmail] SMTP not configured — printing email to console:\n",
      `To: ${payload.to}\nSubject: ${payload.subject}\n\n${payload.html}`
    );
    return;
  }

  const transporter = createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT ?? "587", 10),
    secure: SMTP_PORT === "465",
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  await transporter.sendMail({
    from: EMAIL_FROM ?? `"Great Finance" <${SMTP_USER}>`,
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
  });
}
