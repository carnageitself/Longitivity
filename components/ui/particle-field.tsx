"use client";

import Image from "next/image";
import { motion, useSpring, useTransform, type MotionValue } from "framer-motion";

const SOURCE_SIZE = 1254;

const PARTICLES = [
  { file: "particle-01.png", x: 20, y: 650, w: 228, h: 224 },
  { file: "particle-02.png", x: 224, y: 962, w: 188, h: 223 },
  { file: "particle-03.png", x: 881, y: 40, w: 201, h: 193 },
  { file: "particle-04.png", x: 1068, y: 1019, w: 186, h: 191 },
  { file: "particle-05.png", x: 604, y: 1001, w: 191, h: 186 },
  { file: "particle-06.png", x: 577, y: 9, w: 188, h: 167 },
  { file: "particle-07.png", x: 970, y: 353, w: 76, h: 68 },
  { file: "particle-08.png", x: 521, y: 1042, w: 52, h: 48 },
  { file: "particle-09.png", x: 831, y: 1028, w: 41, h: 47 },
  { file: "particle-10.png", x: 50, y: 1085, w: 45, h: 43 },
  { file: "particle-11.png", x: 1165, y: 242, w: 33, h: 42 },
  { file: "particle-12.png", x: 244, y: 174, w: 33, h: 32 },
  { file: "particle-13.png", x: 326, y: 53, w: 36, h: 33 },
  { file: "particle-14.png", x: 1025, y: 1144, w: 32, h: 32 },
  { file: "particle-15.png", x: 780, y: 981, w: 30, h: 32 },
  { file: "particle-16.png", x: 993, y: 272, w: 31, h: 30 },
  { file: "particle-17.png", x: 842, y: 132, w: 32, h: 31 },
  { file: "particle-18.png", x: 1084, y: 142, w: 30, h: 29 },
  { file: "particle-19.png", x: 664, y: 180, w: 30, h: 30 },
  { file: "particle-20.png", x: 1094, y: 196, w: 30, h: 30 },
  { file: "particle-21.png", x: 1089, y: 283, w: 31, h: 31 },
  { file: "particle-22.png", x: 1104, y: 94, w: 29, h: 29 },
  { file: "particle-23.png", x: 855, y: 101, w: 30, h: 32 },
  { file: "particle-24.png", x: 831, y: 63, w: 30, h: 30 },
  { file: "particle-25.png", x: 1080, y: 92, w: 30, h: 32 },
  { file: "particle-26.png", x: 936, y: 231, w: 31, h: 31 },
  { file: "particle-27.png", x: 1180, y: 473, w: 31, h: 29 },
  { file: "particle-28.png", x: 809, y: 255, w: 30, h: 30 },
  { file: "particle-29.png", x: 1020, y: 975, w: 31, h: 30 },
  { file: "particle-30.png", x: 1047, y: 1028, w: 31, h: 30 },
  { file: "particle-31.png", x: 1008, y: 1083, w: 32, h: 29 },
  { file: "particle-32.png", x: 1126, y: 427, w: 30, h: 30 },
  { file: "particle-33.png", x: 957, y: 1147, w: 29, h: 31 },
  { file: "particle-34.png", x: 776, y: 179, w: 30, h: 30 },
  { file: "particle-35.png", x: 618, y: 215, w: 30, h: 30 },
  { file: "particle-36.png", x: 498, y: 47, w: 29, h: 30 },
  { file: "particle-37.png", x: 1194, y: 191, w: 31, h: 29 },
  { file: "particle-38.png", x: 773, y: 46, w: 31, h: 29 },
  { file: "particle-39.png", x: 434, y: 179, w: 31, h: 29 },
  { file: "particle-40.png", x: 808, y: 159, w: 30, h: 30 },
  { file: "particle-41.png", x: 941, y: 285, w: 30, h: 30 },
  { file: "particle-42.png", x: 811, y: 1160, w: 29, h: 30 },
  { file: "particle-43.png", x: 1113, y: 28, w: 29, h: 29 },
  { file: "particle-44.png", x: 534, y: 53, w: 29, h: 30 },
  { file: "particle-45.png", x: 1218, y: 68, w: 29, h: 30 },
  { file: "particle-46.png", x: 875, y: 1131, w: 29, h: 29 },
  { file: "particle-47.png", x: 901, y: 405, w: 29, h: 30 },
  { file: "particle-48.png", x: 962, y: 418, w: 29, h: 29 },
  { file: "particle-49.png", x: 1142, y: 135, w: 29, h: 29 },
  { file: "particle-50.png", x: 261, y: 663, w: 31, h: 22 },
  { file: "particle-51.png", x: 709, y: 312, w: 23, h: 24 },
  { file: "particle-52.png", x: 1086, y: 390, w: 31, h: 37 },
];

const BOTTLES = [
  { file: "bottle-2.png", x: 137, y: 120, w: 505, h: 599, depth: 10 },
  { file: "bottle-1.png", x: 626, y: 435, w: 499, h: 583, depth: 20 },
];

