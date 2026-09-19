import { jsonLdGraph } from "@/lib/seo";

/**
 * Emits a Schema.org @graph as a script tag. Server component on purpose —
 * the markup ships in the HTML so crawlers that do not execute JS still see it.
 */
export default function JsonLd({ nodes }: { nodes: object[] }) {
  return (
    <script
      type="application/ld+json"
      // The payload is built from our own constants, never user input.
      dangerouslySetInnerHTML={{ __html: jsonLdGraph(...nodes) }}
    />
  );
}
