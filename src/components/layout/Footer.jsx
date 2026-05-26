import {
  ChefHat,
  Flame,
  Handshake,
  Info,
  Mail,
  MapPin,
  Send,
  ShoppingBag,
  Star,
  Truck,
  Utensils,
} from 'lucide-react';
import { inspirationAssets } from '../../constants/inspirationAssets';
import { siteConfig } from '../../constants/siteConfig';
import { menuItems } from '../../data/menuItems';
import { projectDetails } from '../../data/projectDetails';
import { Logo } from '../common/Logo';
import { Button } from '../ui/Button';
import { InstagramMark } from '../ui/InstagramMark';
import { AnimatedSection } from '../common/AnimatedSection';
import { getMapsUrl } from '../../utils/contactLinks';

const navigationIcons = {
  '/menu': Utensils,
  '/#chef': ChefHat,
  '/#reviews': Star,
  '/#contact': Mail,
};

const favoriteIcons = [Utensils, ChefHat, Flame, ShoppingBag];

const contactIcons = {
  Orders: ShoppingBag,
  Delivery: Truck,
  Partnerships: Handshake,
};

export function Footer() {
  return (
    <AnimatedSection as="footer" id="contact" className="footer" direction="fade">
      <img className="footer-left" src={inspirationAssets.footerLeft} alt="" loading="lazy" decoding="async" />
      <img className="footer-right" src={inspirationAssets.footerRight} alt="" loading="lazy" decoding="async" />
      <div className="footer-inner">
        <div className="footer-feature">
          <Logo />
          <p>{projectDetails.description}</p>
          <a className="footer-address" href={getMapsUrl(siteConfig.contact.address)} target="_blank" rel="noreferrer">
            <MapPin size={18} aria-hidden="true" />
            <span>{siteConfig.contact.address}</span>
          </a>
          <div className="footer-contact-list">
            <strong>Contact</strong>
            {siteConfig.openingHours.map((item) => {
              const Icon = contactIcons[item.days] ?? Info;

              return (
                <span className="footer-contact-row" key={item.days}>
                  <Icon size={16} aria-hidden="true" />
                  <span>
                    {item.days}: {item.hours}
                  </span>
                </span>
              );
            })}
          </div>
        </div>

        <div className="footer-column">
          <h2>Menu</h2>
          {siteConfig.navigation.map((item) => {
            const Icon = navigationIcons[item.href] ?? Info;

            return (
              <a key={item.href} href={item.href}>
                <Icon size={18} aria-hidden="true" />
                <span>{item.label}</span>
              </a>
            );
          })}
        </div>

        <div className="footer-column">
          <h2>Favorites</h2>
          {menuItems.map((item, index) => {
            const Icon = favoriteIcons[index % favoriteIcons.length];

            return (
              <a key={item.id} href="/menu">
                <Icon size={18} aria-hidden="true" />
                <span>{item.name}</span>
              </a>
            );
          })}
        </div>

        <form className="footer-newsletter" onSubmit={(event) => event.preventDefault()}>
          <h2>Updates</h2>
          <p className="footer-update-copy">
            <InstagramMark />
            <span>{projectDetails.preservedCopy.newsletter.headline}</span>
          </p>
          <label className="footer-input-wrap">
            <Mail size={20} aria-hidden="true" />
            <input
              type="email"
              placeholder={projectDetails.preservedCopy.newsletter.emailPlaceholder}
              aria-label="Email address"
            />
          </label>
          <Button variant="primary" type="submit">
            <span>{projectDetails.preservedCopy.newsletter.buttonLabel}</span>
            <Send size={18} aria-hidden="true" />
          </Button>
        </form>
      </div>

      <div className="footer-bottom">
        <p>&copy; {projectDetails.preservedCopy.footer.copyright}</p>
        <div>
          {siteConfig.contact.socialLinks.map((item) => (
            <a key={item.platform} href={item.url}>
              {item.platform === 'Instagram' ? <InstagramMark /> : null}
              <span>{item.platform}</span>
            </a>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
