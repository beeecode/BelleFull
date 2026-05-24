export function SectionHeading({ eyebrow, title, align = 'center', className = '' }) {
  return (
    <div className={`section-heading section-heading-${align} ${className}`}>
      {eyebrow ? <p className="section-eyebrow">{eyebrow}</p> : null}
      <h2>{title}</h2>
      <span aria-hidden="true" />
    </div>
  );
}
