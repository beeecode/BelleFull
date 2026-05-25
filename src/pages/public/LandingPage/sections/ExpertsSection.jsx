import { inspirationAssets } from '../../../../constants/inspirationAssets';
import { projectDetails } from '../../../../data/projectDetails';
import { SectionHeading } from '../../../../components/ui/SectionHeading';
import { AnimatedSection } from '../../../../components/common/AnimatedSection';

const experts = [
  {
    name: 'Pasta-focused favorites',
    role: 'Comforting pasta bowls and fast-food plates made for satisfying everyday meals.',
  },
  {
    name: 'Quick-service meals',
    role: 'Fresh updates, easy ordering, and dependable meals for pickup or delivery.',
  },
  {
    name: 'Local Osogbo kitchen',
    role: 'A locally operated food brand serving Osogbo with flavor and consistency.',
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
            <img src={inspirationAssets.chefs[index]} alt="" loading="lazy" />
            <h3>{expert.name}</h3>
            <p>{expert.role}</p>
            <span>{index === 0 ? 'Pasta' : index === 1 ? 'Fast' : 'Local'}</span>
          </article>
        ))}
      </div>
    </AnimatedSection>
  );
}
