export const headerVarient = {
  hidden: {
    y: -100,
    opacity: 0.7,
  },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      type: "tween",
      delay: 0.1,
      duration: 0.5,

    }
  }
}

export const slideIn = (direction, type, delay, duration) => ({
  hidden: {
    x: direction === "left" ? "-100%" : direction === "right" ? "100%" : 0,
    y: direction === "up" ? "100%" : direction === "down" ? "100%" : 0,
  },
  show: {
    x: 0,
    y: 0,
    transition: {
      type,
      delay: 0.1,
      duration,
      ease: "easeOut",
    },
  },
});

export const staggerContainer = (staggerChildren, delayChildren) => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});



export const textVariant = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "tween",
      ease: "easeIn",
    },
  },
};

export const fadeIn = (direction, type, delay, duration) => ({
  hidden: {
    opacity: 0,
    x: (direction === "left" ? "-100" : direction === "right" ? "100" : 0),
    y: (direction === "up" ? "-100" : direction === "down" ? "100" : 0)

  },
  show: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      type,
      duration: 0.5,
      delay: 0.3,
      ease: "easeInOut"
    }
  }
})

export const zoomIn = (delay, duration) => ({
  hidden: {
    scale: 0,
    opacity: 0,
  },
  show: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "tween",
      delay: 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  },
});

export const footerVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 140,
    },
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      delay: 0.1,
    },
  },
};

export const staggerChildren = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.6,
    },
  },
};


export const getMenuStyles = (menuOpened) => {
  if (document.documentElement.clientWidth <= 991) {
    return { right: !menuOpened && "-100%" };
  }
};
