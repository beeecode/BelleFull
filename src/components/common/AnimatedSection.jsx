import { motion, useReducedMotion } from 'framer-motion';
import { sectionEntranceVariants, sectionTransition, sectionViewport } from '../../constants/motion';

const motionElements = {
  section: motion.section,
  footer: motion.footer,
};

export function AnimatedSection({ as = 'section', direction = 'fade', children, ...props }) {
  const prefersReducedMotion = useReducedMotion();
  const Component = motionElements[as] ?? motion.section;

  if (prefersReducedMotion) {
    return <Component {...props}>{children}</Component>;
  }

  return (
    <Component
      {...props}
      custom={direction}
      initial="hidden"
      whileInView="visible"
      variants={sectionEntranceVariants}
      transition={sectionTransition}
      viewport={sectionViewport}
    >
      {children}
    </Component>
  );
}
