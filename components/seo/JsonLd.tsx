import type { JsonLdObject } from "@/lib/seo/structured-data";

/*
  Renders one schema.org JSON-LD block. Pass `data` for a single object or
  `items` for an array. The script is rendered as plain HTML (not next/script)
  so it lands in the prerendered HTML directly and crawlers see it without
  executing JavaScript.
*/
type Props = { data: JsonLdObject } | { items: readonly JsonLdObject[] };

export function JsonLd(props: Props) {
  const payload = "items" in props ? props.items : [props.data];
  return (
    <>
      {payload.map((obj, i) => (
        <script
          key={i}
          type="application/ld+json"
          // JSON.stringify is safe here - the data we pass in is built from
          // typed helpers, not user input.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }}
        />
      ))}
    </>
  );
}
