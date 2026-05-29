import { Check, Package, Settings2, X } from 'lucide-react';
import { ORDER_STATUSES } from '../../../constants/orderContracts';

export const statusMeta = {
  [ORDER_STATUSES.PENDING_PAYMENT]: { label: 'PENDING PAYMENT', className: 'is-new', icon: Package },
  [ORDER_STATUSES.PAID]: { label: 'PAID', className: 'is-completed', icon: Check },
  [ORDER_STATUSES.PREPARING]: { label: 'PREPARING', className: 'is-new', icon: Settings2 },
  [ORDER_STATUSES.READY_FOR_PICKUP]: { label: 'READY FOR PICKUP', className: 'is-completed', icon: Check },
  [ORDER_STATUSES.OUT_FOR_DELIVERY]: { label: 'OUT FOR DELIVERY', className: 'is-new', icon: Package },
  [ORDER_STATUSES.COMPLETED]: { label: 'COMPLETED', className: 'is-completed', icon: Check },
  [ORDER_STATUSES.CANCELLED]: { label: 'CANCELLED', className: 'is-rejected', icon: X },
  [ORDER_STATUSES.FAILED_PAYMENT]: { label: 'FAILED PAYMENT', className: 'is-rejected', icon: X },
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
