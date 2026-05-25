import { projectDetails } from '../../data/projectDetails';

const illustrationItems = [
  { className: 'figma-bg-hero-left', src: projectDetails.visualAssets.heroLeafLeft },
  { className: 'figma-bg-hero-right', src: projectDetails.visualAssets.heroLeafRight },
  { className: 'figma-bg-hero-lower', src: projectDetails.visualAssets.heroLeafLower },
  { className: 'figma-bg-menu-left', src: projectDetails.visualAssets.specialLeafLeft },
  { className: 'figma-bg-menu-right', src: projectDetails.visualAssets.specialLeafRight },
  { className: 'figma-bg-menu-lower', src: projectDetails.visualAssets.specialLeafLower },
  { className: 'figma-bg-kitchen-right', src: projectDetails.visualAssets.welcomeLeafRight },
  { className: 'figma-bg-chef-left', src: projectDetails.visualAssets.chefLeaf },
  { className: 'figma-bg-review-pan', src: projectDetails.visualAssets.customerPan },
];

export function FigmaBackgroundIllustrations() {
  return (
    <div className="figma-bg-layer" aria-hidden="true">
      {illustrationItems.map((item) => (
        <img className={`figma-bg-illustration ${item.className}`} src={item.src} alt="" key={item.className} loading="lazy" />
      ))}
    </div>
  );
}
