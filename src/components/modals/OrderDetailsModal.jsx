import { motion } from 'framer-motion';
import { X, CheckCircle2, ChefHat, MessageSquare, Truck, XCircle } from 'lucide-react';
import { OrderStatus, statusMeta } from '../../pages/admin/components/OrderStatus';
import { formatPrice } from '../../utils/formatPrice';
import { getWhatsAppUrl } from '../../utils/contactLinks';

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

  const canUpdatePreparation = order.payment_status === 'paid';
  const actions = [
    ['Start Preparing', 'preparing'],
    [order.deliveryMethod === 'Delivery' ? 'Out for Delivery' : 'Ready for Pickup', order.deliveryMethod === 'Delivery' ? 'out_for_delivery' : 'ready_for_pickup'],
    ['Mark as Completed', 'completed'],
    ['Cancel Order', 'cancelled'],
  ];
  const whatsappMessage =
    `Hello ${order.customer.name}, your order ${order.id} from Amazing Taste Delicacies is currently ${statusMeta[order.order_status]?.label || order.order_status}.`;

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
          <OrderStatus status={order.order_status} />
        </header>
        <section className="admin-details-grid">
          <div className="admin-detail-panel">
            <h3>Customer Details</h3>
            <DetailRow label="Name" value={order.customer.name} />
            <DetailRow label="Phone" value={order.customer.phone} />
            <DetailRow label="Email" value={order.customer.email} />
            <DetailRow label="Address" value={order.deliveryMethod === 'Delivery' ? order.customer.address : 'Pickup'} />
          </div>
          <div className="admin-detail-panel">
            <h3>Timing & Payment</h3>
            <DetailRow label="Order type" value={order.orderType} />
            <DetailRow label="Meal period" value={order.mealPeriod} />
            <DetailRow label="Scheduled date" value={order.scheduledDate} />
            <DetailRow label="Scheduled time" value={order.scheduledTime} />
            <DetailRow label="Payment method" value={order.paymentMethod} />
            <DetailRow label="Payment status" value={order.paymentStatus} />
            <DetailRow label="Payment reference" value={order.paymentReference} />
            <DetailRow label="Current status" value={statusMeta[order.order_status]?.label} />
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
        {!canUpdatePreparation ? (
          <p className="admin-payment-note">
            Preparation updates are locked until payment is confirmed.
          </p>
        ) : null}
        <div className="admin-detail-actions">
          {actions.map(([label, status]) => (
            <button
              className={status === 'cancelled' ? 'admin-outline-danger' : 'admin-primary-button'}
              type="button"
              key={status}
              disabled={!canUpdatePreparation && status !== 'cancelled'}
              onClick={() => {
                onStatusChange(order.id, status);
                onClose();
              }}
            >
              {status === 'cancelled' ? (
                <XCircle size={15} strokeWidth={1.8} aria-hidden="true" />
              ) : status === 'preparing' ? (
                <ChefHat size={15} strokeWidth={1.8} aria-hidden="true" />
              ) : status === 'out_for_delivery' ? (
                <Truck size={15} strokeWidth={1.8} aria-hidden="true" />
              ) : (
                <CheckCircle2 size={15} strokeWidth={1.8} aria-hidden="true" />
              )}
              {label}
            </button>
          ))}
          <a className="admin-primary-button" href={getWhatsAppUrl(whatsappMessage, order.customer.phone)} target="_blank" rel="noreferrer">
            <MessageSquare size={15} strokeWidth={1.8} aria-hidden="true" />
            WhatsApp Customer
          </a>
          <button className="admin-outline-button" type="button" onClick={onClose}>
            <X size={15} strokeWidth={1.8} aria-hidden="true" />
            Close Modal
          </button>
        </div>
      </motion.article>
    </div>
  );
}
