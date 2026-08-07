"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Product3DVisual({
  src,
  alt,
  width,
  height,
  glow = "bg-accent/20",
  floatDuration = 6,
  tiltRange = 7,
  delay = 0,
  className = "",
  imgClassName = "",
  priority = false,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  glow?: string;
  floatDuration?: number;
  tiltRange?: number;
  delay?: number;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
}) {
  return (
    <div className={`relative ${className}`} style={{ width, perspective: 1200 }}>
      <div aria-hidden className={`absolute inset-4 -z-10 rounded-full blur-3xl ${glow}`} />

      <motion.div
        style={{ transformStyle: "preserve-3d" }}
        animate={{
          y: [0, -16, 0],
          rotateY: [-tiltRange, tiltRange, -tiltRange],
          rotateX: [tiltRange / 2, -tiltRange / 2, tiltRange / 2],
        }}
        transition={{ duration: floatDuration, repeat: Infinity, ease: "easeInOut", delay }}
        whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
        className="relative"
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          sizes={`${width}px`}
          className={`h-auto w-full drop-shadow-[0_30px_30px_rgba(0,0,0,0.55)] ${imgClassName}`}
        />
      </motion.div>

      <motion.div
        aria-hidden
        animate={{ opacity: [0.4, 0.15, 0.4], scaleX: [1, 0.8, 1] }}
        transition={{ duration: floatDuration, repeat: Infinity, ease: "easeInOut", delay }}
        className="absolute bottom-2 left-1/2 h-3 w-2/3 -translate-x-1/2 rounded-full bg-black blur-md"
      />
    </div>
  );
}
