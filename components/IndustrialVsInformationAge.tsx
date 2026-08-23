"use client";

import type { ComponentType } from "react";
import { motion } from "framer-motion";
import { Users, DollarSign, Clock, ShoppingCart, ArrowUp } from "lucide-react";

type Pt = { x: number; y: number }; // percent coordinates, 0-100
type IconType = ComponentType<{ size?: number; className?: string }>;

// Undistorted vector space for angle/offset math: the container is locked to
// a 16:9 aspect ratio, so converting percent coordinates into a 1600x900
// space (16 * x, 9 * y) makes one unit equal in both axes, which keeps the
// parallel-line offsets and arrowheads from looking skewed.
const toVB = (p: Pt) => ({ x: p.x * 16, y: p.y * 9 });
const fromVB = (p: Pt) => ({ x: p.x / 16, y: p.y / 9 });

function normalize(p: Pt) {
  const len = Math.hypot(p.x, p.y) || 1;
  return { x: p.x / len, y: p.y / len };
}

const JOB: Pt = { x: 15, y: 26 };
const STORE: Pt = { x: 15, y: 68 };
const PERSON_L: Pt = { x: 45, y: 47 };
const PERSON_R: Pt = { x: 55, y: 47 };
const NETWORK: Pt = { x: 85, y: 26 };
const STORE_R: Pt = { x: 85, y: 68 };

const LINE_COLOR = "#8b93a1";

function arrowHead(tipVB: Pt, dirVB: Pt, size = 16) {
  const back = { x: tipVB.x - dirVB.x * size, y: tipVB.y - dirVB.y * size };
  const perp = { x: -dirVB.y, y: dirVB.x };
  const p1 = { x: back.x + perp.x * size * 0.5, y: back.y + perp.y * size * 0.5 };
  const p2 = { x: back.x - perp.x * size * 0.5, y: back.y - perp.y * size * 0.5 };
  return `${tipVB.x},${tipVB.y} ${p1.x},${p1.y} ${p2.x},${p2.y}`;
}

function Connector({ from, to }: { from: Pt; to: Pt }) {
  const a = toVB(from);
  const b = toVB(to);
  const dir = normalize({ x: b.x - a.x, y: b.y - a.y });
  const perp = { x: -dir.y, y: dir.x };
  const gapVB = 14;

  // Line 1: from -> to (arrow points at "to")
  const a1 = { x: a.x + perp.x * gapVB, y: a.y + perp.y * gapVB };
  const b1 = { x: b.x + perp.x * gapVB, y: b.y + perp.y * gapVB };
  // Line 2: to -> from (arrow points at "from")
  const a2 = { x: b.x - perp.x * gapVB, y: b.y - perp.y * gapVB };
  const b2 = { x: a.x - perp.x * gapVB, y: a.y - perp.y * gapVB };

  return (
    <>
      <line x1={a1.x} y1={a1.y} x2={b1.x} y2={b1.y} stroke={LINE_COLOR} strokeWidth={2.5} strokeOpacity={0.7} />
      <polygon points={arrowHead(b1, dir)} fill={LINE_COLOR} fillOpacity={0.7} />
      <line x1={a2.x} y1={a2.y} x2={b2.x} y2={b2.y} stroke={LINE_COLOR} strokeWidth={2.5} strokeOpacity={0.7} />
      <polygon points={arrowHead(b2, { x: -dir.x, y: -dir.y })} fill={LINE_COLOR} fillOpacity={0.7} />
    </>
  );
}

function IconBadge({ at, offsetPct, icon: Icon }: { at: Pt; offsetPct: Pt; icon: IconType }) {
  const left = at.x + offsetPct.x;
  const top = at.y + offsetPct.y;
  return (
    <div
      className="absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background text-accent shadow-sm sm:h-8 sm:w-8"
      style={{ left: `${left}%`, top: `${top}%` }}
    >
      <Icon size={14} />
    </div>
  );
}

function iconOffset(from: Pt, to: Pt, along: number, sign: 1 | -1) {
  const a = toVB(from);
  const b = toVB(to);
  const dir = normalize({ x: b.x - a.x, y: b.y - a.y });
  const perp = { x: -dir.y, y: dir.x };
  const mid = { x: a.x + (b.x - a.x) * along, y: a.y + (b.y - a.y) * along };
  const pushed = { x: mid.x + perp.x * 26 * sign, y: mid.y + perp.y * 26 * sign };
  const pct = fromVB(pushed);
  const midPct = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };
  return { x: pct.x - midPct.x, y: pct.y - midPct.y };
}

function FlowBox({
  at,
  label,
  lines,
  color,
}: {
  at: Pt;
  label: string;
  lines: string[];
  color: string;
}) {
  return (
    <div
      className="absolute flex w-[19%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-0.5 rounded-2xl px-3 py-4 text-center sm:rounded-3xl"
      style={{
        left: `${at.x}%`,
        top: `${at.y}%`,
        aspectRatio: "1.15",
        backgroundColor: color,
        boxShadow: `0 16px 32px -12px ${color}80`,
      }}
    >
      <p className="mb-1 text-[9px] font-semibold tracking-wide text-white/80 uppercase sm:text-[10px] md:text-xs">
        {label}
      </p>
      {lines.map((line) => (
        <p key={line} className="text-[11px] leading-tight font-extrabold text-white uppercase sm:text-sm md:text-base">
          {line}
        </p>
      ))}
    </div>
  );
}

