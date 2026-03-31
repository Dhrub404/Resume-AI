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
  },
  // Award-winning weighted spring (high mass, high damping)
  premiumSpring: {
    type: "spring",
    damping: 30,
    stiffness: 240,
    mass: 1.2
  },
  // Bouncy elastic spring for icons
  elastic: {
    type: "spring",
    damping: 10,
    stiffness: 300
  },
  // Smooth wave transition (slower, fluid, premium)
  smoothWave: {
    type: "spring",
    damping: 20,
    stiffness: 120,
    mass: 0.8
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
      staggerChildren: 0.05, // Tighter stagger for "wave" feel
      delayChildren: 0.03
    }
  }
};

export const slideUpItem = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: TRANSITIONS.appleSpring }
};

export const scaleHover = {
  scale: 1.08,
  transition: TRANSITIONS.appleSpring
};

export const tapEffect = {
  scale: 0.95,
  transition: { type: "spring", damping: 15, stiffness: 400 }
};

export const waveCardVariants = {
  hidden: { 
    opacity: 0, 
    x: -60, 
    scale: 0.98, 
    filter: "blur(5px)",
  },
  show: { 
    opacity: 1, 
    x: 0, 
    scale: 1,
    filter: "blur(0px)",
    transition: TRANSITIONS.smoothWave
  },
  exit: { 
    opacity: 0, 
    x: 20, 
    filter: "blur(5px)",
    transition: { duration: 0.3, ease: "easeInOut" } 
  }
};

export const premiumCardVariants = {
  hidden: { 
    opacity: 0, 
    y: 40, 
    scale: 1.05, 
    filter: "blur(12px)",
  },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    filter: "blur(0px)",
    transition: TRANSITIONS.premiumSpring
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    filter: "blur(8px)",
    transition: { duration: 0.2, ease: "easeInOut" } 
  }
};

export const thumbnailHoverVariant = {
  hover: { 
    scale: 1.15,
    y: -5,
    transition: TRANSITIONS.appleSpring 
  }
};

export const waveContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Slower stagger for the "wave" feel
      delayChildren: 0.05
    }
  }
};
