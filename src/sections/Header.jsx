import { useState } from 'react';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { siteConfig } from '../constants/siteConfig';
import { Logo } from '../components/Logo';
import { Button } from '../components/Button';

export function Header({
  cartCount = 0,
  cartHref = '#menu',
  orderHref = '#contact',
  onCartClick,
  onOrderClick,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Logo />

        <nav className={`site-nav ${isOpen ? 'is-open' : ''}`} aria-label="Primary navigation">
          {siteConfig.navigation.map((item) => (
            <a key={item.href} href={item.href} onClick={closeMenu}>
              {item.label}
            </a>
          ))}
          <a className="mobile-order-link" href={orderHref} onClick={(event) => { closeMenu(); onOrderClick?.(event); }}>
            Order now
          </a>
        </nav>

        <div className="header-actions">
          <a className="cart-link" href={cartHref} aria-label="View menu" onClick={onCartClick}>
            <ShoppingBag size={19} />
            <span>{cartCount}</span>
          </a>
          <Button as="a" href={orderHref} variant="gold" className="header-cta" onClick={onOrderClick}>
            Order now
          </Button>
          <button
            className="menu-toggle"
            type="button"
            aria-expanded={isOpen}
            aria-label="Toggle navigation"
            onClick={() => setIsOpen((current) => !current)}
          >
            {isOpen ? <X size={25} /> : <Menu size={25} />}
          </button>
        </div>
      </div>
    </header>
  );
}
