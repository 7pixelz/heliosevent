import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export interface EnquiryData {
  name: string;
  email: string;
  phoneCode: string;
  phone: string;
  company: string;
  location: string;
  teamSize: string;
  targetAudiences: string;
  budget: string;
  preferredDate?: string | null;
  duration?: string | null;
  typeOfProgram?: string | null;
  objectives?: string | null;
  additionalRequirements?: string | null;
  howDidYouHear?: string | null;
}

function row(label: string, value?: string | null) {
  if (!value) return '';
  return `
    <tr>
      <td style="padding:8px 12px;font-size:12px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:1px;white-space:nowrap;width:180px">${label}</td>
      <td style="padding:8px 12px;font-size:14px;color:#111">${value}</td>
    </tr>`;
}

export async function sendEnquiryNotification(data: EnquiryData) {
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f5f6fa;font-family:'Inter',Arial,sans-serif">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08)">

    <!-- Header -->
    <div style="background:#1a1f2e;padding:28px 32px;display:flex;align-items:center;gap:12px">
      <div>
        <div style="font-size:20px;font-weight:800;color:#fff">New Enquiry Received</div>
        <div style="font-size:12px;color:#adc905;margin-top:4px;letter-spacing:2px;text-transform:uppercase">Helios Event Admin</div>
      </div>
    </div>

    <!-- Top bar -->
    <div style="height:3px;background:linear-gradient(90deg,#adc905,#ff6a00)"></div>

    <!-- Contact -->
    <div style="padding:24px 32px 0">
      <div style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#adc905;margin-bottom:12px">Contact Information</div>
      <table style="width:100%;border-collapse:collapse;background:#f9fafb;border-radius:10px;overflow:hidden">
        ${row('Name', data.name)}
        ${row('Email', data.email)}
        ${row('Phone', `${data.phoneCode} ${data.phone}`)}
        ${row('Company', data.company)}
        ${row('Location', data.location)}
      </table>
    </div>

    <!-- Event Details -->
    <div style="padding:20px 32px 0">
      <div style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#adc905;margin-bottom:12px">Event Details</div>
      <table style="width:100%;border-collapse:collapse;background:#f9fafb;border-radius:10px;overflow:hidden">
        ${row('Team Size', data.teamSize)}
        ${row('Target Audience', data.targetAudiences)}
        ${row('Budget', data.budget)}
        ${row('Type of Program', data.typeOfProgram)}
        ${row('Preferred Date', data.preferredDate)}
        ${row('Duration', data.duration)}
        ${row('Objectives', data.objectives)}
        ${row('Addl. Requirements', data.additionalRequirements)}
        ${row('How Did You Hear', data.howDidYouHear)}
      </table>
    </div>

    <!-- CTA -->
    <div style="padding:24px 32px 32px;text-align:center">
      <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/admin/enquiries"
        style="display:inline-block;background:#adc905;color:#fff;font-weight:700;font-size:14px;padding:14px 32px;border-radius:10px;text-decoration:none;letter-spacing:0.5px">
        View in Admin Panel →
      </a>
    </div>

    <!-- Footer -->
    <div style="background:#f5f6fa;padding:16px 32px;text-align:center;font-size:12px;color:#aaa">
      This is an automated notification from Helios Event Admin.
    </div>
  </div>
</body>
</html>`;

  // Admin notification
  await transporter.sendMail({
    from: `"Helios Event" <${process.env.GMAIL_USER}>`,
    to: process.env.NOTIFY_EMAIL,
    subject: `New Enquiry from ${data.name} — ${data.company}`,
    html,
  });

  // Confirmation email to the enquirer
  const confirmHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f5f6fa;font-family:'Inter',Arial,sans-serif">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08)">

    <div style="background:#1a1f2e;padding:28px 32px">
      <div style="font-size:20px;font-weight:800;color:#fff">Thank You, ${data.name}!</div>
      <div style="font-size:12px;color:#adc905;margin-top:4px;letter-spacing:2px;text-transform:uppercase">Helios Event Productions</div>
    </div>
    <div style="height:3px;background:linear-gradient(90deg,#adc905,#ff6a00)"></div>

    <div style="padding:32px">
      <p style="font-size:15px;color:#333;line-height:1.8;margin:0 0 16px">
        We've received your enquiry and our team will get back to you within <strong>24 hours</strong> with a tailored proposal.
      </p>
      <p style="font-size:14px;color:#555;line-height:1.8;margin:0 0 28px">
        In the meantime, feel free to reach us directly:
      </p>

      <div style="background:#f9fafb;border-radius:10px;padding:20px 24px;margin-bottom:28px">
        <div style="font-size:13px;color:#555;margin-bottom:8px">📞 <strong>+91 7401 030 000</strong></div>
        <div style="font-size:13px;color:#555;margin-bottom:8px">✉️ <strong>plan@heliosevent.net</strong></div>
        <div style="font-size:13px;color:#555">📍 28, Judge Jubilee Hills Road, Mylapore, Chennai – 600 004</div>
      </div>

      <div style="text-align:center">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://heliosevent.in'}/portfolio"
          style="display:inline-block;background:#adc905;color:#0d1117;font-weight:700;font-size:14px;padding:14px 32px;border-radius:10px;text-decoration:none">
          View Our Portfolio →
        </a>
      </div>
    </div>

    <div style="background:#f5f6fa;padding:16px 32px;text-align:center;font-size:12px;color:#aaa">
      © 2026 Helios Event Productions. All Rights Reserved.
    </div>
  </div>
</body>
</html>`;

  await transporter.sendMail({
    from: `"Helios Event Productions" <${process.env.GMAIL_USER}>`,
    to: data.email,
    subject: `We've received your enquiry — Helios Event Productions`,
    html: confirmHtml,
  });
}