function PersonBadge({ at }: { at: Pt }) {
  return (
    <div
      className="absolute flex h-[13%] w-[8%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border-[3px] border-accent bg-background sm:rounded-3xl"
      style={{ left: `${at.x}%`, top: `${at.y}%` }}
    >
      <Users size={20} className="text-accent" />
    </div>
  );
}

export default function IndustrialVsInformationAge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative mx-auto aspect-[16/9] w-full max-w-5xl overflow-hidden rounded-3xl border border-border bg-surface p-4 shadow-2xl shadow-black/40 sm:p-8"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[100px]"
      />

      {/* Column titles */}
      <p
        className="absolute text-[10px] font-semibold tracking-[0.15em] whitespace-nowrap text-foreground uppercase sm:text-sm md:text-lg"
        style={{ left: "25%", top: "2%", transform: "translate(-50%, 0)" }}
      >
        Industrial Age Model
      </p>
      <p
        className="absolute text-[10px] font-semibold tracking-[0.15em] whitespace-nowrap text-foreground uppercase sm:text-sm md:text-lg"
        style={{ left: "75%", top: "2%", transform: "translate(-50%, 0)" }}
      >
        Information Age Model
      </p>

      {/* Divider */}
      <div className="absolute top-[10%] bottom-[10%] left-1/2 w-px -translate-x-1/2 bg-linear-to-b from-transparent via-border to-transparent" />

      {/* Connecting arrows */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1600 900" preserveAspectRatio="none">
        <Connector from={JOB} to={PERSON_L} />
        <Connector from={STORE} to={PERSON_L} />
        <Connector from={PERSON_R} to={NETWORK} />
        <Connector from={PERSON_R} to={STORE_R} />
      </svg>

      {/* Icons on the arrows */}
      <IconBadge at={{ x: (JOB.x + PERSON_L.x) / 2, y: (JOB.y + PERSON_L.y) / 2 }} offsetPct={iconOffset(JOB, PERSON_L, 0.4, 1)} icon={DollarSign} />
      <IconBadge at={{ x: (JOB.x + PERSON_L.x) / 2, y: (JOB.y + PERSON_L.y) / 2 }} offsetPct={iconOffset(JOB, PERSON_L, 0.6, -1)} icon={Clock} />
      <IconBadge at={{ x: (STORE.x + PERSON_L.x) / 2, y: (STORE.y + PERSON_L.y) / 2 }} offsetPct={iconOffset(STORE, PERSON_L, 0.4, 1)} icon={DollarSign} />
      <IconBadge at={{ x: (STORE.x + PERSON_L.x) / 2, y: (STORE.y + PERSON_L.y) / 2 }} offsetPct={iconOffset(STORE, PERSON_L, 0.6, -1)} icon={ShoppingCart} />
      <IconBadge at={{ x: (PERSON_R.x + NETWORK.x) / 2, y: (PERSON_R.y + NETWORK.y) / 2 }} offsetPct={iconOffset(PERSON_R, NETWORK, 0.6, 1)} icon={DollarSign} />
      <IconBadge at={{ x: (PERSON_R.x + NETWORK.x) / 2, y: (PERSON_R.y + NETWORK.y) / 2 }} offsetPct={iconOffset(PERSON_R, NETWORK, 0.4, -1)} icon={Clock} />
      <IconBadge at={{ x: (PERSON_R.x + STORE_R.x) / 2, y: (PERSON_R.y + STORE_R.y) / 2 }} offsetPct={iconOffset(PERSON_R, STORE_R, 0.6, 1)} icon={DollarSign} />
      <IconBadge at={{ x: (PERSON_R.x + STORE_R.x) / 2, y: (PERSON_R.y + STORE_R.y) / 2 }} offsetPct={iconOffset(PERSON_R, STORE_R, 0.4, -1)} icon={ShoppingCart} />

      {/* Boxes */}
      <FlowBox at={JOB} label="Employer's Asset" lines={["Your", "Job"]} color="#D9614F" />
      <FlowBox at={STORE} label="Store's Asset" lines={["Their", "Store", ".com"]} color="#E2953C" />
      <FlowBox at={NETWORK} label="Your Business" lines={["Your", "Network"]} color="#AEB93E" />
      <FlowBox at={STORE_R} label="Your Business" lines={["Your", "Store", ".com"]} color="#3E7CA6" />

      <PersonBadge at={PERSON_L} />
      <PersonBadge at={PERSON_R} />

      {/* Customers callout under the Information Age store */}
      <div className="absolute flex flex-col items-center gap-1" style={{ left: "85%", top: "84%", transform: "translate(-50%, -50%)" }}>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center">
            <ArrowUp size={11} className="text-accent" />
            <ShoppingCart size={13} className="text-muted" />
          </div>
          <div className="flex flex-col items-center">
            <ArrowUp size={11} className="text-accent" />
            <DollarSign size={13} className="text-muted" />
          </div>
        </div>
        <p className="text-[8px] font-bold tracking-wide whitespace-nowrap text-accent uppercase sm:text-[10px]">Customers</p>
      </div>

      {/* Bottom captions */}
      <p className="absolute text-[10px] font-medium tracking-[0.15em] whitespace-nowrap text-muted uppercase sm:text-sm md:text-base" style={{ left: "25%", top: "96%", transform: "translate(-50%, -100%)" }}>
        Making a Living
      </p>
      <p className="absolute text-[10px] font-medium tracking-[0.15em] whitespace-nowrap text-muted uppercase sm:text-sm md:text-base" style={{ left: "75%", top: "96%", transform: "translate(-50%, -100%)" }}>
        Making a Life
      </p>
    </motion.div>
  );
}
