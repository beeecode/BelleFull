import { motion } from 'framer-motion';
import { Eye, Plus, History, Settings2 } from 'lucide-react';
import { formatPrice } from '../../../utils/formatPrice';
import { formatOrderDate, getOrderDateKey } from '../../../utils/orderDates';
import { calculateOrderTotal } from '../../../utils/orderTotals';
import { ORDER_STATUS_OPTIONS, ORDER_STATUSES, PAYMENT_STATUSES } from '../../../constants/orderContracts';
import { OrderStatus } from './OrderStatus';

const itemVariants = {
  visible: { opacity: 1, y: 0, transition: { duration: 0.36, ease: [0.22, 1, 0.36, 1] } },
};

function getCounts(orders) {
  return ORDER_STATUS_OPTIONS.reduce((counts, filter) => {
    if (filter.id === 'all') counts[filter.id] = orders.length;
    else counts[filter.id] = orders.filter((order) => order.order_status === filter.id).length;
    return counts;
  }, {});
}

export default function DashboardTab({ orders, products, onPageChange, onOpenOrder }) {
  const paidOrders = orders.filter((order) => order.payment_status === PAYMENT_STATUSES.PAID);
  const totalRevenue = paidOrders.reduce((sum, order) => sum + calculateOrderTotal(order), 0);
  const pendingPayment = orders
    .filter((order) => order.payment_status === PAYMENT_STATUSES.PENDING)
    .reduce((sum, order) => sum + calculateOrderTotal(order), 0);
  const today = new Date().toISOString().slice(0, 10);
  const todayOrders = orders.filter((order) => getOrderDateKey(order) === today);
  const todayRevenue = todayOrders
    .filter((order) => order.payment_status === PAYMENT_STATUSES.PAID)
    .reduce((sum, order) => sum + calculateOrderTotal(order), 0);
  const counts = getCounts(orders);
  
  const metrics = [
    ['Total Orders', orders.length],
    ["Today's Orders", todayOrders.length],
    ['Pending Orders', (counts[ORDER_STATUSES.PAID] || 0) + (counts[ORDER_STATUSES.PREPARING] || 0) + (counts[ORDER_STATUSES.READY_FOR_PICKUP] || 0) + (counts[ORDER_STATUSES.OUT_FOR_DELIVERY] || 0)],
    ['Completed Orders', counts[ORDER_STATUSES.COMPLETED] || 0],
    ['Cancelled Orders', counts[ORDER_STATUSES.CANCELLED] || 0],
    ['Preparing Orders', counts[ORDER_STATUSES.PREPARING] || 0],
    ['Total Revenue', formatPrice(totalRevenue)],
    ["Today's Revenue", formatPrice(todayRevenue)],
    ['Pending Payment', formatPrice(pendingPayment)],
    ['Most Ordered Food', 'Jollof Rice'],
    ['Available Menu Items', products.filter((item) => item.available).length],
    ['Unavailable Menu Items', products.filter((item) => !item.available).length],
  ];
  const recentOrders = orders.filter((order) => order.payment_status === PAYMENT_STATUSES.PAID).slice(0, 4);

  return (
    <>
      <motion.div className="admin-list-heading" variants={itemVariants}>
        <h1>Dashboard</h1>
      </motion.div>
      <div className="admin-metric-grid">
        {metrics.map(([label, value]) => (
          <article className="admin-metric-card" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </article>
        ))}
      </div>
      <div className="admin-quick-actions">
        <button className="admin-primary-button" type="button" onClick={() => onPageChange('orders')}>
          <Eye size={15} strokeWidth={1.8} aria-hidden="true" />
          View Orders
        </button>
        <button className="admin-primary-button" type="button" onClick={() => onPageChange('products')}>
          <Plus size={15} strokeWidth={1.8} aria-hidden="true" />
          Add Menu Item
        </button>
        <button className="admin-primary-button" type="button" onClick={() => onPageChange('orders')}>
          <History size={15} strokeWidth={1.8} aria-hidden="true" />
          View Preparing Orders
        </button>
        <button className="admin-primary-button" type="button" onClick={() => onPageChange('settings')}>
          <Settings2 size={15} strokeWidth={1.8} aria-hidden="true" />
          Open Settings
        </button>
      </div>
      <motion.div className="admin-list-heading" variants={itemVariants}>
        <h1>Recent Orders</h1>
      </motion.div>
      <div className="admin-table-card">
        {recentOrders.map((order) => (
          <button className="admin-table-row admin-recent-row" type="button" onClick={() => onOpenOrder(order)} key={order.id}>
            <span>{order.id}</span>
            <span>{order.customer.name}<small>{order.customer.phone}</small></span>
            <span>{order.items.map((item) => item.name).join(', ')}</span>
            <strong>{formatPrice(calculateOrderTotal(order))}</strong>
            <span>{order.paymentStatus}</span>
            <OrderStatus status={order.order_status} />
            <span>{order.orderType}</span>
            <span>{order.deliveryMethod}</span>
            <span>{formatOrderDate(order)}</span>
          </button>
        ))}
      </div>
    </>
  );
}
