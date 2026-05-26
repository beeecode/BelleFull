import logoImage from '../../assets/figma-inspiration/Amaxing logo.jpg';

export function LogoLoader({ text = 'Preparing your experience...', compact = false }) {
  return (
    <div className={`logo-loader ${compact ? 'logo-loader-compact' : ''}`} role="status" aria-live="polite">
      <span className="logo-loader-mark" aria-hidden="true">
        <img src={logoImage} alt="" />
      </span>
      {text ? <p>{text}</p> : null}
    </div>
  );
}
