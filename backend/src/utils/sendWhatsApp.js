const ApiError = require('./ApiError');

const normalizeNumber = value => String(value || '').replace(/[^\d]/g, '');

const sendWhatsApp = async ({ to, text }) => {
  const number = normalizeNumber(to);
  if (!/^\d{8,15}$/.test(number)) throw new ApiError('Enter the WhatsApp number with its country code.', 400);
  if (!process.env.WHATSAPP_ACCESS_TOKEN || !process.env.WHATSAPP_PHONE_NUMBER_ID) {
    return { delivered: false, skipped: true, error: 'WhatsApp Cloud API is not configured.' };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const version = process.env.WHATSAPP_GRAPH_VERSION || 'v22.0';
    const response = await fetch(`https://graph.facebook.com/${version}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ messaging_product: 'whatsapp', recipient_type: 'individual', to: number, type: 'text', text: { preview_url: false, body: text.slice(0, 4096) } }),
      signal: controller.signal,
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error?.message || `WhatsApp provider returned ${response.status}.`);
    return { delivered: true, providerMessageId: result.messages?.[0]?.id || '' };
  } finally {
    clearTimeout(timeout);
  }
};

module.exports = sendWhatsApp;
