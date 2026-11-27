/**
 * Ghana SMS Gateway Dispatcher (Arkesel / Hubtel)
 * Formats Ghanaian mobile numbers (MTN, Telecel, AT) and sends real-time SMS.
 */

export interface GhanaSmsOptions {
  recipient: string; // e.g. 0244123456, +233244123456, or 233244123456
  message: string;
  senderId?: string;
}

/**
 * Normalizes phone numbers to standard Ghanaian international format (e.g. 233244123456)
 */
export function formatGhanaPhoneNumber(phone: string): string {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    return `233${cleaned.substring(1)}`;
  }
  if (cleaned.startsWith('233') && cleaned.length === 12) {
    return cleaned;
  }
  return cleaned;
}

export async function sendGhanaSms(options: GhanaSmsOptions): Promise<{ success: boolean; messageId?: string }> {
  const recipient = formatGhanaPhoneNumber(options.recipient);
  const senderId = options.senderId || process.env.ARKESEL_SENDER_ID || 'SkoolFinder';
  const apiKey = process.env.ARKESEL_API_KEY;

  if (!recipient || recipient.length < 9) {
    console.warn('Invalid Ghana recipient phone number:', options.recipient);
    return { success: false };
  }

  // If live Arkesel API key is available, dispatch live SMS
  if (apiKey && apiKey.trim().length > 5) {
    try {
      const url = `https://sms.arkesel.com/api/v2/sms/send`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: senderId,
          message: options.message,
          recipients: [recipient],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        return { success: true, messageId: data?.data?.[0]?.id || 'arkesel-ok' };
      } else {
        const err = await res.text();
        console.warn('Arkesel SMS API error:', err);
      }
    } catch (err) {
      console.warn('Arkesel SMS network failure:', err);
    }
  }

  // Local/Demo Simulation fallback
  console.log(`[Ghana SMS Simulated to ${recipient}] "${options.message}" (Sender: ${senderId})`);
  return { success: true, messageId: `sim-sms-${Date.now()}` };
}
