import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, X, Check, Eye } from 'lucide-react';
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

const pageVariants = {
  visible: { opacity: 1, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.04 } },
};

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

function AdminSearch({ value, onChange, placeholder = 'Search' }) {
  return (
    <motion.label className="admin-search" variants={itemVariants}>
      <Search size={25} strokeWidth={1.6} />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type="search"
        placeholder={placeholder}
        aria-label={placeholder}
      />
    </motion.label>
  );
}

function StatusChip({ filter, count, active, onClick }) {
  const isRejected = filter.id === 'cancelled';
  const isComplete = ['accepted', 'ready', 'completed', 'all', 'scheduled'].includes(filter.id);
  const Icon = isRejected ? X : Check;

  return (
    <button
      className={`admin-filter-chip ${active ? 'is-active' : ''} ${
        isRejected ? 'is-rejected' : isComplete ? 'is-completed' : 'is-new'
      }`}
      type="button"
      onClick={onClick}
    >
      <Icon size={18} strokeWidth={1.6} />
      <span>{filter.label}</span>
      <strong>{count}</strong>
    </button>
  );
}

function OrderCard({ order, onOpen }) {
  return (
    <motion.article
      className="admin-order-card"
      variants={itemVariants}
      onClick={() => onOpen(order)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') onOpen(order);
      }}
      role="button"
      tabIndex={0}
    >
      <header className="admin-order-card-header">
        <div>
          <h3>Order {order.id}</h3>
          <p>{order.date}</p>
        </div>
        <img src={order.avatar} alt="" className="admin-order-avatar" loading="lazy" />
      </header>
      <div className="admin-order-items">
        {order.items.slice(0, 2).map((item) => (
          <div className="admin-order-item" key={`${order.id}-${item.name}-${item.price}`}>
            <img src={item.image} alt="" className="admin-order-image" loading="lazy" />
            <div className="admin-order-item-copy">
              <div className="admin-order-item-top">
                <h4>{item.name}</h4>
                <span>Qty: {item.quantity}</span>
              </div>
              <p>{item.description}</p>
              <strong>{formatPrice(item.price)}</strong>
            </div>
          </div>
        ))}
      </div>
      <footer className="admin-order-footer">
        <span>X{order.items.length} Items</span>
        <OrderStatus status={order.status} />
      </footer>
      <div className="admin-card-meta">
        <span>{order.customer.name}</span>
        <span>{formatPrice(getOrderTotal(order) + getDeliveryFee(order))}</span>
      </div>
      <button
        className="admin-card-view"
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onOpen(order);
        }}
      >
        <Eye size={15} strokeWidth={1.8} aria-hidden="true" />
        View Details
      </button>
    </motion.article>
  );
}

export default function OrdersTab({ orders, onOpenOrder }) {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [deliveryFilter, setDeliveryFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const counts = useMemo(() => getCounts(orders), [orders]);

  const filteredOrders = orders.filter((order) => {
    const query = search.toLowerCase();
    const matchesSearch = [
      order.id,
      order.customer.name,
      order.customer.phone,
      ...order.items.map((item) => item.name),
    ]
      .join(' ')
      .toLowerCase()
      .includes(query);
    const matchesStatus =
      activeFilter === 'all' ||
      (activeFilter === 'scheduled' ? order.orderType === 'Scheduled Order' : order.status === activeFilter);
    const matchesDelivery = deliveryFilter === 'all' || order.deliveryMethod === deliveryFilter;
    const matchesPayment = paymentFilter === 'all' || order.paymentMethod === paymentFilter;
    return matchesSearch && matchesStatus && matchesDelivery && matchesPayment;
  });

  return (
    <>
      <AdminSearch value={search} onChange={setSearch} placeholder="Search orders, customers, food, phone..." />
      <motion.div className="admin-list-heading" variants={itemVariants}>
        <h1>Orders</h1>
        <div className="admin-inline-filters">
          <select
            className="admin-compact-select"
            value={deliveryFilter}
            onChange={(event) => setDeliveryFilter(event.target.value)}
          >
            <option value="all">All methods</option>
            <option value="Delivery">Delivery</option>
            <option value="Pickup">Pickup</option>
          </select>
          <select
            className="admin-compact-select"
            value={paymentFilter}
            onChange={(event) => setPaymentFilter(event.target.value)}
          >
            <option value="all">All payments</option>
            <option value="Pay on Delivery">Pay on Delivery</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Online Payment">Online Payment</option>
          </select>
        </div>
      </motion.div>
      <motion.div className="admin-filter-row" variants={itemVariants} aria-label="Order filters">
        {statusFilters.map((filter) => (
          <StatusChip
            filter={filter}
            count={counts[filter.id] ?? 0}
            active={activeFilter === filter.id}
            onClick={() => setActiveFilter(filter.id)}
            key={filter.id}
          />
        ))}
      </motion.div>
      <motion.div className="admin-order-grid" variants={pageVariants}>
        {filteredOrders.map((order) => (
          <OrderCard order={order} key={order.id} onOpen={onOpenOrder} />
        ))}
      </motion.div>
    </>
  );
}
