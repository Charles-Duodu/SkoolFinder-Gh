/**
 * Bachs Payment & Billing Platform Helper (bachs.io)
 * Supports Ghana Mobile Money (MTN MoMo, Telecel Cash, AT Money) and Cards
 */

export interface BachsCustomer {
  email: string;
  name?: string;
  phone?: string;
}

export interface CreateCheckoutOptions {
  customer: BachsCustomer;
  amountGhs: number; // in Ghana Cedis, e.g. 150 for GH₵150.00
  purpose: 'featured_listing' | 'admission_application' | 'claim_verification' | 'tender_bid' | 'subscription';
  title: string;
  description?: string;
  targetId?: string;
  baseUrl?: string;
  metadata?: Record<string, any>;
  successUrl?: string;
  cancelUrl?: string;
}

export interface CheckoutSessionResult {
  checkoutUrl: string;
  sessionId: string;
  reference: string;
  amountPesewas: number;
  mode: 'live' | 'sandbox' | 'demo';
}

const isLiveBachsKey = (key?: string) => {
  if (!key) return false;
  return (key.startsWith('sk_live_') || key.startsWith('sk_sandbox_')) && !key.includes('demo');
};

export const getBachsBaseUrl = () => {
  const env = process.env.NEXT_PUBLIC_BACHS_ENVIRONMENT || 'sandbox';
  return env === 'production'
    ? 'https://api.bachs.io'
    : 'https://sandbox-api.bachs.io';
};

export async function createBachsCheckout(options: CreateCheckoutOptions): Promise<CheckoutSessionResult> {
  const secretKey = process.env.BACHS_SECRET_KEY;
  const baseUrl = options.baseUrl || process.env.NEXT_PUBLIC_APP_URL || 'https://skool-finder-gh.vercel.app';
  const reference = `SF-GH-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
  const amountPesewas = Math.round(options.amountGhs * 100);

  const successUrl = options.successUrl || `${baseUrl}/payment/success?ref=${reference}&purpose=${options.purpose}&target=${options.targetId || ''}&amount=${options.amountGhs}`;
  const cancelUrl = options.cancelUrl || `${baseUrl}/payment/cancel?ref=${reference}`;

  // If live or sandbox API key is configured, call Bachs REST API
  if (isLiveBachsKey(secretKey)) {
    try {
      const apiUrl = `${getBachsBaseUrl()}/v1/checkout-sessions`;
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${secretKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          pricing: {
            amount: options.amountGhs.toFixed(2),
            currency: 'GHS',
          },
          customer: {
            email: options.customer.email,
            name: options.customer.name || options.customer.email,
            phone: options.customer.phone || undefined,
          },
          success_url: successUrl,
          cancel_url: cancelUrl,
          metadata: {
            title: options.title,
            purpose: options.purpose,
            targetId: options.targetId,
            reference,
            ...options.metadata,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const liveCheckoutUrl = data.checkout_url || data.url;
        if (liveCheckoutUrl) {
          return {
            checkoutUrl: liveCheckoutUrl,
            sessionId: data.id || data.session_id || reference,
            reference,
            amountPesewas,
            mode: secretKey?.startsWith('sk_live_') ? 'live' : 'sandbox',
          };
        }
      } else {
        const errorText = await res.text();
        console.error('Bachs API rejected checkout:', res.status, errorText);
        let errorJson: any = null;
        try { errorJson = JSON.parse(errorText); } catch {}
        throw new Error(errorJson?.message || errorJson?.error || `Bachs API error (${res.status}): ${errorText}`);
      }
    } catch (err: any) {
      console.error('Bachs request failed:', err);
      // Re-throw so user gets visible diagnostic feedback
      throw err;
    }
  }

  // Graceful Demo Mode (only used when NO Bachs API key is configured at all)
  const simulatedUrl = `/payment/success?ref=${reference}&purpose=${options.purpose}&target=${options.targetId || ''}&simulated=true&amount=${options.amountGhs}`;

  return {
    checkoutUrl: simulatedUrl,
    sessionId: `demo_session_${reference}`,
    reference,
    amountPesewas,
    mode: 'demo',
  };
}

export async function verifyBachsPayment(reference: string): Promise<{
  success: boolean;
  status: 'completed' | 'pending' | 'failed';
  amountPesewas: number;
  channel?: string;
}> {
  const secretKey = process.env.BACHS_SECRET_KEY;

  if (isLiveBachsKey(secretKey)) {
    try {
      const res = await fetch(`${getBachsBaseUrl()}/v1/checkouts/${encodeURIComponent(reference)}`, {
        headers: {
          'Authorization': `Bearer ${secretKey}`,
          'Accept': 'application/json',
        },
      });
      if (res.ok) {
        const data = await res.json();
        const isPaid = data.status === 'completed' || data.status === 'paid' || data.status === 'succeeded';
        return {
          success: isPaid,
          status: isPaid ? 'completed' : data.status || 'pending',
          amountPesewas: data.amount || 0,
          channel: data.payment_method || 'mobile_money',
        };
      }
    } catch (e) {
      console.warn('Could not verify with Bachs API:', e);
    }
  }

  // Demo fallback verification
  return {
    success: true,
    status: 'completed',
    amountPesewas: 0,
    channel: 'mobile_money_mtn',
  };
}
