import { adminOrders } from '../data/adminOrders';
import { customers } from '../data/customers';

const ORDERS_KEY = 'atd_admin_orders';

const finalStatusMap = {
  new: 'pending_payment',
  pending: 'pending_payment',
  accepted: 'paid',
  ready: 'ready_for_pickup',
  rejected: 'cancelled',
};

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

const formatDate = (date = new Date()) =>
  date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

function inferPaymentStatus(orderStatus, paymentStatus) {
  const normalizedPaymentStatus = String(paymentStatus || '').toLowerCase();
  if (['paid', 'pending', 'failed'].includes(normalizedPaymentStatus)) return normalizedPaymentStatus;
  if (orderStatus === 'failed_payment') return 'failed';
  if (orderStatus === 'pending_payment') return 'pending';
  return 'paid';
}

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

  const orderStatus = finalStatusMap[order.order_status || order.status] || order.order_status || order.status || 'pending_payment';
  const payment_status = inferPaymentStatus(orderStatus, order.payment_status || order.paymentStatus);
  const customer = stripRemovedLocationFields(order.customer || customers[index % customers.length] || {});

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

  return {
    ...orderWithoutRemovedLocation,
    id: order.id || order.orderNumber || `ATD-${Math.floor(100000 + Math.random() * 900000)}`,
    orderNumber: order.orderNumber || order.id,
    date: order.date || formatDate(),
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
    paymentStatus: payment_status.charAt(0).toUpperCase() + payment_status.slice(1),
    order_status: orderStatus,
    status: orderStatus,
    paymentReference: order.paymentReference || order.payment_reference || null,
  };
}

function getInitialOrders() {
  return adminOrders.map((order, index) => {
    const seededStatuses = ['pending_payment', 'paid', 'preparing', 'ready_for_pickup', 'out_for_delivery', 'completed'];
    const order_status = seededStatuses[index] || 'pending_payment';

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
        payment_status: order_status === 'pending_payment' ? 'pending' : 'paid',
        order_status,
        status: order_status,
        paymentReference: order_status === 'pending_payment' ? null : `MOCK-${order.id.replace(/\D/g, '')}`,
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
    date: formatDate(),
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
    payment_status: 'pending',
    paymentStatus: 'Pending',
    order_status: 'pending_payment',
    status: 'pending_payment',
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
    payment_status: 'paid',
    paymentStatus: 'Paid',
    order_status: 'paid',
    status: 'paid',
    paymentReference: `MOCK-${Date.now()}`,
  }));
}

export function markMockOrderFailed(orderId) {
  return updateMockOrder(orderId, () => ({
    payment_status: 'failed',
    paymentStatus: 'Failed',
    order_status: 'failed_payment',
    status: 'failed_payment',
    paymentReference: `MOCK-FAILED-${Date.now()}`,
  }));
}

export function updateMockOrderStatus(orderId, status) {
  return updateMockOrder(orderId, (order) => ({
    order_status: order.payment_status === 'paid' || ['cancelled', 'failed_payment'].includes(status)
      ? status
      : order.order_status,
    status: order.payment_status === 'paid' || ['cancelled', 'failed_payment'].includes(status)
      ? status
      : order.order_status,
  }));
}
