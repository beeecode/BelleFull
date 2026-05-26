const DEFAULT_WHATSAPP_NUMBER = '2348023037230';
const DEFAULT_ORDER_MESSAGE = 'Hello Amazing Taste Delicacies, I would like to place an order.';

export function getWhatsAppUrl(message = DEFAULT_ORDER_MESSAGE, phoneNumber = DEFAULT_WHATSAPP_NUMBER) {
  const normalizedPhone = String(phoneNumber || DEFAULT_WHATSAPP_NUMBER).replace(/\D/g, '');
  const internationalPhone = normalizedPhone.startsWith('0')
    ? `234${normalizedPhone.slice(1)}`
    : normalizedPhone;

  return `https://wa.me/${internationalPhone}?text=${encodeURIComponent(message)}`;
}

export function getMapsUrl(address) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export { DEFAULT_ORDER_MESSAGE };
