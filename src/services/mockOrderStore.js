import { adminOrders } from '../data/adminOrders';
import { customers } from '../data/customers';
import {
  getPaymentStatusLabel,
  normalizeOrderStatus,
  normalizePaymentStatus,
  ORDER_STATUSES,
  PAYMENT_STATUSES,
} from '../constants/orderContracts';
import { formatOrderDate, toOrderTimestamp } from '../utils/orderDates';
import { calculateOrderSubtotal, withOrderTotals } from '../utils/orderTotals';

const ORDERS_KEY = 'atd_admin_orders';

const readOrders = () => {
  try {
    const stored = window.localStorage.getItem(ORDERS_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const writeOrders = (orders) => {
  window.localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
};

function stripRemovedLocationFields(value) {
  const nextValue = { ...value };

  Object.keys(nextValue).forEach((key) => {
    const normalizedKey = key.toLowerCase().replace(/_/g, '');
    const isOldDirectionField = normalizedKey.includes('land') && normalizedKey.includes('mark');
    const isRemovedMapMetadata = ['deliveryplaceid', 'deliverylatitude', 'deliverylongitude'].includes(normalizedKey);

    if (isOldDirectionField || isRemovedMapMetadata) {
      delete nextValue[key];
    }
  });

  return nextValue;
}

export function normalizeMockOrder(order, index = 0) {
  const orderWithoutRemovedLocation = stripRemovedLocationFields(order);

  const orderStatus = normalizeOrderStatus(order.order_status || order.status);
  const payment_status = normalizePaymentStatus(order.payment_status || order.paymentStatus, orderStatus);
  const customer = stripRemovedLocationFields(order.customer || customers[index % customers.length] || {});
  const createdAt = toOrderTimestamp(order.createdAt || order.date);

  const delivery_method = String(
    order.delivery_method ||
      order.deliveryMethod ||
      order.deliveryType ||
      (index % 2 === 0 ? 'delivery' : 'pickup'),
  ).toLowerCase() === 'pickup'
    ? 'pickup'
    : 'delivery';
  const deliveryMethod = delivery_method === 'delivery' ? 'Delivery' : 'Pickup';
  const resolvedAddress = order.delivery_address || order.deliveryAddress || customer.address || '';
  const delivery_address = delivery_method === 'delivery' ? resolvedAddress : null;
  const storedDeliveryFee = Number(order.deliveryFee ?? order.delivery_fee);
  const deliveryFee = Number.isFinite(storedDeliveryFee)
    ? Math.max(0, storedDeliveryFee)
    : delivery_method === 'delivery'
      ? 1000
      : 0;
  const subtotal = Number.isFinite(Number(order.subtotal))
    ? Math.max(0, Number(order.subtotal))
    : calculateOrderSubtotal(order);
  const total = Number.isFinite(Number(order.total))
    ? Math.max(0, Number(order.total))
    : subtotal + deliveryFee;

  return withOrderTotals({
    ...orderWithoutRemovedLocation,
    id: order.id || order.orderNumber || `ATD-${Math.floor(100000 + Math.random() * 900000)}`,
    orderNumber: order.orderNumber || order.id,
    createdAt,
    date: createdAt,
    displayDate: formatOrderDate(createdAt),
    customer: {
      ...customer,
      address: delivery_address || '',
    },
    delivery_method,
    deliveryMethod,
    deliveryType: deliveryMethod,
    delivery_address,
    branch: order.branch || 'Osogbo',
    orderNote: order.orderNote || '',
    paymentMethod: order.paymentMethod || 'Online Payment',
    payment_status,
    paymentStatus: getPaymentStatusLabel(payment_status),
    order_status: orderStatus,
    status: orderStatus,
    subtotal,
    deliveryFee,
    total,
    paymentReference: order.paymentReference || order.payment_reference || null,
  });
}

function getInitialOrders() {
  return adminOrders.map((order, index) => {
    const seededStatuses = [
      ORDER_STATUSES.PENDING_PAYMENT,
      ORDER_STATUSES.PAID,
      ORDER_STATUSES.PREPARING,
      ORDER_STATUSES.READY_FOR_PICKUP,
      ORDER_STATUSES.OUT_FOR_DELIVERY,
      ORDER_STATUSES.COMPLETED,
    ];
    const order_status = seededStatuses[index] || ORDER_STATUSES.PENDING_PAYMENT;

    return normalizeMockOrder(
      {
        ...order,
        customer: customers[index % customers.length],
        deliveryMethod: index % 2 === 0 ? 'Delivery' : 'Pickup',
        orderType: index === 4 ? 'Scheduled Order' : 'Order Now',
        mealPeriod: index === 4 ? 'Dinner' : '',
        scheduledDate: index === 4 ? '2026-05-24' : '',
        scheduledTime: index === 4 ? '7:30 PM' : '',
        paymentMethod: 'Online Payment',
        payment_status: order_status === ORDER_STATUSES.PENDING_PAYMENT ? PAYMENT_STATUSES.PENDING : PAYMENT_STATUSES.PAID,
        order_status,
        status: order_status,
        paymentReference: order_status === ORDER_STATUSES.PENDING_PAYMENT ? null : `MOCK-${order.id.replace(/\D/g, '')}`,
      },
      index,
    );
  });
}

export function getMockOrders() {
  const storedOrders = readOrders();
  const orders = (storedOrders || getInitialOrders()).map(normalizeMockOrder);
  writeOrders(orders);
  return orders;
}

export function updateMockOrder(orderId, updater) {
  const orders = getMockOrders();
  const nextOrders = orders.map((order) =>
    order.id === orderId ? normalizeMockOrder({ ...order, ...updater(order) }) : order,
  );
  writeOrders(nextOrders);
  return nextOrders.find((order) => order.id === orderId);
}

export function createMockOrder(orderDetails) {
  const orderNumber = `ATD-${Math.floor(100000 + Math.random() * 900000)}`;
  const delivery_method = orderDetails.delivery_method === 'pickup' ? 'pickup' : 'delivery';
  const deliveryMethod = delivery_method === 'delivery' ? 'Delivery' : 'Pickup';
  const delivery_address = delivery_method === 'delivery' ? orderDetails.delivery_address : null;
  const order = normalizeMockOrder({
    id: orderNumber,
    orderNumber,
    createdAt: toOrderTimestamp(),
    customer: {
      name: orderDetails.fullName,
      phone: orderDetails.phoneNumber,
      email: orderDetails.emailAddress,
      address: delivery_address,
    },
    items: orderDetails.items,
    delivery_method,
    deliveryMethod,
    deliveryType: deliveryMethod,
    delivery_address,
    branch: orderDetails.branch,
    orderNote: orderDetails.orderNote,
    orderType: orderDetails.orderType,
    mealPeriod: orderDetails.mealPeriod,
    scheduledDate: orderDetails.orderDate,
    scheduledTime: orderDetails.orderTime,
    paymentMethod: orderDetails.paymentMethod || 'Online Payment',
    payment_status: PAYMENT_STATUSES.PENDING,
    paymentStatus: 'Pending',
    order_status: ORDER_STATUSES.PENDING_PAYMENT,
    status: ORDER_STATUSES.PENDING_PAYMENT,
    subtotal: orderDetails.subtotal,
    deliveryFee: orderDetails.deliveryFee,
    total: orderDetails.total,
    paymentReference: null,
  });

  const nextOrders = [order, ...getMockOrders()];
  writeOrders(nextOrders);
  return order;
}

export function markMockOrderPaid(orderId) {
  return updateMockOrder(orderId, () => ({
    payment_status: PAYMENT_STATUSES.PAID,
    paymentStatus: 'Paid',
    order_status: ORDER_STATUSES.PAID,
    status: ORDER_STATUSES.PAID,
    paymentReference: `MOCK-${Date.now()}`,
  }));
}

export function markMockOrderFailed(orderId) {
  return updateMockOrder(orderId, () => ({
    payment_status: PAYMENT_STATUSES.FAILED,
    paymentStatus: 'Failed',
    order_status: ORDER_STATUSES.FAILED_PAYMENT,
    status: ORDER_STATUSES.FAILED_PAYMENT,
    paymentReference: `MOCK-FAILED-${Date.now()}`,
  }));
}

export function updateMockOrderStatus(orderId, status) {
  const nextStatus = normalizeOrderStatus(status);
  return updateMockOrder(orderId, (order) => ({
    order_status: order.payment_status === PAYMENT_STATUSES.PAID || [ORDER_STATUSES.CANCELLED, ORDER_STATUSES.FAILED_PAYMENT].includes(nextStatus)
      ? nextStatus
      : order.order_status,
    status: order.payment_status === PAYMENT_STATUSES.PAID || [ORDER_STATUSES.CANCELLED, ORDER_STATUSES.FAILED_PAYMENT].includes(nextStatus)
      ? nextStatus
      : order.order_status,
  }));
}
