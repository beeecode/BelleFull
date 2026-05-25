import { motion } from 'framer-motion';
import { X, CheckCircle2, ChefHat, XCircle } from 'lucide-react';
import { OrderStatus, statusMeta } from '../../pages/admin/components/OrderStatus';
import { formatPrice } from '../../utils/formatPrice';

function DetailRow({ label, value }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value || '-'}</strong>
    </div>
  );
}

export function OrderDetailsModal({ order, onClose, onStatusChange }) {
  if (!order) return null;

  const subtotal = order.items.reduce((total, item) => total + item.price * item.quantity, 0);
  const deliveryFee = order.deliveryMethod === 'Delivery' ? 1000 : 0;

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
        <button className="admin-modal-close" type="button" onClick={onClose} aria-label="Close order details">
          <X size={20} />
        </button>
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
            <button
              className={status === 'cancelled' ? 'admin-outline-danger' : 'admin-primary-button'}
              type="button"
              key={status}
              onClick={() => {
                onStatusChange(order.id, status);
                onClose();
              }}
            >
              {status === 'cancelled' ? (
                <XCircle size={15} strokeWidth={1.8} aria-hidden="true" />
              ) : status === 'preparing' ? (
                <ChefHat size={15} strokeWidth={1.8} aria-hidden="true" />
              ) : (
                <CheckCircle2 size={15} strokeWidth={1.8} aria-hidden="true" />
              )}
              {label}
            </button>
          ))}
          <button className="admin-outline-button" type="button" onClick={onClose}>
            <X size={15} strokeWidth={1.8} aria-hidden="true" />
            Close Modal
          </button>
        </div>
      </motion.article>
    </div>
  );
}
