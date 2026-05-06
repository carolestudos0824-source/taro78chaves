import { Variants } from "framer-motion";

/**
 * Reusable motion presets for the Tarot 78 Chaves app.
 * Focuses on premium, elegant, and performance-optimized animations.
 */

export const portalReveal: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 10 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { 
      duration: 0.8, 
      ease: [0.22, 1, 0.36, 1] 
    }
  }
};

export const cardBreathe: Variants = {
  animate: {
    y: [0, -8, 0],
    rotateY: [0, 1, -1, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const auraAwaken: Variants = {
  off: { opacity: 0, scale: 0.8 },
  on: { 
    opacity: 0.6, 
    scale: 1,
    transition: { duration: 1.5, ease: "easeOut" }
  },
  pulse: {
    opacity: [0.4, 0.7, 0.4],
    scale: [1, 1.05, 1],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const keyPulse: Variants = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const unlockGlow: Variants = {
  animate: {
    boxShadow: [
      "0 0 0px rgba(200, 166, 106, 0)",
      "0 0 30px rgba(200, 166, 106, 0.6)",
      "0 0 0px rgba(200, 166, 106, 0)"
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const xpGain: Variants = {
  initial: { opacity: 0, y: 0, scale: 0.5 },
  animate: {
    opacity: [0, 1, 1, 0],
    y: -40,
    scale: [0.5, 1.2, 1],
    transition: { duration: 1.5, ease: "easeOut" }
  }
};

export const pageTransition: Variants = {
  initial: { opacity: 0, x: 10 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  },
  exit: { 
    opacity: 0, 
    x: -10,
    transition: { duration: 0.3, ease: "easeIn" }
  }
};
