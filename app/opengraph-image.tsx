import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site-config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${SITE_NAME} | ${SITE_TAGLINE}`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000000",
          backgroundImage:
            "radial-gradient(ellipse 60% 60% at 50% 0%, rgba(59,130,246,0.35), transparent 70%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 22px",
            borderRadius: 999,
            border: "1px solid #27272a",
            color: "#a1a1aa",
            fontSize: 24,
          }}
        >
          {SITE_TAGLINE}
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 96,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: -2,
          }}
        >
          {SITE_NAME}
        </div>
        <div style={{ marginTop: 20, fontSize: 30, color: "#a1a1aa" }}>
          Nutrilite · Artistry · XS · eSpring · Home Care
        </div>
      </div>
    ),
    { ...size }
  );
}
