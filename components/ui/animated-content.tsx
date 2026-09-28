"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedContentProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "vertical" | "horizontal";
  distance?: number;
  reverse?: boolean;
  scale?: number;
  threshold?: number;
}

/**
 * Adapted from React Bits' Animated Content pattern for Framer Motion.
 * Keeps the reveal in a small client boundary and respects reduced motion.
 */
export function AnimatedContent({
  children,
  className,
  delay = 0,
  direction = "vertical",
  distance = 20,
  reverse = false,
  scale = 0.985,
  threshold = 0.12,
}: AnimatedContentProps) {
  const reduceMotion = useReducedMotion();
  const offset = reverse ? -distance : distance;
  const initial = direction === "horizontal"
    ? { opacity: 0, x: offset, y: 0, scale }
    : { opacity: 0, x: 0, y: offset, scale };

  return (
    <motion.div
      className={cn(className)}
      initial={reduceMotion ? false : initial}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, amount: threshold }}
      transition={{ duration: 0.48, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
