"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export function ParallaxHeroImage({
  className,
  src,
  alt,
  sizes = "(min-width: 1024px) 55vw, 90vw",
  quality = 90,
  imageClassName = "object-contain drop-shadow-2xl",
  imageStyle,
}: {
  className?: string;
  src: string;
  alt: string;
  sizes?: string;
  quality?: number;
  imageClassName?: string;
  imageStyle?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const spring = { stiffness: 120, damping: 20, mass: 0.5 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), spring);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), spring);
  const fgX = useSpring(useTransform(x, [-0.5, 0.5], [-28, 28]), spring);
  const fgY = useSpring(useTransform(y, [-0.5, 0.5], [-28, 28]), spring);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1200 }}
      className={className}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative h-full w-full"
      >
        <motion.div style={{ x: fgX, y: fgY, translateZ: 40 }} className="absolute inset-0">
          <Image
            src={src}
            alt={alt}
            fill
            priority
            sizes={sizes}
            quality={quality}
            style={imageStyle}
            className={imageClassName}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
