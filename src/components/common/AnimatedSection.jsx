import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { sectionEntranceVariants, sectionTransition, sectionViewport } from '../../constants/motion';

const motionElements = {
  section: motion.section,
  footer: motion.footer,
};

export function AnimatedSection({ as = 'section', direction = 'fade', children, ...props }) {
  const prefersReducedMotion = useReducedMotion();
  const [isSmallViewport, setIsSmallViewport] = useState(() => (
    typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches
  ));
  const Component = motionElements[as] ?? motion.section;
  const StaticComponent = as;

  useEffect(() => {
    const query = window.matchMedia('(max-width: 768px)');
    const updateViewport = () => setIsSmallViewport(query.matches);

    updateViewport();
    if (query.addEventListener) {
      query.addEventListener('change', updateViewport);
    } else {
      query.addListener(updateViewport);
    }

    return () => {
      if (query.removeEventListener) {
        query.removeEventListener('change', updateViewport);
      } else {
        query.removeListener(updateViewport);
      }
    };
  }, []);

  if (prefersReducedMotion || isSmallViewport) {
    return <StaticComponent {...props}>{children}</StaticComponent>;
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
