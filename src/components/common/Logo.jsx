import { siteConfig } from '../../constants/siteConfig';
import logoImage from '../../assets/figma-inspiration/Amaxing logo.jpg';

export function Logo({
  ariaLabel = 'Go to homepage',
  className = '',
  href = '/',
  onClick,
}) {
  return (
    <a className={`brand-logo ${className}`} href={href} aria-label={ariaLabel} onClick={onClick}>
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
