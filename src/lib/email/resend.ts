import { Resend } from 'resend';

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

const DEFAULT_FROM =
  process.env.RESEND_FROM_EMAIL || 'SkoolFinder Ghana <onboarding@resend.dev>';
const ADMIN_EMAIL =
  process.env.ADMIN_NOTIFICATION_EMAIL || 'support@skoolfinder.com.gh';

interface EmailDispatchResult {
  sent: boolean;
  mode: 'resend' | 'mock_logged';
  id?: string;
}

async function sendEmailSafe(params: {
  to: string | string[];
  subject: string;
  html: string;
}): Promise<EmailDispatchResult> {
  const resend = getResendClient();
  if (!resend) {
    console.info('[Resend Mock Dispatch - Add RESEND_API_KEY in .env.local to send live]', {
      from: DEFAULT_FROM,
      to: params.to,
      subject: params.subject,
    });
    return { sent: false, mode: 'mock_logged' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: DEFAULT_FROM,
      to: params.to,
      subject: params.subject,
      html: params.html,
    });

    if (error) {
      console.error('[Resend Error]', error);
      return { sent: false, mode: 'resend' };
    }

    return { sent: true, mode: 'resend', id: data?.id };
  } catch (err) {
    console.error('[Resend Exception]', err);
    return { sent: false, mode: 'resend' };
  }
}

export async function sendAdmissionSubmittedEmails(payload: {
  trackingId: string;
  studentName: string;
  parentName: string;
  parentEmail: string;
  schoolName: string;
  schoolEmail?: string;
  targetLevel: string;
  targetTerm: string;
}) {
  const parentPromise = sendEmailSafe({
    to: payload.parentEmail,
    subject: `Application Received: ${payload.studentName} — ${payload.schoolName} (#${payload.trackingId.toUpperCase()})`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px;">
        <h2 style="color: #102A43; margin-top: 0;">Admission Application Lodged</h2>
        <p>Dear <strong>${payload.parentName}</strong>,</p>
        <p>Your formal admission application for <strong>${payload.studentName}</strong> (${payload.targetLevel}, ${payload.targetTerm}) has been submitted to <strong>${payload.schoolName}</strong>.</p>
        <div style="background: #f8fafc; padding: 14px; border-radius: 8px; margin: 16px 0;">
          <strong>Tracking Reference:</strong> #${payload.trackingId.toUpperCase()}<br/>
          <strong>Current Stage:</strong> Submitted (Pending School Review)
        </div>
        <p style="font-size: 13px; color: #64748b;">Track live assessment schedules and offer letters anytime inside your SkoolFinder Ghana Parents Workspace.</p>
      </div>
    `,
  });

  const schoolRecipient = payload.schoolEmail || ADMIN_EMAIL;
  const schoolPromise = sendEmailSafe({
    to: schoolRecipient,
    subject: `New Student Admission Application: ${payload.studentName} (${payload.targetLevel})`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px;">
        <h2 style="color: #102A43; margin-top: 0;">New Online Admission Application</h2>
        <p><strong>${payload.schoolName}</strong> has received a new student entry application via SkoolFinder Ghana.</p>
        <ul>
          <li><strong>Candidate:</strong> ${payload.studentName}</li>
          <li><strong>Guardian:</strong> ${payload.parentName} (${payload.parentEmail})</li>
          <li><strong>Stage & Term:</strong> ${payload.targetLevel} — ${payload.targetTerm}</li>
          <li><strong>Reference:</strong> #${payload.trackingId.toUpperCase()}</li>
        </ul>
        <p>Log in to your School Management Dashboard to review enclosed documents and schedule an assessment date.</p>
      </div>
    `,
  });

  return Promise.all([parentPromise, schoolPromise]);
}

export async function sendEnquiryNotificationEmail(payload: {
  schoolName: string;
  schoolEmail?: string;
  parentName: string;
  parentEmail: string;
  subject: string;
  message: string;
}) {
  return sendEmailSafe({
    to: payload.schoolEmail || ADMIN_EMAIL,
    subject: `Parent Enquiry for ${payload.schoolName}: ${payload.subject}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px;">
        <h2 style="color: #102A43;">New Admissions Enquiry</h2>
        <p><strong>From:</strong> ${payload.parentName} (${payload.parentEmail})</p>
        <p><strong>Subject:</strong> ${payload.subject}</p>
        <blockquote style="background: #f8fafc; padding: 12px; border-left: 4px solid #C5A55A;">${payload.message}</blockquote>
        <p style="font-size: 13px; color: #64748b;">Respond directly from your SkoolFinder School Dashboard.</p>
      </div>
    `,
  });
}

