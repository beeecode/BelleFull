import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  CheckCircle2,
  ChefHat,
  Eye,
  History,
  Home,
  Image,
  LogOut,
  Lock,
  Mail,
  Menu,
  Package,
  Pencil,
  Plus,
  Save,
  Search,
  Settings2,
  SlidersHorizontal,
  Trash2,
  Upload,
  X,
  XCircle,
} from 'lucide-react';
import { Logo } from '../components/Logo';
import { siteConfig } from '../constants/siteConfig';
import { adminOrders } from '../data/adminOrders';
import { foodCategories, foodMenuItems } from '../data/foodMenuItems';
import { formatPrice } from '../lib/utils/formatPrice';

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

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'history', label: 'Order History', icon: History },
  { id: 'messages', label: 'Messages', icon: Mail },
  { id: 'products', label: 'Products / Menu', icon: Package },
  { id: 'settings', label: 'Settings', icon: SlidersHorizontal },
];

// Customers is intentionally kept out of the sidebar for now.
// const disabledCustomerNav = { id: 'customers', label: 'Customers', icon: Users };

const statusMeta = {
  new: { label: 'NEW', className: 'is-new', icon: Package },
  accepted: { label: 'ACCEPTED', className: 'is-completed', icon: Check },
  preparing: { label: 'PREPARING', className: 'is-new', icon: Settings2 },
  ready: { label: 'READY', className: 'is-completed', icon: Check },
  completed: { label: 'COMPLETED', className: 'is-completed', icon: Check },
  cancelled: { label: 'CANCELLED', className: 'is-rejected', icon: X },
};

const pageVariants = {
  visible: { opacity: 1, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.04 } },
};

const itemVariants = {
  visible: { opacity: 1, y: 0, transition: { duration: 0.36, ease: [0.22, 1, 0.36, 1] } },
};

const customers = [
  { name: 'Aminat Bello', phone: '0802 303 7230', email: 'aminat@example.com', address: 'QGCR+373 area, Osogbo', landmark: 'Beside Firstbank, Aregbe' },
  { name: 'Tunde Adeyemi', phone: '0814 555 9021', email: '', address: 'Ogo Oluwa, Osogbo', landmark: 'Near roundabout' },
  { name: 'Faith Johnson', phone: '0706 104 8812', email: 'faith@example.com', address: 'Old Garage, Osogbo', landmark: '' },
];

const initialOrders = adminOrders.map((order, index) => ({
  ...order,
  customer: customers[index % customers.length],
  deliveryMethod: index % 2 === 0 ? 'Delivery' : 'Pickup',
  orderType: index === 4 ? 'Scheduled Order' : 'Order Now',
  mealPeriod: index === 4 ? 'Dinner' : '',
  scheduledDate: index === 4 ? '2026-05-24' : '',
  scheduledTime: index === 4 ? '7:30 PM' : '',
  paymentMethod: ['Pay on Delivery', 'Bank Transfer', 'Online Payment'][index % 3],
  paymentStatus: index % 3 === 1 ? 'Paid' : 'Pending',
  status: ['new', 'accepted', 'completed', 'preparing', 'ready', 'cancelled'][index],
}));

const initialProducts = foodMenuItems.map((item, index) => ({
  ...item,
  available: index % 5 !== 0,
}));

const initialMessages = [
  {
    id: 'msg-1',
    name: 'Mariam O.',
    contact: '0803 222 4411',
    subject: 'Birthday tray order',
    content: 'Please can I order small chops and pasta for Saturday afternoon?',
    date: '24 May 2026, 10:15 AM',
    read: false,
  },
  {
    id: 'msg-2',
    name: 'Daniel A.',
    contact: 'daniel@example.com',
    subject: 'Partnership inquiry',
    content: 'I would like to discuss event food supply for an office program.',
    date: '23 May 2026, 04:40 PM',
    read: true,
  },
];

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

function normalizeTime(dateText) {
  return new Date(dateText.replace(',', '')).toTimeString().slice(0, 5);
}

