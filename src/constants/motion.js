export const sectionEntranceVariants = {
  hidden: (direction = 'fade') => {
    const distance = 42;

    return {
      opacity: 0,
      x: direction === 'left' ? -distance : direction === 'right' ? distance : 0,
      y: direction === 'fade' ? 24 : 0,
    };
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
  },
};

export const sectionTransition = {
  duration: 0.82,
  ease: [0.22, 1, 0.36, 1],
};

export const sectionViewport = {
  once: true,
  amount: 0.18,
  margin: '0px 0px -8% 0px',
};
