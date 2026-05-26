import { inspirationAssets } from '../../../../constants/inspirationAssets';
import { projectDetails } from '../../../../data/projectDetails';
import { SectionHeading } from '../../../../components/ui/SectionHeading';
import { AnimatedSection } from '../../../../components/common/AnimatedSection';

const experts = [
  {
    name: 'Freshly Made Everyday Meals',
    role: 'Amazing Taste Delicacies serves satisfying everyday meals prepared with care, flavor, and consistency.',
    badge: 'Made with care',
  },
  {
    name: 'Fast, Simple Food Service',
    role: 'From quick ordering to dependable delivery or pickup, we make getting good food easy and convenient.',
    badge: 'Quick service',
  },
  {
    name: 'A Trusted Osogbo Food Brand',
    role: 'We are a locally loved restaurant in Osogbo known for delicious meals, reliable service, and customer satisfaction.',
    badge: 'Local favorite',
  },
];

export function ExpertsSection() {
  return (
    <AnimatedSection id="chef" className="experts-section" direction="right">
      <SectionHeading title={projectDetails.preservedCopy.chef.headline} />
      <p className="experts-copy">{projectDetails.preservedCopy.chef.body}</p>
      <div className="experts-grid">
        {experts.map((expert, index) => (
          <article className="expert-card" key={expert.name}>
            <img src={inspirationAssets.chefs[index]} alt="" loading="lazy" decoding="async" />
            <h3>{expert.name}</h3>
            <p>{expert.role}</p>
            <span className="expert-card-badge">{expert.badge}</span>
          </article>
        ))}
      </div>
    </AnimatedSection>
  );
}
