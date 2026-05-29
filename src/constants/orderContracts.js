export const PAYMENT_STATUSES = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
};

export const ORDER_STATUSES = {
  PENDING_PAYMENT: 'pending_payment',
  PAID: 'paid',
  PREPARING: 'preparing',
  READY_FOR_PICKUP: 'ready_for_pickup',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  FAILED_PAYMENT: 'failed_payment',
};

export const FINAL_PAYMENT_STATUSES = Object.values(PAYMENT_STATUSES);
export const FINAL_ORDER_STATUSES = Object.values(ORDER_STATUSES);

export const ORDER_STATUS_OPTIONS = [
  { id: 'all', label: 'All Orders' },
  { id: ORDER_STATUSES.PENDING_PAYMENT, label: 'Pending Payment' },
  { id: ORDER_STATUSES.PAID, label: 'Paid' },
  { id: ORDER_STATUSES.PREPARING, label: 'Preparing' },
  { id: ORDER_STATUSES.READY_FOR_PICKUP, label: 'Ready for Pickup' },
  { id: ORDER_STATUSES.OUT_FOR_DELIVERY, label: 'Out for Delivery' },
  { id: ORDER_STATUSES.COMPLETED, label: 'Completed' },
  { id: ORDER_STATUSES.CANCELLED, label: 'Cancelled' },
  { id: ORDER_STATUSES.FAILED_PAYMENT, label: 'Failed Payment' },
];

export const HISTORY_ORDER_STATUSES = [
  ORDER_STATUSES.COMPLETED,
  ORDER_STATUSES.CANCELLED,
  ORDER_STATUSES.FAILED_PAYMENT,
];

const LEGACY_ORDER_STATUS_MAP = {
  new: ORDER_STATUSES.PENDING_PAYMENT,
  pending: ORDER_STATUSES.PENDING_PAYMENT,
  accepted: ORDER_STATUSES.PAID,
  ready: ORDER_STATUSES.READY_FOR_PICKUP,
  rejected: ORDER_STATUSES.CANCELLED,
};

export function normalizeOrderStatus(status) {
  const normalized = String(status || '').toLowerCase();
  return FINAL_ORDER_STATUSES.includes(normalized)
    ? normalized
    : LEGACY_ORDER_STATUS_MAP[normalized] || ORDER_STATUSES.PENDING_PAYMENT;
}

export function normalizePaymentStatus(paymentStatus, orderStatus) {
  const normalized = String(paymentStatus || '').toLowerCase();
  if (FINAL_PAYMENT_STATUSES.includes(normalized)) return normalized;

  const normalizedOrderStatus = normalizeOrderStatus(orderStatus);
  if (normalizedOrderStatus === ORDER_STATUSES.FAILED_PAYMENT) return PAYMENT_STATUSES.FAILED;
  if (normalizedOrderStatus === ORDER_STATUSES.PENDING_PAYMENT) return PAYMENT_STATUSES.PENDING;
  return PAYMENT_STATUSES.PAID;
}

export function getPaymentStatusLabel(status) {
  const normalized = normalizePaymentStatus(status);
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}
