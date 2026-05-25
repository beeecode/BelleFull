import { siteConfig } from '../../constants/siteConfig';
import logoImage from '../../assets/figma-inspiration/Amaxing logo.jpg';

export function Logo({ className = '' }) {
  return (
    <a className={`brand-logo ${className}`} href="#home" aria-label={`${siteConfig.restaurantName} home`}>
      <span className="brand-logo-mark">
        <img src={logoImage} alt="" />
      </span>
      <span className="brand-logo-copy">
        <strong>{siteConfig.brandName}</strong>
        <span>Delicacies</span>
      </span>
    </a>
  );
}
