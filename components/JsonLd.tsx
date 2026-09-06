// Renders a structured-data payload as an inline ld+json script.
//
// The `<` escape is not cosmetic: JSON.stringify happily emits a literal
// "</script>" if any catalog string ever contains one, which would close the
// tag early and hand an injection point to whatever followed. Next's JSON-LD
// guide calls this out specifically.
export default function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
