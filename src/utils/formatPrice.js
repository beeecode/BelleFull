export function formatPrice(price, currency = 'NGN') {
  if (price == null) return 'DM for price';
  if (!price) return currency === 'NGN' ? 'NGN 0' : '0';

  if (currency === 'NGN') {
    return `NGN ${Number(price).toLocaleString('en-NG')}`;
  }

  return Number(price).toLocaleString(undefined, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  });
}
