import { motion } from 'framer-motion';
import { Home, Package, History, Mail, SlidersHorizontal, LogOut, Menu, X } from 'lucide-react';
import { Logo } from '../../../components/common/Logo';
import { siteConfig } from '../../../constants/siteConfig';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'history', label: 'Order History', icon: History },
  { id: 'messages', label: 'Messages', icon: Mail },
  { id: 'products', label: 'Products / Menu', icon: Package },
  { id: 'settings', label: 'Settings', icon: SlidersHorizontal },
];

const pageVariants = {
  visible: { opacity: 1, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.04 } },
};

export default function AdminShell({ children, activePage, onPageChange, sidebarOpen, setSidebarOpen, onLogout }) {
  return (
    <main className="admin-page" aria-label={`${siteConfig.restaurantName} admin dashboard`}>
      <motion.div className="admin-dashboard" variants={pageVariants} initial="visible" animate="visible">
        <button
          className="admin-mobile-toggle"
          type="button"
          aria-label={sidebarOpen ? 'Close admin menu' : 'Open admin menu'}
          aria-expanded={sidebarOpen}
          onClick={() => setSidebarOpen((isOpen) => !isOpen)}
        >
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <button
          className={`admin-sidebar-backdrop${sidebarOpen ? ' is-open' : ''}`}
          type="button"
          aria-label="Close admin menu"
          onClick={() => setSidebarOpen(false)}
        />
        <aside className={`admin-sidebar${sidebarOpen ? ' is-open' : ''}`}>
          <Logo className="admin-brand-logo" />
          <nav className="admin-sidebar-nav" aria-label="Admin navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  className={`admin-sidebar-link${activePage === item.id ? ' is-active' : ''}`}
                  type="button"
                  key={item.id}
                  onClick={() => {
                    onPageChange(item.id);
                    setSidebarOpen(false);
                  }}
                >
                  <Icon size={23} strokeWidth={1.7} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
          <button className="admin-sidebar-link admin-logout" type="button" onClick={onLogout}>
            <LogOut size={24} strokeWidth={1.6} />
            <span>Logout</span>
          </button>
        </aside>
        <section className="admin-main-content">{children}</section>
      </motion.div>
    </main>
  );
}
export { navItems };
