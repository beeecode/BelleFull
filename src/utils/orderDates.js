const DISPLAY_DATE_FORMATTER = new Intl.DateTimeFormat('en-NG', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

function parseLegacyOrderDate(value) {
  if (!value) return null;

  const normalized = String(value)
    .replace(',', '')
    .replace(/\bAM\b/i, ' AM')
    .replace(/\bPM\b/i, ' PM');
  const parsed = new Date(normalized);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function toOrderTimestamp(value = new Date()) {
  if (value instanceof Date) return value.toISOString();

  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();

  return (parseLegacyOrderDate(value) || new Date()).toISOString();
}

export function getOrderTimestamp(orderOrDate) {
  if (orderOrDate && typeof orderOrDate === 'object') {
    return toOrderTimestamp(orderOrDate.createdAt || orderOrDate.date);
  }

  return toOrderTimestamp(orderOrDate);
}

export function formatOrderDate(orderOrDate) {
  const date = new Date(getOrderTimestamp(orderOrDate));
  return DISPLAY_DATE_FORMATTER.format(date);
}

export function getOrderDateKey(orderOrDate) {
  return getOrderTimestamp(orderOrDate).slice(0, 10);
}

export function getOrderTimeKey(orderOrDate) {
  return getOrderTimestamp(orderOrDate).slice(11, 16);
}
