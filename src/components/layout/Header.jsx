import { useEffect, useState } from 'react';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { siteConfig } from '../../constants/siteConfig';
import { Logo } from '../common/Logo';
import { Button } from '../ui/Button';

export function Header({
  cartCount = 0,
  cartHref = '/menu',
  orderHref = '#contact',
  showCart = false,
  onCartClick,
  onHomeClick,
  onMenuClick,
  onOrderClick,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    document.body.classList.toggle('menu-open', isOpen);

    return () => document.body.classList.remove('menu-open');
  }, [isOpen]);

  useEffect(() => {
    const updateHeaderState = () => {
      const nextIsScrolled = window.scrollY > 12;
      setIsScrolled((current) => (current === nextIsScrolled ? current : nextIsScrolled));
    };

    updateHeaderState();
    window.addEventListener('scroll', updateHeaderState, { passive: true });

    return () => window.removeEventListener('scroll', updateHeaderState);
  }, []);

  return (
    <header className={`site-header ${isScrolled ? 'is-scrolled' : ''}`}>
      <div className="header-inner">
        <Logo
          ariaLabel="Go to homepage"
          onClick={(event) => {
            closeMenu();
            onHomeClick?.(event);
          }}
        />

        <nav className={`site-nav ${isOpen ? 'is-open' : ''}`} aria-label="Primary navigation">
          {siteConfig.navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(event) => {
                closeMenu();
                if (item.href === '/menu') onMenuClick?.(event);
              }}
            >
              {item.label}
            </a>
          ))}
          <a className="mobile-order-link" href={orderHref} onClick={(event) => { closeMenu(); onOrderClick?.(event); }}>
            Order now
          </a>
        </nav>

        <div className="header-actions">
          {showCart ? (
            <a className="cart-link" href={cartHref} aria-label={`View cart, ${cartCount} item${cartCount === 1 ? '' : 's'}`} onClick={onCartClick}>
              <ShoppingBag size={19} />
              <span>{cartCount}</span>
            </a>
          ) : null}
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
