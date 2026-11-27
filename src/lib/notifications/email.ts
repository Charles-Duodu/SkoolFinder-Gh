/**
 * Transactional Email Dispatcher for SkoolFinder Ghana using Resend
 */

export interface TransactionalEmailOptions {
  to: string | string[];
  subject: string;
  heading: string;
  bodyText: string;
  details?: Record<string, string>;
  ctaText?: string;
  ctaUrl?: string;
}

export async function sendTransactionalEmail(options: TransactionalEmailOptions): Promise<{ success: boolean; id?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'SkoolFinder Ghana <onboarding@resend.dev>';

  if (!apiKey) {
    console.log('[Email Simulated]', options.to, options.subject);
    return { success: true, id: `sim-${Date.now()}` };
  }

  const detailsHtml = options.details
    ? `<div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin: 20px 0;">
        ${Object.entries(options.details)
          .map(([k, v]) => `<div style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #edf2f7; font-size: 13px;">
              <strong style="color: #475569;">${k}:</strong>
              <span style="color: #0B1E36; font-weight: 600;">${v}</span>
            </div>`)
          .join('')}
      </div>`
    : '';

  const ctaHtml = options.ctaUrl
    ? `<div style="text-align: center; margin: 28px 0;">
        <a href="${options.ctaUrl}" style="background-color: #0B1E36; color: #ffffff; padding: 12px 28px; border-radius: 10px; font-weight: bold; font-size: 14px; text-decoration: none; display: inline-block;">
          ${options.ctaText || 'Open Portal'} &rarr;
        </a>
      </div>`
    : '';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${options.subject}</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; padding: 24px; margin: 0;">
        <div style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
          <div style="background-color: #0B1E36; padding: 28px 32px; text-align: left;">
            <div style="display: inline-block; background-color: #fbbf24; color: #0B1E36; font-weight: 900; font-size: 18px; padding: 6px 12px; border-radius: 8px;">
              SF
            </div>
            <h1 style="color: #ffffff; font-size: 20px; margin: 12px 0 0 0; font-weight: 700;">
              SkoolFinder Ghana
            </h1>
          </div>
          <div style="padding: 32px;">
            <h2 style="color: #0B1E36; font-size: 22px; font-weight: 700; margin-top: 0;">
              ${options.heading}
            </h2>
            <p style="color: #334155; font-size: 14px; line-height: 1.6;">
              ${options.bodyText}
            </p>
            ${detailsHtml}
            ${ctaHtml}
            <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
            <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">
              SkoolFinder Ghana · Greater Accra Private Education Ecosystem<br/>
              Connecting Families, Schools, Educators & Suppliers.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: htmlContent,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return { success: true, id: data.id };
    } else {
      const err = await res.text();
      console.warn('Resend email error:', err);
      return { success: false };
    }
  } catch (err) {
    console.warn('Resend email dispatch failed:', err);
    return { success: false };
  }
}
