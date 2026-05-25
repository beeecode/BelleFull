import { Check, Package, Settings2, X } from 'lucide-react';

export const statusMeta = {
  new: { label: 'NEW', className: 'is-new', icon: Package },
  accepted: { label: 'ACCEPTED', className: 'is-completed', icon: Check },
  preparing: { label: 'PREPARING', className: 'is-new', icon: Settings2 },
  ready: { label: 'READY', className: 'is-completed', icon: Check },
  completed: { label: 'COMPLETED', className: 'is-completed', icon: Check },
  cancelled: { label: 'CANCELLED', className: 'is-rejected', icon: X },
};

export function OrderStatus({ status }) {
  const meta = statusMeta[status] ?? statusMeta.new;
  const Icon = meta.icon;
  return (
    <span className={`admin-status-pill ${meta.className}`}>
      <Icon size={18} strokeWidth={1.5} aria-hidden="true" />
      <span>{meta.label}</span>
    </span>
  );
}
