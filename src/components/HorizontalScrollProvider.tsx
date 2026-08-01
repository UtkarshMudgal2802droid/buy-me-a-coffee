"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function HorizontalScrollProvider({ children }: { children: React.ReactNode }) {
  const targetRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress within the 400vh container
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Map 0 -> 1 vertical scroll to 0% -> -75% horizontal movement
  // -75% because we have 4 sections that each take 100vw, so the container is 400vw wide.
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

  return (
    <section ref={targetRef} className="relative h-[400vh] bg-[#0a0a0a]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div style={{ x }} className="flex w-[400vw]">
          {children}
        </motion.div>
      </div>
    </section>
  );
}
