export function normalizeCurrency(currency = 'NGN') {
  return currency || 'NGN';
}

export function getOrderItems(orderOrItems) {
  if (Array.isArray(orderOrItems)) return orderOrItems;
  return Array.isArray(orderOrItems?.items) ? orderOrItems.items : [];
}

export function calculateOrderSubtotal(orderOrItems) {
  if (!Array.isArray(orderOrItems) && Number.isFinite(Number(orderOrItems?.subtotal))) {
    return Math.max(0, Number(orderOrItems.subtotal));
  }

  return getOrderItems(orderOrItems).reduce(
    (total, item) => total + Number(item.price || 0) * Number(item.quantity || 0),
    0,
  );
}

export function getOrderDeliveryFee(order) {
  const storedFee = Number(order?.deliveryFee ?? order?.delivery_fee);
  if (Number.isFinite(storedFee)) return Math.max(0, storedFee);

  const isDelivery =
    order?.delivery_method === 'delivery' ||
    order?.deliveryMethod === 'Delivery' ||
    order?.deliveryType === 'Delivery';

  return isDelivery ? 0 : 0;
}

export function calculateOrderTotal(order) {
  const storedTotal = Number(order?.total);
  if (Number.isFinite(storedTotal) && storedTotal >= 0) return storedTotal;

  return calculateOrderSubtotal(order) + getOrderDeliveryFee(order);
}

export function withOrderTotals(order) {
  const subtotal = Number.isFinite(Number(order?.subtotal))
    ? Math.max(0, Number(order.subtotal))
    : calculateOrderSubtotal(order);
  const deliveryFee = getOrderDeliveryFee(order);
  const total = Number.isFinite(Number(order?.total))
    ? Math.max(0, Number(order.total))
    : subtotal + deliveryFee;

  return {
    ...order,
    subtotal,
    deliveryFee,
    total,
  };
}
