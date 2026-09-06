import QRCode from "qrcode";
import { absoluteUrl } from "@/lib/seo";

// Serves the /card QR code as a real PNG file (not just the inline data URI
// rendered on the page), so it can be saved, printed, or dropped into a
// signature/print card directly. Cached for a day since the target URL never
// changes between deploys.
export async function GET() {
  const cardUrl = absoluteUrl("/card");
  const buffer = await QRCode.toBuffer(cardUrl, {
    type: "png",
    width: 1024,
    margin: 2,
    color: { dark: "#0b0b0c", light: "#ffffff" },
  });

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": 'inline; filename="longitivity-card-qr.png"',
      "Cache-Control": "public, max-age=86400",
    },
  });
}