export async function sendEntityVerificationEmail(payload: {
  recipientEmail: string;
  entityName: string;
  entityType: 'School' | 'Professional' | 'Supplier';
  status: string;
}) {
  return sendEmailSafe({
    to: payload.recipientEmail,
    subject: `SkoolFinder Ghana Verification Update: ${payload.entityName} (${payload.status.toUpperCase()})`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px;">
        <h2 style="color: #102A43;">Verification Status Update</h2>
        <p>Your ${payload.entityType} profile <strong>${payload.entityName}</strong> has been updated to: <strong>${payload.status}</strong>.</p>
        <p>If approved, your listing is now live across Greater Accra on SkoolFinder Ghana.</p>
      </div>
    `,
  });
}

export async function sendWelcomeEmail(payload: {
  recipientEmail: string;
  fullName: string;
  role: 'parent' | 'school_owner' | 'professional' | 'supplier';
}) {
  const roleLabels: Record<string, { label: string; portal: string; portalPath: string; color: string }> = {
    parent: {
      label: 'Parent / Guardian',
      portal: 'Parents Workspace',
      portalPath: '/parents',
      color: '#102A43',
    },
    school_owner: {
      label: 'School Proprietor / Administrator',
      portal: 'School Owners Portal',
      portalPath: '/school-owners',
      color: '#102A43',
    },
    professional: {
      label: 'Licensed Teacher / Educator',
      portal: 'Professionals Portal',
      portalPath: '/professionals',
      color: '#102A43',
    },
    supplier: {
      label: 'Educational Supplier / Vendor',
      portal: 'Suppliers Portal',
      portalPath: '/suppliers',
      color: '#102A43',
    },
  };

  const { label, portal, portalPath, color } = roleLabels[payload.role] || roleLabels.parent;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://skool-finder-gh-zydn.vercel.app';

  return sendEmailSafe({
    to: payload.recipientEmail,
    subject: `Welcome to SkoolFinder Ghana — Your ${portal} Is Ready`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #0A1628 0%, #102A43 100%); padding: 28px 24px; text-align: center;">
          <h1 style="color: #C5A55A; margin: 0 0 4px; font-size: 22px; font-weight: 900; letter-spacing: -0.5px;">
            SkoolFinder<span style="color: #fff;">Ghana</span>
          </h1>
          <p style="color: #94a3b8; margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px;">
            Greater Accra Private Education Ecosystem
          </p>
        </div>

        <!-- Body -->
        <div style="padding: 28px 24px; background: #fff;">
          <h2 style="color: ${color}; margin: 0 0 12px; font-size: 18px;">Welcome aboard, ${payload.fullName}! 🎉</h2>
          <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 16px;">
            Your <strong>${label}</strong> account has been successfully created on SkoolFinder Ghana — Greater Accra's dedicated private education platform.
          </p>

          <!-- Role badge -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 16px; margin: 0 0 20px;">
            <p style="margin: 0 0 4px; font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">Your Portal</p>
            <p style="margin: 0; font-size: 15px; color: #102A43; font-weight: 700;">${portal}</p>
          </div>

          <!-- CTA Button -->
          <div style="text-align: center; margin: 24px 0;">
            <a href="${appUrl}${portalPath}" style="display: inline-block; background: #C5A55A; color: #0A1628; text-decoration: none; font-weight: 800; font-size: 14px; padding: 12px 28px; border-radius: 8px; letter-spacing: 0.3px;">
              → Open My ${portal}
            </a>
          </div>

          <p style="color: #64748b; font-size: 13px; line-height: 1.6; margin: 0;">
            If you have any questions, reply to this email or contact us at <a href="mailto:support@skoolfinder.com.gh" style="color: #102A43;">support@skoolfinder.com.gh</a>.
          </p>
        </div>

        <!-- Footer -->
        <div style="background: #f8fafc; padding: 16px 24px; border-top: 1px solid #e2e8f0; text-align: center;">
          <p style="color: #94a3b8; font-size: 11px; margin: 0;">
            © ${new Date().getFullYear()} SkoolFinder Ghana · Greater Accra Region, Ghana
          </p>
        </div>
      </div>
    `,
  });
}

export async function sendSafeguardingAlertEmail(payload: {
  caseId: string;
  title: string;
  entityName: string;
  severity: string;
  category: string;
}) {
  return sendEmailSafe({
    to: ADMIN_EMAIL,
    subject: `[SAFEGUARDING ${payload.severity.toUpperCase()}] ${payload.title} (#${payload.caseId})`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #fecdd3; border-radius: 12px; padding: 24px;">
        <h2 style="color: #be123c;">Confidential Safeguarding Case Logged</h2>
        <p><strong>Reference:</strong> #${payload.caseId.toUpperCase()}</p>
        <p><strong>Institution / Subject:</strong> ${payload.entityName}</p>
        <p><strong>Category:</strong> ${payload.category} &bull; <strong>Severity:</strong> ${payload.severity}</p>
        <p>Review immediately inside the Super Admin Safeguarding Desk.</p>
      </div>
    `,
  });
}