function AdminLogin({ onLogin, showNotice }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.email.trim() || !form.password.trim()) {
      setError('Enter your email or username and password.');
      return;
    }
    setError('');
    onLogin();
  };

  return (
    <main className="admin-login-page">
      <motion.form className="admin-login-card" onSubmit={handleSubmit} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
        <Logo className="admin-login-logo" />
        <div>
          <h1>Admin Login</h1>
          <p>Login to manage restaurant orders and menu</p>
        </div>
        <label className="admin-form-field">
          <span>Email or Username</span>
          <input value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} placeholder="Enter email or username" />
        </label>
        <label className="admin-form-field">
          <span>Password</span>
          <input value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} placeholder="Enter password" type="password" />
        </label>
        {error && <p className="admin-error-text">{error}</p>}
        <button className="admin-primary-button" type="submit">Login</button>
        <button className="admin-link-button" type="button" onClick={() => showNotice('Password Reset', 'Password reset flow will be connected with the backend later.')}>Forgot password?</button>
      </motion.form>
    </main>
  );
}

function ButtonIcon({ icon: Icon }) {
  return Icon ? <Icon size={15} strokeWidth={1.8} aria-hidden="true" /> : null;
}

function SystemAlertModal({ alert, onCancel, onConfirm }) {
  if (!alert) return null;
  const Icon = alert.type === 'danger' ? Trash2 : alert.type === 'success' ? CheckCircle2 : Settings2;

  return (
    <div className="admin-modal-overlay" role="dialog" aria-modal="true">
      <motion.article className="admin-system-alert" initial={{ opacity: 0, y: 18, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}>
        <span className={`admin-alert-icon is-${alert.type || 'info'}`}>
          <Icon size={24} strokeWidth={1.7} />
        </span>
        <h2>{alert.title}</h2>
        <p>{alert.message}</p>
        <div className="admin-alert-actions">
          {alert.onConfirm && (
            <button className="admin-outline-button" type="button" onClick={onCancel}>
              {alert.cancelLabel || 'Cancel'}
            </button>
          )}
          <button className={alert.type === 'danger' ? 'admin-outline-danger' : 'admin-primary-button'} type="button" onClick={onConfirm}>
            {alert.confirmLabel || 'OK'}
          </button>
        </div>
      </motion.article>
    </div>
  );
}

function AdminSearch({ value, onChange, placeholder = 'Search' }) {
  return (
    <motion.label className="admin-search" variants={itemVariants}>
      <Search size={25} strokeWidth={1.6} />
      <input value={value} onChange={(event) => onChange(event.target.value)} type="search" placeholder={placeholder} aria-label={placeholder} />
    </motion.label>
  );
}

function OrderStatus({ status }) {
  const meta = statusMeta[status] ?? statusMeta.new;
  const Icon = meta.icon;
  return (
    <span className={`admin-status-pill ${meta.className}`}>
      <Icon size={18} strokeWidth={1.5} />
      <span>{meta.label}</span>
    </span>
  );
}

function StatusChip({ filter, count, active, onClick }) {
  const isRejected = filter.id === 'cancelled';
  const isComplete = ['accepted', 'ready', 'completed', 'all', 'scheduled'].includes(filter.id);
  const Icon = isRejected ? X : Check;

  return (
    <button className={`admin-filter-chip ${active ? 'is-active' : ''} ${isRejected ? 'is-rejected' : isComplete ? 'is-completed' : 'is-new'}`} type="button" onClick={onClick}>
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
        <img src={order.avatar} alt="" className="admin-order-avatar" />
      </header>
      <div className="admin-order-items">
        {order.items.slice(0, 2).map((item) => (
          <div className="admin-order-item" key={`${order.id}-${item.name}-${item.price}`}>
            <img src={item.image} alt="" className="admin-order-image" />
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
      <button className="admin-card-view" type="button" onClick={(event) => { event.stopPropagation(); onOpen(order); }}><ButtonIcon icon={Eye} />View Details</button>
    </motion.article>
  );
}

function DashboardPage({ orders, products, onPageChange, onOpenOrder }) {
  const totalRevenue = orders.reduce((sum, order) => sum + getOrderTotal(order) + getDeliveryFee(order), 0);
  const pendingPayment = orders.filter((order) => order.paymentStatus === 'Pending').reduce((sum, order) => sum + getOrderTotal(order), 0);
  const todayOrders = orders.filter((order) => normalizeDate(order.date) === '2026-05-24');
  const todayRevenue = todayOrders.reduce((sum, order) => sum + getOrderTotal(order) + getDeliveryFee(order), 0);
  const counts = getCounts(orders);
  const metrics = [
    ['Total Orders', orders.length],
    ["Today's Orders", todayOrders.length],
    ['Pending Orders', counts.new + counts.accepted + counts.preparing + counts.ready],
    ['Completed Orders', counts.completed],
    ['Cancelled Orders', counts.cancelled],
    ['Scheduled Orders', counts.scheduled],
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
        <button className="admin-primary-button" type="button" onClick={() => onPageChange('orders')}><ButtonIcon icon={Eye} />View Orders</button>
        <button className="admin-primary-button" type="button" onClick={() => onPageChange('products')}><ButtonIcon icon={Plus} />Add Menu Item</button>
        <button className="admin-primary-button" type="button" onClick={() => onPageChange('orders')}><ButtonIcon icon={History} />View Scheduled Orders</button>
        <button className="admin-primary-button" type="button" onClick={() => onPageChange('settings')}><ButtonIcon icon={Settings2} />Open Settings</button>
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

function OrdersPage({ orders, onOpenOrder }) {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [deliveryFilter, setDeliveryFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const counts = useMemo(() => getCounts(orders), [orders]);

  const filteredOrders = orders.filter((order) => {
    const query = search.toLowerCase();
    const matchesSearch = [order.id, order.customer.name, order.customer.phone, ...order.items.map((item) => item.name)].join(' ').toLowerCase().includes(query);
    const matchesStatus = activeFilter === 'all' || (activeFilter === 'scheduled' ? order.orderType === 'Scheduled Order' : order.status === activeFilter);
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
          <select className="admin-compact-select" value={deliveryFilter} onChange={(event) => setDeliveryFilter(event.target.value)}>
            <option value="all">All methods</option>
            <option value="Delivery">Delivery</option>
            <option value="Pickup">Pickup</option>
          </select>
          <select className="admin-compact-select" value={paymentFilter} onChange={(event) => setPaymentFilter(event.target.value)}>
            <option value="all">All payments</option>
            <option value="Pay on Delivery">Pay on Delivery</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Online Payment">Online Payment</option>
          </select>
        </div>
      </motion.div>
      <motion.div className="admin-filter-row" variants={itemVariants} aria-label="Order filters">
        {statusFilters.map((filter) => (
          <StatusChip filter={filter} count={counts[filter.id] ?? 0} active={activeFilter === filter.id} onClick={() => setActiveFilter(filter.id)} key={filter.id} />
        ))}
      </motion.div>
      <motion.div className="admin-order-grid" variants={pageVariants}>
        {filteredOrders.map((order) => <OrderCard order={order} key={order.id} onOpen={onOpenOrder} />)}
      </motion.div>
    </>
  );
}

function DetailRow({ label, value }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value || '-'}</strong>
    </div>
  );
}

function OrderDetailsModal({ order, onClose, onStatusChange }) {
  if (!order) return null;
  const subtotal = getOrderTotal(order);
  const deliveryFee = getDeliveryFee(order);
  const actions = [
    ['Accept Order', 'accepted'],
    ['Start Preparing', 'preparing'],
    ['Mark as Ready', 'ready'],
    ['Mark as Completed', 'completed'],
    ['Cancel Order', 'cancelled'],
  ];

  return (
    <div className="admin-modal-overlay" role="dialog" aria-modal="true">
      <motion.article className="admin-details-modal" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
        <button className="admin-modal-close" type="button" onClick={onClose} aria-label="Close order details"><X size={20} /></button>
        <header>
          <div>
            <h2>Order {order.id}</h2>
            <p>{order.date}</p>
          </div>
          <OrderStatus status={order.status} />
        </header>
        <section className="admin-details-grid">
          <div className="admin-detail-panel">
            <h3>Customer Details</h3>
            <DetailRow label="Name" value={order.customer.name} />
            <DetailRow label="Phone" value={order.customer.phone} />
            <DetailRow label="Email" value={order.customer.email} />
            <DetailRow label="Address" value={order.deliveryMethod === 'Delivery' ? order.customer.address : 'Pickup'} />
            <DetailRow label="Landmark" value={order.customer.landmark} />
          </div>
          <div className="admin-detail-panel">
            <h3>Timing & Payment</h3>
            <DetailRow label="Order type" value={order.orderType} />
            <DetailRow label="Meal period" value={order.mealPeriod} />
            <DetailRow label="Scheduled date" value={order.scheduledDate} />
            <DetailRow label="Scheduled time" value={order.scheduledTime} />
            <DetailRow label="Payment method" value={order.paymentMethod} />
            <DetailRow label="Payment status" value={order.paymentStatus} />
            <DetailRow label="Current status" value={statusMeta[order.status]?.label} />
          </div>
        </section>
        <section className="admin-detail-panel">
          <h3>Order Details</h3>
          {order.items.map((item) => (
            <div className="admin-detail-item" key={`${order.id}-${item.id}`}>
              <span>{item.name} x{item.quantity}</span>
              <strong>{formatPrice(item.price * item.quantity)}</strong>
            </div>
          ))}
          <DetailRow label="Subtotal" value={formatPrice(subtotal)} />
          <DetailRow label="Delivery fee" value={formatPrice(deliveryFee)} />
          <DetailRow label="Grand total" value={formatPrice(subtotal + deliveryFee)} />
        </section>
        <div className="admin-detail-actions">
          {actions.map(([label, status]) => (
          <button className={status === 'cancelled' ? 'admin-outline-danger' : 'admin-primary-button'} type="button" key={status} onClick={() => onStatusChange(order.id, status)}>
              <ButtonIcon icon={status === 'cancelled' ? XCircle : status === 'preparing' ? ChefHat : CheckCircle2} />{label}
            </button>
          ))}
          <button className="admin-outline-button" type="button" onClick={onClose}><ButtonIcon icon={X} />Close Modal</button>
        </div>
      </motion.article>
    </div>
  );
}

function HistoryPage({ orders, onOpenOrder }) {
  const [filters, setFilters] = useState({ query: '', status: 'all', payment: 'all', delivery: 'all', startDate: '', endDate: '', startTime: '', endTime: '' });
  const historyOrders = orders.filter((order) => {
    if (!['completed', 'cancelled'].includes(order.status)) return false;
    const orderDate = normalizeDate(order.date);
    const orderTime = normalizeTime(order.date);
    const query = filters.query.toLowerCase();
    return (
      [order.id, order.customer.name, order.customer.phone, ...order.items.map((item) => item.name)].join(' ').toLowerCase().includes(query) &&
      (filters.status === 'all' || order.status === filters.status) &&
      (filters.payment === 'all' || order.paymentMethod === filters.payment) &&
      (filters.delivery === 'all' || order.deliveryMethod === filters.delivery) &&
      (!filters.startDate || orderDate >= filters.startDate) &&
      (!filters.endDate || orderDate <= filters.endDate) &&
      (!filters.startTime || orderTime >= filters.startTime) &&
      (!filters.endTime || orderTime <= filters.endTime)
    );
  });
  const updateFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }));

  return (
    <>
      <AdminSearch value={filters.query} onChange={(value) => updateFilter('query', value)} placeholder="Search history by order, customer, phone..." />
      <motion.div className="admin-list-heading" variants={itemVariants}><h1>Order History</h1></motion.div>
      <div className="admin-history-filters">
        <input type="date" value={filters.startDate} onChange={(event) => updateFilter('startDate', event.target.value)} aria-label="Start Date" />
        <input type="date" value={filters.endDate} onChange={(event) => updateFilter('endDate', event.target.value)} aria-label="End Date" />
        <input type="time" value={filters.startTime} onChange={(event) => updateFilter('startTime', event.target.value)} aria-label="Start Time" />
        <input type="time" value={filters.endTime} onChange={(event) => updateFilter('endTime', event.target.value)} aria-label="End Time" />
        <select value={filters.status} onChange={(event) => updateFilter('status', event.target.value)}><option value="all">All status</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select>
        <select value={filters.payment} onChange={(event) => updateFilter('payment', event.target.value)}><option value="all">All payments</option><option value="Pay on Delivery">Pay on Delivery</option><option value="Bank Transfer">Bank Transfer</option><option value="Online Payment">Online Payment</option></select>
        <select value={filters.delivery} onChange={(event) => updateFilter('delivery', event.target.value)}><option value="all">All delivery</option><option value="Delivery">Delivery</option><option value="Pickup">Pickup</option></select>
      </div>
      <motion.div className="admin-table-card" variants={itemVariants}>
        {historyOrders.map((order) => (
          <button className="admin-table-row" type="button" onClick={() => onOpenOrder(order)} key={order.id}>
            <span>{order.id}</span>
            <span>{order.customer.name}</span>
            <span>{order.date}</span>
            <span>{order.items.map((item) => item.name).join(', ')}</span>
            <strong>{formatPrice(getOrderTotal(order) + getDeliveryFee(order))}</strong>
            <span>{order.paymentMethod}</span>
            <OrderStatus status={order.status} />
          </button>
        ))}
      </motion.div>
    </>
  );
}

function ProductModal({ product, categories, onClose, onSave }) {
  const [form, setForm] = useState(product ?? { id: `food-${Date.now()}`, name: '', category: categories[1] ?? 'Pasta', description: '', price: '', image: '', available: true });
  const [error, setError] = useState('');
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update('image', reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="admin-modal-overlay" role="dialog" aria-modal="true">
      <motion.form
        className="admin-details-modal admin-edit-modal"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={(event) => {
          event.preventDefault();
          if (!form.image) {
            setError('Please upload a food image before saving.');
            return;
          }
          setError('');
          onSave({ ...form, price: Number(form.price) });
        }}
      >
        <button className="admin-modal-close" type="button" onClick={onClose} aria-label="Close product form"><X size={20} /></button>
        <h2>{product ? 'Edit Food Item' : 'Add New Food Item'}</h2>
        <label className="admin-form-field"><span>Food name</span><input value={form.name} onChange={(event) => update('name', event.target.value)} required /></label>
        <label className="admin-form-field"><span>Category</span><select value={form.category} onChange={(event) => update('category', event.target.value)}>{categories.filter((category) => category !== 'All').map((category) => <option key={category}>{category}</option>)}</select></label>
        <label className="admin-form-field"><span>Description</span><input value={form.description} onChange={(event) => update('description', event.target.value)} required /></label>
        <label className="admin-form-field"><span>Price</span><input type="number" value={form.price} onChange={(event) => update('price', event.target.value)} required /></label>
        <label className="admin-upload-field">
          <span>Upload Food Image</span>
          <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImageUpload} />
          <div className="admin-upload-box">
            {form.image ? <img src={form.image} alt="Food preview" /> : <Image size={30} strokeWidth={1.5} />}
            <strong>{form.image ? 'Change selected image' : 'Click to upload food image'}</strong>
            <small>PNG, JPG, or WEBP supported</small>
          </div>
        </label>
        <label className="admin-form-field"><span>Availability</span><select value={form.available ? 'available' : 'unavailable'} onChange={(event) => update('available', event.target.value === 'available')}><option value="available">Available</option><option value="unavailable">Unavailable</option></select></label>
        {error && <p className="admin-error-text">{error}</p>}
        <button className="admin-primary-button" type="submit"><ButtonIcon icon={Save} />Save Food Item</button>
      </motion.form>
    </div>
  );
}

function ProductsPage({ products, setProducts, categories, setCategories, requestConfirm, showNotice }) {
  const [activeTab, setActiveTab] = useState('food');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [categoryDraft, setCategoryDraft] = useState('');
  const [editingCategory, setEditingCategory] = useState('');

  const visibleProducts = products.filter((item) => {
    const matchesSearch = [item.name, item.category, item.description].join(' ').toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesAvailability = availabilityFilter === 'all' || String(item.available) === availabilityFilter;
    return matchesSearch && matchesCategory && matchesAvailability;
  });
  const saveProduct = (product) => {
    setProducts((current) => (current.some((item) => item.id === product.id) ? current.map((item) => (item.id === product.id ? product : item)) : [product, ...current]));
    setEditingProduct(null);
    setShowProductModal(false);
  };
  const deleteProduct = (id) => {
    requestConfirm({
      title: 'Delete Food Item?',
      message: 'Are you sure you want to delete this food item? This action cannot be undone.',
      confirmLabel: 'Delete',
      onConfirm: () => setProducts((current) => current.filter((item) => item.id !== id)),
    });
  };
  const saveCategory = () => {
    const value = categoryDraft.trim();
    if (!value) return;
    setCategories((current) => (editingCategory ? current.map((category) => (category === editingCategory ? value : category)) : [...current, value]));
    setCategoryDraft('');
    setEditingCategory('');
  };
  const deleteCategory = (category) => {
    if (category === 'All') {
      showNotice('Required Category', 'The All category is required and cannot be deleted.');
      return;
    }
    requestConfirm({
      title: 'Delete Category?',
      message: `Are you sure you want to delete ${category}? This action cannot be undone.`,
      confirmLabel: 'Delete',
      onConfirm: () => setCategories((current) => current.filter((item) => item !== category)),
    });
  };

  return (
    <>
      <AdminSearch value={search} onChange={setSearch} placeholder="Search food item..." />
      <motion.div className="admin-list-heading" variants={itemVariants}>
        <h1>Products / Menu</h1>
        <button className="admin-primary-button" type="button" onClick={() => { setEditingProduct(null); setShowProductModal(true); }}><ButtonIcon icon={Plus} />Add New Food</button>
      </motion.div>
      <div className="admin-tabs">
        <button className={activeTab === 'food' ? 'is-active' : ''} type="button" onClick={() => setActiveTab('food')}>Food Items</button>
        <button className={activeTab === 'categories' ? 'is-active' : ''} type="button" onClick={() => setActiveTab('categories')}>Categories</button>
      </div>
      {activeTab === 'food' ? (
        <>
          <div className="admin-inline-filters">
            <select className="admin-compact-select" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>{categories.map((category) => <option key={category}>{category}</option>)}</select>
            <select className="admin-compact-select" value={availabilityFilter} onChange={(event) => setAvailabilityFilter(event.target.value)}><option value="all">All availability</option><option value="true">Available</option><option value="false">Unavailable</option></select>
          </div>
          <motion.div className="admin-product-grid" variants={pageVariants}>
            {visibleProducts.map((item) => (
              <article className="admin-product-card" key={item.id}>
                <img src={item.image} alt="" />
                <div><h3>{item.name}</h3><p>{item.category}</p><strong>{formatPrice(item.price)}</strong><span className={item.available ? 'is-available' : 'is-unavailable'}>{item.available ? 'Available' : 'Unavailable'}</span></div>
                <footer>
                  <button type="button" onClick={() => { setEditingProduct(item); setShowProductModal(true); }}><ButtonIcon icon={Pencil} />Edit</button>
                  <button type="button" onClick={() => deleteProduct(item.id)}><ButtonIcon icon={Trash2} />Delete</button>
                  <button type="button" onClick={() => setProducts((current) => current.map((product) => (product.id === item.id ? { ...product, available: !product.available } : product)))}><ButtonIcon icon={item.available ? XCircle : CheckCircle2} />{item.available ? 'Mark Unavailable' : 'Mark Available'}</button>
                </footer>
              </article>
            ))}
          </motion.div>
        </>
      ) : (
        <>
          <div className="admin-category-form">
            <input value={categoryDraft} onChange={(event) => setCategoryDraft(event.target.value)} placeholder="Category name" />
            <button className="admin-primary-button" type="button" onClick={saveCategory}><ButtonIcon icon={editingCategory ? Save : Plus} />{editingCategory ? 'Save Category' : 'Add Category'}</button>
          </div>
          <div className="admin-simple-grid">
            {categories.map((category) => (
              <article className="admin-simple-card" key={category}>
                <strong>{category}</strong>
                <div>
                  <button type="button" onClick={() => { setEditingCategory(category); setCategoryDraft(category); }}><ButtonIcon icon={Pencil} />Edit</button>
                  <button type="button" onClick={() => deleteCategory(category)}><ButtonIcon icon={Trash2} />Delete</button>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
      {showProductModal && <ProductModal product={editingProduct} categories={categories} onClose={() => setShowProductModal(false)} onSave={saveProduct} />}
    </>
  );
}

function MessagesPage({ messages, setMessages, requestConfirm }) {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const deleteMessage = (id) => {
    requestConfirm({
      title: 'Delete Message?',
      message: 'Are you sure you want to delete this message? This action cannot be undone.',
      confirmLabel: 'Delete',
      onConfirm: () => setMessages((current) => current.filter((message) => message.id !== id)),
    });
  };

  return (
    <>
      <motion.div className="admin-list-heading" variants={itemVariants}><h1>Messages</h1></motion.div>
      <div className="admin-simple-grid">
        {messages.map((message) => (
          <article className="admin-message-card" key={message.id}>
            <header><strong>{message.name}</strong><span className={message.read ? 'is-available' : 'is-unavailable'}>{message.read ? 'Read' : 'Unread'}</span></header>
            <p>{message.contact}</p><h3>{message.subject}</h3><p>{message.content}</p>
            <footer>
              <span>{message.date}</span>
              <button type="button" onClick={() => setSelectedMessage(message)}><ButtonIcon icon={Eye} />View</button>
              <button type="button" onClick={() => setMessages((current) => current.map((item) => (item.id === message.id ? { ...item, read: true } : item)))}><ButtonIcon icon={Check} />Mark as read</button>
              <button type="button" onClick={() => deleteMessage(message.id)}><ButtonIcon icon={Trash2} />Delete</button>
            </footer>
          </article>
        ))}
      </div>
      {selectedMessage && (
        <div className="admin-modal-overlay" role="dialog" aria-modal="true">
          <article className="admin-details-modal">
            <button className="admin-modal-close" type="button" onClick={() => setSelectedMessage(null)}><X size={20} /></button>
            <h2>{selectedMessage.subject}</h2>
            <p>{selectedMessage.name} - {selectedMessage.contact}</p>
            <div className="admin-detail-panel"><p>{selectedMessage.content}</p><DetailRow label="Date" value={selectedMessage.date} /><DetailRow label="Status" value={selectedMessage.read ? 'Read' : 'Unread'} /></div>
            <button className="admin-primary-button" type="button" onClick={() => { setMessages((current) => current.map((item) => (item.id === selectedMessage.id ? { ...item, read: true } : item))); setSelectedMessage(null); }}><ButtonIcon icon={Check} />Mark as read</button>
          </article>
        </div>
      )}
    </>
  );
}

function SettingsPage({ settings, setSettings, onLogout, showNotice }) {
  const [passwordOpen, setPasswordOpen] = useState(false);
  const update = (key, value) => setSettings((current) => ({ ...current, [key]: value }));

  return (
    <>
      <motion.div className="admin-list-heading" variants={itemVariants}><h1>Settings</h1></motion.div>
      <div className="admin-settings-card">
        {Object.entries(settings).map(([key, value]) => (
          <label className="admin-form-field" key={key}><span>{key.replace(/([A-Z])/g, ' $1')}</span><input value={value} onChange={(event) => update(key, event.target.value)} placeholder={key} /></label>
        ))}
        <label className="admin-upload-field admin-logo-upload"><span>Logo upload</span><input type="file" accept="image/png,image/jpeg,image/webp" onChange={() => showNotice('Logo Selected', 'Logo upload is ready for backend connection.')} /><div className="admin-upload-box"><Upload size={24} /><strong>Choose logo file</strong><small>PNG, JPG, or WEBP supported</small></div></label>
        <button className="admin-primary-button" type="button" onClick={() => setPasswordOpen(true)}><ButtonIcon icon={Lock} />Change Password</button>
        <button className="admin-outline-danger" type="button" onClick={onLogout}><ButtonIcon icon={LogOut} />Logout</button>
      </div>
      {passwordOpen && (
        <div className="admin-modal-overlay" role="dialog" aria-modal="true">
          <form className="admin-details-modal admin-edit-modal" onSubmit={(event) => { event.preventDefault(); setPasswordOpen(false); showNotice('Password Updated', 'Password changed locally for the mock admin flow.'); }}>
            <button className="admin-modal-close" type="button" onClick={() => setPasswordOpen(false)}><X size={20} /></button>
            <h2>Change Password</h2>
            <label className="admin-form-field"><span>Current password</span><input type="password" required /></label>
            <label className="admin-form-field"><span>New password</span><input type="password" required /></label>
            <button className="admin-primary-button" type="submit"><ButtonIcon icon={Save} />Save Password</button>
          </form>
        </div>
      )}
    </>
  );
}

function AdminShell({ children, activePage, onPageChange, sidebarOpen, setSidebarOpen, onLogout }) {
  return (
    <main className="admin-page" aria-label={`${siteConfig.restaurantName} admin dashboard`}>
      <motion.div className="admin-dashboard" variants={pageVariants} initial="visible" animate="visible">
        <button className="admin-mobile-toggle" type="button" aria-label={sidebarOpen ? 'Close admin menu' : 'Open admin menu'} aria-expanded={sidebarOpen} onClick={() => setSidebarOpen((isOpen) => !isOpen)}>
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <button className={`admin-sidebar-backdrop${sidebarOpen ? ' is-open' : ''}`} type="button" aria-label="Close admin menu" onClick={() => setSidebarOpen(false)} />
        <aside className={`admin-sidebar${sidebarOpen ? ' is-open' : ''}`}>
          <Logo className="admin-brand-logo" />
          <nav className="admin-sidebar-nav" aria-label="Admin navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button className={`admin-sidebar-link${activePage === item.id ? ' is-active' : ''}`} type="button" key={item.id} onClick={() => { onPageChange(item.id); setSidebarOpen(false); }}>
                  <Icon size={23} strokeWidth={1.7} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
          <button className="admin-sidebar-link admin-logout" type="button" onClick={onLogout}><LogOut size={24} strokeWidth={1.6} /><span>Logout</span></button>
        </aside>
        <section className="admin-main-content">{children}</section>
      </motion.div>
    </main>
  );
}

export function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => window.localStorage.getItem('amazingTasteAdmin') === 'active');
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [systemAlert, setSystemAlert] = useState(null);
  const [orders, setOrders] = useState(initialOrders);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(foodCategories);
  const [messages, setMessages] = useState(initialMessages);
  const [settings, setSettings] = useState({
    restaurantName: siteConfig.restaurantName,
    phoneNumber: '0802 303 7230',
    whatsAppNumber: '0802 303 7230',
    email: '',
    address: siteConfig.contact.address,
    openingHours: 'Orders on Instagram',
    deliveryFee: '1000',
    instagramLink: siteConfig.contact.socialLinks[0]?.url ?? '',
  });

  const selectedOrder = orders.find((order) => order.id === selectedOrderId);
  const requestConfirm = ({ title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', onConfirm }) => {
    setSystemAlert({ type: 'danger', title, message, confirmLabel, cancelLabel, onConfirm });
  };
  const showNotice = (title, message) => {
    setSystemAlert({ type: 'info', title, message, confirmLabel: 'OK' });
  };
  const closeSystemAlert = () => setSystemAlert(null);
  const confirmSystemAlert = () => {
    systemAlert?.onConfirm?.();
    setSystemAlert(null);
  };
  const handleStatusChange = (orderId, status) => {
    setOrders((current) => current.map((order) => (order.id === orderId ? { ...order, status } : order)));
  };
  const handleLogout = () => {
    requestConfirm({
      title: 'Logout?',
      message: 'Are you sure you want to logout from the admin panel?',
      confirmLabel: 'Logout',
      onConfirm: () => {
      window.localStorage.removeItem('amazingTasteAdmin');
      setIsLoggedIn(false);
      setActivePage('dashboard');
      },
    });
  };

  if (!isLoggedIn) {
    return (
      <>
        <AdminLogin showNotice={showNotice} onLogin={() => { window.localStorage.setItem('amazingTasteAdmin', 'active'); setIsLoggedIn(true); }} />
        <SystemAlertModal alert={systemAlert} onCancel={closeSystemAlert} onConfirm={confirmSystemAlert} />
      </>
    );
  }

  const pageContent = {
    dashboard: <DashboardPage orders={orders} products={products} onPageChange={setActivePage} onOpenOrder={(order) => setSelectedOrderId(order.id)} />,
    orders: <OrdersPage orders={orders} onOpenOrder={(order) => setSelectedOrderId(order.id)} />,
    history: <HistoryPage orders={orders} onOpenOrder={(order) => setSelectedOrderId(order.id)} />,
    products: <ProductsPage products={products} setProducts={setProducts} categories={categories} setCategories={setCategories} requestConfirm={requestConfirm} showNotice={showNotice} />,
    messages: <MessagesPage messages={messages} setMessages={setMessages} requestConfirm={requestConfirm} />,
    settings: <SettingsPage settings={settings} setSettings={setSettings} onLogout={handleLogout} showNotice={showNotice} />,
  };

  return (
    <AdminShell activePage={activePage} onPageChange={setActivePage} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} onLogout={handleLogout}>
      {pageContent[activePage]}
      <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrderId(null)} onStatusChange={handleStatusChange} />
      <SystemAlertModal alert={systemAlert} onCancel={closeSystemAlert} onConfirm={confirmSystemAlert} />
    </AdminShell>
  );
}
