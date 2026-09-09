import { SITE_NAME, SITE_TAGLINE, CONTACT } from "@/lib/site-config";
import { SITE_URL } from "@/lib/seo";

// vCard 3.0, not 4.0. 4.0 is the current spec but Android's contact importer
// and Outlook are both patchy on it, whereas 3.0 is understood everywhere and
// carries every field we need.
const VERSION = "3.0";

// Commas, semicolons and backslashes are structural in a vCard value, so a
// tagline like "Wellness, Simplified" would otherwise split into two fields.
// Newlines have to become the literal escape too.
function esc(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

export function GET() {
  const name = CONTACT.vcardName;

  const lines = [
    "BEGIN:VCARD",
    `VERSION:${VERSION}`,
    // N is structured (family;given;middle;prefix;suffix). Treating the whole
    // thing as the given name keeps a one-word business name from being filed
    // under an empty surname.
    `N:;${esc(name)};;;`,
    `FN:${esc(name)}`,
    `ORG:${esc(SITE_NAME)}`,
    // No TEL by design. The number is not published anywhere on the site, and
    // this endpoint is as public as the page is, so putting it here would just
    // move it rather than remove it.
    `EMAIL;TYPE=INTERNET:${CONTACT.email}`,
    // Saving the contact also files the site, so the link survives in their
    // phonebook long after the QR code is out of sight.
    `URL:${SITE_URL}`,
    `NOTE:${esc(SITE_TAGLINE)}`,
    "END:VCARD",
  ];

  // RFC 6350 requires CRLF line endings. Plain \n works on Android but iOS is
  // stricter and can reject the file outright.
  const body = lines.join("\r\n") + "\r\n";

  return new Response(body, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      // The filename is what shows in the download tray on Android; iOS reads
      // the content type and opens its "Add Contact" sheet directly.
      "Content-Disposition": `attachment; filename="${SITE_NAME.toLowerCase()}.vcf"`,
      "Cache-Control": "public, max-age=86400",
    },
  });
}
