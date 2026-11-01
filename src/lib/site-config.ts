export const SITE_NAME = "DevRivet";
export const SITE_URL = "https://devrivettools.com";
export const CONTACT_EMAIL = "contact@devrivettools.com";
/**
 * Google AdSense publisher ID ("ca-pub-" + 16 digits), or null while the site runs no ads.
 * Setting it loads the AdSense script on every page (Auto ads + the AdSense consent message for
 * EEA/UK/Switzerland, configured in the AdSense dashboard), fills /ads.txt, and shows the
 * Advertising section of the Privacy page. Update that page's "Last updated" date when enabling.
 */
export const ADSENSE_CLIENT: string | null = "ca-pub-5531085038115326";

/** Contents of /ads.txt for the configured AdSense account. */
export function adsTxt(client: string | null = ADSENSE_CLIENT): string {
  if (!client) return "# This site does not run advertising yet.\n";
  if (!/^ca-pub-\d{16}$/.test(client)) throw new Error(`ADSENSE_CLIENT must look like ca-pub-0000000000000000, got ${client}`);
  // f08c47fec0942fa0 is Google's certification authority ID, the same for every AdSense publisher.
  return `google.com, ${client.replace(/^ca-/, "")}, DIRECT, f08c47fec0942fa0\n`;
}

export const SITE_TITLE =`${SITE_NAME} — Free Online Developer Tools`;
export const SITE_DESCRIPTION =
  "10 free developer tools that run in your browser: JSON and SQL formatters, Base64, URL and JWT decoders, UUID, hash, regex, cron and timestamp tools. No sign-up.";

export const TOOL_CATEGORIES = [
  "Encoding & Tokens",
  "Data & Formatting",
  "Testing",
  "Identifiers & Hashing",
  "Time & Automation",
] as const;

export type ToolCategory = (typeof TOOL_CATEGORIES)[number];

export type ToolDefinition = {
  slug: string;
  category: ToolCategory;
  path: string;
  name: string;
  shortDescription: string;
  title: string;
  metaDescription: string;
  /** Slugs of genuinely related tools, linked from the bottom of this tool's page. */
  related: string[];
};

