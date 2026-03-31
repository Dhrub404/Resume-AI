export const TRANSITIONS = {
  // Apple's signature fluid spring (fast snap, gentle settle)
  appleSpring: {
    type: "spring",
    damping: 24,
    stiffness: 280,
    mass: 0.8
  },
  // Apple's signature smooth ease (custom cubic-bezier)
  appleSmooth: {
    type: "tween",
    ease: [0.32, 0.72, 0, 1],
    duration: 0.4
  }
};

export const pageTransition = {
  // Sweeping emerge from the left side (sidebar origin effect)
  initial: { opacity: 0, scale: 0.98, x: -30, filter: "blur(8px)" },
  animate: { opacity: 1, scale: 1, x: 0, filter: "blur(0px)" },
  exit: { opacity: 0, scale: 0.98, x: -20, filter: "blur(4px)" },
  transition: TRANSITIONS.appleSmooth
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

export const slideUpItem = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: TRANSITIONS.appleSpring }
};

export const scaleHover = {
  scale: 1.02,
  transition: TRANSITIONS.appleSpring
};

export const tapEffect = {
  scale: 0.97,
  transition: { type: "spring", damping: 15, stiffness: 400 }
};
