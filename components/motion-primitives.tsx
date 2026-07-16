"use client";

import { motion, type Variants } from "motion/react";

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

export function PageMotion({ children, className }: { children: React.ReactNode; className?: string }) {
  return <motion.div variants={container} initial="hidden" animate="show" className={className}>{children}</motion.div>;
}

export function Reveal({ children, className }: { children: React.ReactNode; className?: string }) {
  return <motion.div variants={item} className={className}>{children}</motion.div>;
}

export function HoverLift({ children, className }: { children: React.ReactNode; className?: string }) {
  return <motion.div whileHover={{ y: -5 }} whileTap={{ scale: 0.99 }} transition={{ type: "spring", stiffness: 350, damping: 25 }} className={className}>{children}</motion.div>;
}
