"use client";

import { motion } from "framer-motion";
import { Clock, DollarSign, Users, Coins, Equal } from "lucide-react";

// Geometry for the 4-blade pinwheel. Each blade fills exactly one compass
// quadrant (NW/NE/SE/SW) so that its color lines up with the corner callout
// that sits in that same quadrant — the seams sit at N/E/S/W, not on the
// diagonals, so a color never straddles the boundary a callout points at.
// The two edges of each wedge are identical cubic-bezier "seam" curves
// (rotations of one another) that bow in the clockwise tangential
// direction, which is what gives the shape its pinwheel twist instead of
// looking like a plain pie slice.
const R = 300; // outer radius
const RADIUS_HOLE = 65; // inner hole radius
const K1 = 140; // bow strength near the outer edge
const K2 = 25; // bow strength near the inner hole

type Pt = { x: number; y: number };
const round = (n: number) => Math.round(n * 10) / 10;

function pt(angleDeg: number, radius: number): Pt {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: round(radius * Math.sin(rad)), y: round(-radius * Math.cos(rad)) };
}

function tangent(angleDeg: number): Pt {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: Math.cos(rad), y: Math.sin(rad) };
}

const SEAMS = [270, 0, 90, 180] as const; // W, N, E, S — quadrant boundaries

const seamData = SEAMS.map((angle) => {
  const outer = pt(angle, R);
  const inner = pt(angle, RADIUS_HOLE);
  const t = tangent(angle);
  const c1 = { x: round(outer.x + t.x * K1), y: round(outer.y + t.y * K1) };
  const c2 = { x: round(inner.x + t.x * K2), y: round(inner.y + t.y * K2) };
  return { outer, inner, c1, c2 };
});

function blade(startIdx: number) {
  const endIdx = (startIdx + 1) % 4;
  const start = seamData[startIdx];
  const end = seamData[endIdx];
  return [
    `M ${start.outer.x} ${start.outer.y}`,
    `C ${start.c1.x} ${start.c1.y} ${start.c2.x} ${start.c2.y} ${start.inner.x} ${start.inner.y}`,
    `A ${RADIUS_HOLE} ${RADIUS_HOLE} 0 0 1 ${end.inner.x} ${end.inner.y}`,
    `C ${end.c2.x} ${end.c2.y} ${end.c1.x} ${end.c1.y} ${end.outer.x} ${end.outer.y}`,
    `A ${R} ${R} 0 0 0 ${start.outer.x} ${start.outer.y}`,
    "Z",
  ].join(" ");
}

const BLADES = [
  { label: "Employee", color: "#3E7CA6" },
  { label: "Business Owner", color: "#AEB93E" },
  { label: "Investor", color: "#E89A3C" },
  { label: "Self Employed", color: "#4FAE7C" },
];

// Small triangular seam markers, echoing the notches at each blade boundary
// in the source diagram; sized relative to the outer radius.
function seamMarker(angle: number, color: string) {
  const base = pt(angle, R + 2);
  const tip = pt(angle, R + 26);
  const t = tangent(angle);
  const side = 14;
  const left = { x: round(base.x - t.x * side), y: round(base.y - t.y * side) };
  const right = { x: round(base.x + t.x * side), y: round(base.y + t.y * side) };
  return { d: `M ${left.x} ${left.y} L ${tip.x} ${tip.y} L ${right.x} ${right.y} Z`, color };
}

const MARKERS = [
  seamMarker(270, BLADES[0].color),
  seamMarker(0, BLADES[1].color),
  seamMarker(90, BLADES[2].color),
  seamMarker(180, BLADES[3].color),
];

const CORNERS: {
  title: string;
  subtitle: string;
  icons: [typeof Clock, typeof DollarSign];
  color: string;
}[] = [
  { title: "You have a job", subtitle: "No leverage", icons: [Clock, DollarSign], color: BLADES[0].color },
  { title: "Build teams", subtitle: "Leverage", icons: [Users, DollarSign], color: BLADES[1].color },
  { title: "You create a job", subtitle: "No leverage", icons: [Clock, DollarSign], color: BLADES[3].color },
  { title: "Money works for you", subtitle: "Leverage", icons: [Coins, DollarSign], color: BLADES[2].color },
];

// Labels always read left-to-right, matching the source diagram (only the
// column that wraps a Corner decides whether the block hugs toward the
// wheel or sits flush against the outer edge — see IncomeWheel below).
function Corner({ corner }: { corner: (typeof CORNERS)[number] }) {
  const [IconA, IconB] = corner.icons;
  return (
    <div className="flex w-44 flex-col items-start gap-2 text-left">
      <p className="text-sm font-semibold tracking-wide uppercase" style={{ color: corner.color }}>
        {corner.title}
      </p>
      <div className="h-px w-full" style={{ backgroundColor: "var(--border)" }} />
      <p className="text-xs font-medium tracking-wide text-muted uppercase">{corner.subtitle}</p>
      <div className="flex items-center gap-2">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-full border"
          style={{ borderColor: corner.color, color: corner.color }}
        >
          <IconA size={15} />
        </span>
        <Equal size={13} className="text-muted" />
        <span
          className="flex h-8 w-8 items-center justify-center rounded-full border"
          style={{ borderColor: corner.color, color: corner.color }}
        >
          <IconB size={15} />
        </span>
      </div>
    </div>
  );
}

export default function IncomeWheel() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-center lg:gap-6">
      <div className="flex flex-col gap-16 lg:items-end">
        <Corner corner={CORNERS[0]} />
        <Corner corner={CORNERS[2]} />
      </div>

      <motion.svg
        initial={{ opacity: 0, scale: 0.9, rotate: -6 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewBox="-330 -330 660 660"
        width={340}
        height={340}
        className="mx-auto shrink-0"
      >
        {BLADES.map((b, i) => (
          <path key={b.label} d={blade(i)} fill={b.color} fillOpacity={0.92} />
        ))}
        {MARKERS.map((m, i) => (
          <path key={i} d={m.d} fill={m.color} fillOpacity={0.6} />
        ))}
        <circle r={RADIUS_HOLE} fill="var(--background)" />
        {BLADES.map((b, i) => {
          const angle = SEAMS[i] + 45;
          const labelR = (R + RADIUS_HOLE) / 2 + 20;
          const p = pt(angle, labelR);
          return (
            <text
              key={b.label}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#0b1220"
              fontSize={17}
              fontWeight={700}
              style={{ textTransform: "uppercase", letterSpacing: 0.3 }}
            >
              {b.label.split(" ").map((word, wi) => (
                <tspan key={wi} x={p.x} dy={wi === 0 ? -8 : 18}>
                  {word}
                </tspan>
              ))}
            </text>
          );
        })}
      </motion.svg>

      <div className="flex flex-col gap-16">
        <Corner corner={CORNERS[1]} />
        <Corner corner={CORNERS[3]} />
      </div>
    </div>
  );
}
