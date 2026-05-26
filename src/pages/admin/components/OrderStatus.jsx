import { Check, Package, Settings2, X } from 'lucide-react';

export const statusMeta = {
  pending_payment: { label: 'PENDING PAYMENT', className: 'is-new', icon: Package },
  paid: { label: 'PAID', className: 'is-completed', icon: Check },
  preparing: { label: 'PREPARING', className: 'is-new', icon: Settings2 },
  ready_for_pickup: { label: 'READY FOR PICKUP', className: 'is-completed', icon: Check },
  out_for_delivery: { label: 'OUT FOR DELIVERY', className: 'is-new', icon: Package },
  completed: { label: 'COMPLETED', className: 'is-completed', icon: Check },
  cancelled: { label: 'CANCELLED', className: 'is-rejected', icon: X },
  failed_payment: { label: 'FAILED PAYMENT', className: 'is-rejected', icon: X },
};

export function OrderStatus({ status }) {
  const meta = statusMeta[status] ?? statusMeta.pending_payment;
  const Icon = meta.icon;
  return (
    <span className={`admin-status-pill ${meta.className}`}>
      <Icon size={18} strokeWidth={1.5} aria-hidden="true" />
      <span>{meta.label}</span>
    </span>
  );
}