// Deterministic pseudo-random in [0, 1), seeded by index so the layout is
// stable across renders/SSR instead of reshuffling on every load.
function seeded(seed: number) {
  const v = Math.sin(seed * 12.9898) * 43758.5453;
  return v - Math.floor(v);
}

function FloatingSprite({
  file,
  left,
  top,
  width,
  height,
  depth,
  scrollDepth,
  index,
  x,
  y,
  scrollYProgress,
  sizes,
}: {
  file: string;
  left: number;
  top: number;
  width: number;
  height: number;
  depth: number;
  scrollDepth: number;
  index: number;
  x: MotionValue<number>;
  y: MotionValue<number>;
  scrollYProgress: MotionValue<number>;
  sizes: string;
}) {
  const mouseX = useSpring(useTransform(x, [-0.5, 0.5], [-depth, depth]), {
    stiffness: 90 + seeded(index) * 40,
    damping: 18 + seeded(index + 500) * 8,
    mass: 0.5,
  });
  const mouseY = useSpring(useTransform(y, [-0.5, 0.5], [-depth, depth]), {
    stiffness: 90 + seeded(index + 1000) * 40,
    damping: 18 + seeded(index + 1500) * 8,
    mass: 0.5,
  });

  // Distant/small elements drift further as the story scrolls past, like
  // debris receding at different rates instead of one flat background. Eased
  // (not linear) so the drift has a bit of glide to it, and each particle
  // wanders slightly off-axis instead of every one sliding straight up.
  // (scrollDepth is 0 for elements that shouldn't react to scroll, making this a no-op.)
  const driftSign = seeded(index + 5000) > 0.5 ? 1 : -1;
  const scrollDriftY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0, -scrollDepth * 0.65, -scrollDepth]
  );
  const scrollDriftX = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0, driftSign * scrollDepth * 0.18, driftSign * scrollDepth * 0.32]
  );
  const finalY = useTransform([mouseY, scrollDriftY], (latest: number[]) => latest[0] + latest[1]);
  const finalX = useTransform([mouseX, scrollDriftX], (latest: number[]) => latest[0] + latest[1]);

  const floatDuration = 5 + seeded(index + 2000) * 6;
  const floatDelay = seeded(index + 2500) * 4;
  const floatDistance = 4 + seeded(index + 3000) * 10;
  const rotateRange = 3 + seeded(index + 3500) * 10;
  const rotateDirection = seeded(index + 4000) > 0.5 ? 1 : -1;

  return (
    <motion.div
      style={{
        position: "absolute",
        left: `${left}%`,
        top: `${top}%`,
        width: `${width}%`,
        height: `${height}%`,
        x: finalX,
        y: finalY,
      }}
    >
      <motion.div
        animate={{
          y: [0, -floatDistance, 0],
          rotate: [
            -rotateRange * rotateDirection,
            rotateRange * rotateDirection,
            -rotateRange * rotateDirection,
          ],
        }}
        transition={{
          duration: floatDuration,
          delay: floatDelay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative h-full w-full"
      >
        <Image src={`/particles/${file}`} alt="" fill sizes={sizes} className="object-contain" />
      </motion.div>
    </motion.div>
  );
}

export function ParticleField({
  x,
  y,
  scrollYProgress,
  className,
}: {
  x: MotionValue<number>;
  y: MotionValue<number>;
  scrollYProgress: MotionValue<number>;
  className?: string;
}) {
  return (
    <div className={className}>
      {PARTICLES.map((particle, index) => {
        const size = Math.sqrt(particle.w * particle.h);
        // 0 = smallest sparkle, 1 = largest pinecone/snowflake.
        const sizeT = Math.min(1, Math.max(0, (size - 24) / (220 - 24)));
        return (
          <FloatingSprite
            key={particle.file}
            file={particle.file}
            left={(particle.x / SOURCE_SIZE) * 100}
            top={(particle.y / SOURCE_SIZE) * 100}
            width={(particle.w / SOURCE_SIZE) * 100}
            height={(particle.h / SOURCE_SIZE) * 100}
            // Bigger elements read as closer, so they drift further with the cursor.
            depth={8 + sizeT * 34}
            scrollDepth={70 + sizeT * 220}
            index={index}
            x={x}
            y={y}
            scrollYProgress={scrollYProgress}
            sizes="140px"
          />
        );
      })}
    </div>
  );
}

export function HeroBottles({
  x,
  y,
  scrollYProgress,
}: {
  x: MotionValue<number>;
  y: MotionValue<number>;
  scrollYProgress: MotionValue<number>;
}) {
  return (
    <>
      {BOTTLES.map((bottle, index) => (
        <FloatingSprite
          key={bottle.file}
          file={bottle.file}
          left={(bottle.x / SOURCE_SIZE) * 100}
          top={(bottle.y / SOURCE_SIZE) * 100}
          width={(bottle.w / SOURCE_SIZE) * 100}
          height={(bottle.h / SOURCE_SIZE) * 100}
          depth={bottle.depth}
          scrollDepth={0}
          scrollYProgress={scrollYProgress}
          index={index}
          x={x}
          y={y}
          sizes="(min-width: 1024px) 340px, 60vw"
        />
      ))}
    </>
  );
}
