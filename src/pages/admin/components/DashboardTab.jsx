import { motion } from 'framer-motion';
import { Eye, Plus, History, Settings2, Home, Package } from 'lucide-react';
import { formatPrice } from '../../../utils/formatPrice';
import { OrderStatus } from './OrderStatus';

const statusFilters = [
  { id: 'all', label: 'All Orders' },
  { id: 'new', label: 'New' },
  { id: 'accepted', label: 'Accepted' },
  { id: 'preparing', label: 'Preparing' },
  { id: 'ready', label: 'Ready' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
  { id: 'scheduled', label: 'Scheduled' },
];

const itemVariants = {
  visible: { opacity: 1, y: 0, transition: { duration: 0.36, ease: [0.22, 1, 0.36, 1] } },
};

function getOrderTotal(order) {
  return order.items.reduce((total, item) => total + item.price * item.quantity, 0);
}

function getDeliveryFee(order) {
  return order.deliveryMethod === 'Delivery' ? 1000 : 0;
}

function getCounts(orders) {
  return statusFilters.reduce((counts, filter) => {
    if (filter.id === 'all') counts[filter.id] = orders.length;
    else if (filter.id === 'scheduled') counts[filter.id] = orders.filter((order) => order.orderType === 'Scheduled Order').length;
    else counts[filter.id] = orders.filter((order) => order.status === filter.id).length;
    return counts;
  }, {});
}

function normalizeDate(dateText) {
  return new Date(dateText.replace(',', '')).toISOString().slice(0, 10);
}

export default function DashboardTab({ orders, products, onPageChange, onOpenOrder }) {
  const totalRevenue = orders.reduce((sum, order) => sum + getOrderTotal(order) + getDeliveryFee(order), 0);
  const pendingPayment = orders.filter((order) => order.paymentStatus === 'Pending').reduce((sum, order) => sum + getOrderTotal(order), 0);
  const todayOrders = orders.filter((order) => normalizeDate(order.date) === '2026-05-24');
  const todayRevenue = todayOrders.reduce((sum, order) => sum + getOrderTotal(order) + getDeliveryFee(order), 0);
  const counts = getCounts(orders);
  
  const metrics = [
    ['Total Orders', orders.length],
    ["Today's Orders", todayOrders.length],
    ['Pending Orders', (counts.new || 0) + (counts.accepted || 0) + (counts.preparing || 0) + (counts.ready || 0)],
    ['Completed Orders', counts.completed || 0],
    ['Cancelled Orders', counts.cancelled || 0],
    ['Scheduled Orders', counts.scheduled || 0],
    ['Total Revenue', formatPrice(totalRevenue)],
    ["Today's Revenue", formatPrice(todayRevenue)],
    ['Pending Payment', formatPrice(pendingPayment)],
    ['Most Ordered Food', 'Jollof Rice'],
    ['Available Menu Items', products.filter((item) => item.available).length],
    ['Unavailable Menu Items', products.filter((item) => !item.available).length],
  ];
  const recentOrders = orders.slice(0, 4);

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
          View Scheduled Orders
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
            <strong>{formatPrice(getOrderTotal(order) + getDeliveryFee(order))}</strong>
            <span>{order.paymentStatus}</span>
            <OrderStatus status={order.status} />
            <span>{order.orderType}</span>
            <span>{order.deliveryMethod}</span>
            <span>{order.date}</span>
          </button>
        ))}
      </div>
    </>
  );
}