export interface CareerData {
  name: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  currentRole?: string | null;
  message?: string | null;
  resumeUrl?: string | null;
}

export async function sendCareerNotification(data: CareerData) {
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f5f6fa;font-family:'Inter',Arial,sans-serif">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08)">
    <div style="background:#1a1f2e;padding:28px 32px">
      <div style="font-size:20px;font-weight:800;color:#fff">New Job Application</div>
      <div style="font-size:12px;color:#adc905;margin-top:4px;letter-spacing:2px;text-transform:uppercase">Helios Event Careers</div>
    </div>
    <div style="height:3px;background:linear-gradient(90deg,#adc905,#ff6a00)"></div>
    <div style="padding:24px 32px 0">
      <div style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#adc905;margin-bottom:12px">Applicant Details</div>
      <table style="width:100%;border-collapse:collapse;background:#f9fafb;border-radius:10px;overflow:hidden">
        ${row('Name', data.name)}
        ${row('Email', data.email)}
        ${row('Phone', data.phone)}
        ${row('Position', data.position)}
        ${row('Experience', data.experience)}
        ${row('Current Role', data.currentRole)}
        ${row('Cover Letter', data.message)}
      </table>
    </div>
    ${data.resumeUrl ? `
    <div style="padding:20px 32px 0">
      <p style="font-size:12px;color:#888;margin:0 0 8px">Resume is stored securely. Download from the admin panel.</p>
    </div>` : ''}
    <div style="padding:24px 32px 32px;text-align:center">
      <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/admin/careers"
        style="display:inline-block;background:#1a1f2e;color:#fff;font-weight:700;font-size:14px;padding:14px 32px;border-radius:10px;text-decoration:none">
        View in Admin Panel →
      </a>
    </div>
    <div style="background:#f5f6fa;padding:16px 32px;text-align:center;font-size:12px;color:#aaa">
      This is an automated notification from Helios Event Admin.
    </div>
  </div>
</body>
</html>`;

  await transporter.sendMail({
    from: `"Helios Event" <${process.env.GMAIL_USER}>`,
    to: process.env.NOTIFY_EMAIL,
    subject: `New Application: ${data.position} — ${data.name}`,
    html,
  });

  // Confirmation to applicant
  await transporter.sendMail({
    from: `"Helios Event Productions" <${process.env.GMAIL_USER}>`,
    to: data.email,
    subject: `Application Received — Helios Event Productions`,
    html: `
<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f5f6fa;font-family:'Inter',Arial,sans-serif">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08)">
    <div style="background:#1a1f2e;padding:28px 32px">
      <div style="font-size:20px;font-weight:800;color:#fff">Thank You, ${data.name}!</div>
      <div style="font-size:12px;color:#adc905;margin-top:4px;letter-spacing:2px;text-transform:uppercase">Helios Event Productions</div>
    </div>
    <div style="height:3px;background:linear-gradient(90deg,#adc905,#ff6a00)"></div>
    <div style="padding:32px">
      <p style="font-size:15px;color:#333;line-height:1.8;margin:0 0 16px">
        We've received your application for <strong>${data.position}</strong>. Our HR team will review your profile and reach out if there's a match.
      </p>
      <p style="font-size:14px;color:#555;line-height:1.8;margin:0 0 28px">
        We typically respond within <strong>5–7 business days</strong>.
      </p>
      <div style="text-align:center">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://heliosevent.in'}"
          style="display:inline-block;background:#adc905;color:#0d1117;font-weight:700;font-size:14px;padding:14px 32px;border-radius:10px;text-decoration:none">
          Visit Our Website →
        </a>
      </div>
    </div>
    <div style="background:#f5f6fa;padding:16px 32px;text-align:center;font-size:12px;color:#aaa">
      © 2026 Helios Event Productions. All Rights Reserved.
    </div>
  </div>
</body>
</html>`,
  });
}
