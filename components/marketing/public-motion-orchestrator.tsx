"use client";

import type { ReactNode } from "react";
import { stagger, useAnimate, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

export function PublicMotionOrchestrator({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [scope, animate] = useAnimate();

  useLayoutEffect(() => {
    const root = scope.current as HTMLElement | null;
    if (!root || reduceMotion) return;

    const sections = Array.from(root.querySelectorAll("section")) as HTMLElement[];
    const observers: IntersectionObserver[] = [];

    for (const section of sections) {
      section.style.opacity = "0";
      section.style.transform = "translateY(20px) scale(0.992)";

      const cards = Array.from(section.querySelectorAll("article")) as HTMLElement[];
      for (const card of cards) {
        card.style.opacity = "0";
        card.style.transform = "translateY(14px)";
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;

          void animate(
            section,
            { opacity: 1, y: 0, scale: 1 },
            { duration: 0.58, ease: [0.22, 1, 0.36, 1] },
          );

          if (cards.length > 0) {
            void animate(
              cards,
              { opacity: 1, y: 0 },
              {
                delay: stagger(0.055, { startDelay: 0.08 }),
                duration: 0.42,
                ease: [0.22, 1, 0.36, 1],
              },
            );
          }

          observer.disconnect();
        },
        { threshold: 0.03, rootMargin: "0px 0px 8%" },
      );

      observer.observe(section);
      observers.push(observer);
    }

    return () => {
      for (const observer of observers) observer.disconnect();
    };
  }, [animate, pathname, reduceMotion, scope]);

  return <div ref={scope}>{children}</div>;
}