export const TOOLS: ToolDefinition[] = [
  {
    slug: "base64",
    category: "Encoding & Tokens",
    path: "/base64",
    name: "Base64 Encoder / Decoder",
    shortDescription: "Encode and decode Base64 instantly in your browser.",
    title: `Base64 Encode & Decode Online (UTF-8) — ${SITE_NAME}`,
    metaDescription:
      "Encode text to Base64 or decode Base64 to text instantly, with full UTF-8 support for emoji, Korean and multiline input. Runs in your browser — nothing is uploaded.",
    related: ["jwt-decoder", "url-encoder"],
  },
  {
    slug: "uuid-generator",
    category: "Identifiers & Hashing",
    path: "/uuid-generator",
    name: "UUID Generator",
    shortDescription: "Generate secure UUID v4 and time-ordered UUID v7 identifiers.",
    title: `UUID Generator (v4 & v7) with Bulk & Validator — ${SITE_NAME}`,
    metaDescription:
      "Generate RFC 9562 compliant UUID v4 and UUID v7 identifiers online. Bulk generate up to 1000 UUIDs and validate existing UUIDs, all in your browser.",
    related: ["hash-generator"],
  },
  {
    slug: "sql-formatter",
    category: "Data & Formatting",
    path: "/sql-formatter",
    name: "SQL Formatter",
    shortDescription: "Format and beautify SQL queries for popular SQL dialects.",
    title: `SQL Formatter & Beautifier Online — ${SITE_NAME}`,
    metaDescription:
      "Format and beautify SQL queries for Standard SQL, MySQL, PostgreSQL, SQL Server, and SQLite. Free online SQL formatter that runs locally in your browser.",
    related: ["json-formatter"],
  },
  {
    slug: "cron-generator",
    category: "Time & Automation",
    path: "/cron-generator",
    name: "Cron Expression Generator",
    shortDescription: "Build, understand and validate cron expressions.",
    title: `Cron Expression Generator & Explainer — ${SITE_NAME}`,
    metaDescription:
      "Build cron expressions visually, get a plain-English explanation of any 5-field cron expression, and preview the next run times in your local timezone.",
    related: ["timestamp-converter"],
  },
  {
    slug: "json-formatter",
    category: "Data & Formatting",
    path: "/json-formatter",
    name: "JSON Formatter / Validator",
    shortDescription: "Pretty-print, minify, and validate JSON instantly.",
    title: `JSON Formatter & Validator — ${SITE_NAME}`,
    metaDescription:
      "Format, minify, and validate JSON online. Get clear error locations for invalid JSON. Runs entirely in your browser — nothing is sent to a server.",
    related: ["sql-formatter"],
  },
  {
    slug: "url-encoder",
    category: "Encoding & Tokens",
    path: "/url-encoder",
    name: "URL Encoder / Decoder",
    shortDescription: "Encode and decode URL/query-string components.",
    title: `URL Encoder & Decoder (Percent-Encoding) — ${SITE_NAME}`,
    metaDescription:
      "Percent-encode text for URLs and query parameters, or decode %XX sequences back to readable text. Uses encodeURIComponent with full UTF-8 support, in your browser.",
    related: ["base64"],
  },
  {
    slug: "timestamp-converter",
    category: "Time & Automation",
    path: "/timestamp-converter",
    name: "Unix Timestamp Converter",
    shortDescription: "Convert between Unix timestamps and human-readable dates.",
    title: `Unix Timestamp Converter (Epoch to Date) — ${SITE_NAME}`,
    metaDescription:
      "Convert Unix epoch timestamps to dates and back. Auto-detects seconds vs milliseconds and shows both UTC and your local time. Runs in your browser.",
    related: ["cron-generator"],
  },
  {
    slug: "jwt-decoder",
    category: "Encoding & Tokens",
    path: "/jwt-decoder",
    name: "JWT Decoder",
    shortDescription: "Decode a JWT's header and payload instantly.",
    title: `JWT Decoder (Header, Payload & Expiry) — ${SITE_NAME}`,
    metaDescription:
      "Decode a JSON Web Token to read its header and payload, with iat, nbf and exp shown as dates. Decoding only — no signature verification. Runs in your browser.",
    related: ["base64", "json-formatter"],
  },
  {
    slug: "regex-tester",
    category: "Testing",
    path: "/regex-tester",
    name: "Regex Tester",
    shortDescription: "Test JavaScript regular expressions with match highlighting and capture groups.",
    title: `JavaScript Regex Tester — ${SITE_NAME}`,
    metaDescription:
      "Test JavaScript regular expressions with g, i, m, s and u flags, highlighted matches, and numbered and named capture groups. Runs in your browser with a safety timeout.",
    related: [],
  },
  {
    slug: "hash-generator",
    category: "Identifiers & Hashing",
    path: "/hash-generator",
    name: "Hash Generator",
    shortDescription: "Generate SHA-256, SHA-384, SHA-512 and SHA-1 hashes.",
    title: `SHA-256 Hash Generator (SHA-384, SHA-512, SHA-1) — ${SITE_NAME}`,
    metaDescription:
      "Generate SHA-256, SHA-384, SHA-512 and SHA-1 hashes of any text instantly in your browser. UTF-8 input, hex output, nothing uploaded.",
    related: ["uuid-generator"],
  },
];

/** Related tools for the tool at `path`, resolved from the registry (unknown slugs are dropped). */
export function getRelatedTools(path: string): ToolDefinition[] {
  const tool = TOOLS.find((t) => t.path === path);
  if (!tool) return [];
  return tool.related
    .map((slug) => TOOLS.find((t) => t.slug === slug))
    .filter((related): related is ToolDefinition => related !== undefined && related.slug !== tool.slug);
}

export const TOOL_GROUPS =TOOL_CATEGORIES.map((category) => ({
  category,
  tools: TOOLS.filter((tool) => tool.category === category),
}));

