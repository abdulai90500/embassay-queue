import nodemailer from 'nodemailer';
import QRCode from 'qrcode';

// ── Mailer (singleton) ─────────────────────────────────────────────────────
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT ?? 465),
    secure: true, // SSL
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// ── Generate QR code as base64 PNG ────────────────────────────────────────
async function generateQRBase64(data: string): Promise<string> {
  return await QRCode.toDataURL(data, {
    width: 200,
    margin: 2,
    color: { dark: '#1e293b', light: '#ffffff' },
  });
}

// ── Email HTML template ───────────────────────────────────────────────────
function buildEmailHTML(params: {
  customerName: string;
  tokenNumber: string;
  serviceName: string;
  position: number;
  ticketId: string;
  qrDataUrl: string;
  date: string;
}) {
  const { customerName, tokenNumber, serviceName, position, ticketId, qrDataUrl, date } = params;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Embassy Queue Ticket</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 20px;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1e3a8a 0%,#2563eb 100%);padding:32px;text-align:center;">
            <div style="font-size:13px;letter-spacing:3px;color:#93c5fd;font-weight:600;text-transform:uppercase;margin-bottom:6px;">EMBASSY QUEUE SYSTEM</div>
            <div style="font-size:28px;font-weight:800;color:#ffffff;">Your Queue Ticket</div>
          </td>
        </tr>

        <!-- Greeting -->
        <tr>
          <td style="padding:32px 40px 0;">
            <p style="margin:0;font-size:16px;color:#334155;">Dear <strong>${customerName}</strong>,</p>
            <p style="margin:12px 0 0;font-size:15px;color:#64748b;line-height:1.6;">
              Your appointment has been registered. Please present this ticket when you arrive at the embassy.
            </p>
          </td>
        </tr>

        <!-- Token box -->
        <tr>
          <td style="padding:24px 40px;">
            <div style="background:#eff6ff;border:2px solid #2563eb;border-radius:12px;padding:24px;text-align:center;">
              <div style="font-size:12px;letter-spacing:2px;color:#2563eb;font-weight:700;text-transform:uppercase;margin-bottom:8px;">Queue Number</div>
              <div style="font-size:52px;font-weight:900;color:#1e3a8a;letter-spacing:4px;">${tokenNumber}</div>
              <div style="font-size:14px;color:#475569;margin-top:6px;">Position in queue: <strong>#${position}</strong></div>
            </div>
          </td>
        </tr>

        <!-- Details + QR side by side -->
        <tr>
          <td style="padding:0 40px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <!-- Details -->
                <td valign="top" style="padding-right:20px;">
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;">
                        <div style="font-size:11px;color:#94a3b8;text-transform:uppercase;font-weight:600;">Service</div>
                        <div style="font-size:15px;color:#1e293b;font-weight:700;margin-top:2px;">${serviceName}</div>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;">
                        <div style="font-size:11px;color:#94a3b8;text-transform:uppercase;font-weight:600;">Date</div>
                        <div style="font-size:15px;color:#1e293b;font-weight:700;margin-top:2px;">${date}</div>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0;">
                        <div style="font-size:11px;color:#94a3b8;text-transform:uppercase;font-weight:600;">Reference</div>
                        <div style="font-size:13px;color:#64748b;font-weight:600;margin-top:2px;font-family:monospace;">${ticketId.slice(0, 8).toUpperCase()}</div>
                      </td>
                    </tr>
                  </table>
                </td>

                <!-- QR Code -->
                <td valign="top" align="center" style="min-width:120px;">
                  <img src="${qrDataUrl}" alt="Ticket QR Code"
                    width="120" height="120"
                    style="border-radius:8px;border:2px solid #e2e8f0;display:block;" />
                  <div style="font-size:11px;color:#94a3b8;margin-top:6px;">Scan at counter</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Note -->
        <tr>
          <td style="padding:0 40px 32px;">
            <div style="background:#fefce8;border-left:4px solid #fbbf24;border-radius:8px;padding:16px;">
              <p style="margin:0;font-size:13px;color:#92400e;line-height:1.6;">
                📋 Please arrive 10 minutes before your appointment. Keep this email for reference.
                Your queue number will be displayed on the screen when it is your turn.
              </p>
            </div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;padding:20px 40px;text-align:center;border-top:1px solid #e2e8f0;">
            <p style="margin:0;font-size:12px;color:#94a3b8;">This is an automated message — please do not reply.</p>
            <p style="margin:6px 0 0;font-size:12px;color:#94a3b8;">© Embassy Queue Management System</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── Public API ────────────────────────────────────────────────────────────

export interface NotificationPayload {
  customerName: string;
  tokenNumber: string;
  serviceName: string;
  position: number;
  ticketId: string;
  email?: string | null;
  phoneNumber?: string | null;
}

export async function sendTicketNotifications(payload: NotificationPayload) {
  const { customerName, tokenNumber, serviceName, position, ticketId, email, phoneNumber } = payload;
  const date = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const results: { email?: string; sms?: string; error?: string } = {};

  // Generate QR (encode the ticket ID)
  const qrDataUrl = await generateQRBase64(ticketId);

  // ── Send Email ──────────────────────────────────────────────
  if (email) {
    try {
      const transporter = createTransporter();
      const html = buildEmailHTML({ customerName, tokenNumber, serviceName, position, ticketId, qrDataUrl, date });

      await transporter.sendMail({
        from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
        to: email,
        subject: `🎫 Your Queue Ticket: ${tokenNumber} — Embassy`,
        html,
        // plain text fallback
        text: `Embassy Queue System\n\nDear ${customerName},\nYour queue number is: ${tokenNumber}\nService: ${serviceName}\nPosition: #${position}\nDate: ${date}\nRef: ${ticketId.slice(0, 8).toUpperCase()}\n\nPlease keep this for reference.`,
      });

      results.email = `Email sent to ${email}`;
      console.log(`[EMAIL ✓] Sent to ${email}: ${tokenNumber}`);
    } catch (err: any) {
      results.error = `Email failed: ${err.message}`;
      console.error('[EMAIL ✗]', err.message);
    }
  }

  // ── SMS (logged — Twilio integration ready) ─────────────────
  if (phoneNumber) {
    const smsText = `Embassy Queue: Your ticket is ${tokenNumber} for ${serviceName}. Position: #${position}. Ref: ${ticketId.slice(0, 8).toUpperCase()}`;
    // TODO: Replace with Twilio client.messages.create(...)
    console.log(`[SMS → ${phoneNumber}] ${smsText}`);
    results.sms = `SMS queued for ${phoneNumber}`;
  }

  return results;
}
