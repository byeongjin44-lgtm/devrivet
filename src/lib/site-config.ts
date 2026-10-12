export const SITE_NAME = "DevRivet";
export const SITE_URL = "https://example.com";
export const SITE_DESCRIPTION =
  "Fast, private developer tools for Base64, UUIDs, SQL formatting, cron expressions, and more.";

export const SITE_TAGLINE = "Fast, private developer tools that run in your browser.";

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
};

export const TOOLS: ToolDefinition[] = [
  {
    slug: "base64",
    category: "Encoding & Tokens",
    path: "/base64",
    name: "Base64 Encoder / Decoder",
    shortDescription: "Encode and decode Base64 instantly in your browser.",
    title: `Base64 Encoder & Decoder — ${SITE_NAME}`,
    metaDescription:
      "Encode text to Base64 or decode Base64 to text instantly. Supports UTF-8, emoji, and multiline input. Runs entirely in your browser — nothing is sent to a server.",
  },
  {
    slug: "uuid-generator",
    category: "Identifiers & Hashing",
    path: "/uuid-generator",
    name: "UUID Generator",
    shortDescription: "Generate secure UUID v4 and time-ordered UUID v7 identifiers.",
    title: `UUID Generator — ${SITE_NAME}`,
    metaDescription:
      "Generate RFC 9562 compliant UUID v4 and UUID v7 identifiers online. Bulk generate up to 1000 UUIDs and validate existing UUIDs, all in your browser.",
  },
  {
    slug: "sql-formatter",
    category: "Data & Formatting",
    path: "/sql-formatter",
    name: "SQL Formatter",
    shortDescription: "Format and beautify SQL queries for popular SQL dialects.",
    title: `SQL Formatter — ${SITE_NAME}`,
    metaDescription:
      "Format and beautify SQL queries for Standard SQL, MySQL, PostgreSQL, SQL Server, and SQLite. Free online SQL formatter that runs locally in your browser.",
  },
  {
    slug: "cron-generator",
    category: "Time & Automation",
    path: "/cron-generator",
    name: "Cron Expression Generator",
    shortDescription: "Build, understand and validate cron expressions.",
    title: `Cron Expression Generator — ${SITE_NAME}`,
    metaDescription:
      "Build cron expressions with an easy visual generator, get a plain-English explanation of any cron expression, and preview upcoming run times.",
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
  },
  {
    slug: "url-encoder",
    category: "Encoding & Tokens",
    path: "/url-encoder",
    name: "URL Encoder / Decoder",
    shortDescription: "Encode and decode URL/query-string components.",
    title: `URL Encoder & Decoder — ${SITE_NAME}`,
    metaDescription:
      "Encode text for safe use in a URL query parameter, or decode percent-encoded text back to readable form. Runs entirely in your browser.",
  },
  {
    slug: "timestamp-converter",
    category: "Time & Automation",
    path: "/timestamp-converter",
    name: "Unix Timestamp Converter",
    shortDescription: "Convert between Unix timestamps and human-readable dates.",
    title: `Unix Timestamp Converter — ${SITE_NAME}`,
    metaDescription:
      "Convert Unix timestamps (seconds or milliseconds) to human-readable dates and back, in UTC or your browser's local timezone.",
  },
  {
    slug: "jwt-decoder",
    category: "Encoding & Tokens",
    path: "/jwt-decoder",
    name: "JWT Decoder",
    shortDescription: "Decode a JWT's header and payload instantly.",
    title: `JWT Decoder — ${SITE_NAME}`,
    metaDescription:
      "Decode a JSON Web Token's header and payload to inspect its claims. Decoding only — no signature verification. Runs entirely in your browser.",
  },
  {
    slug: "regex-tester",
    category: "Testing",
    path: "/regex-tester",
    name: "Regex Tester",
    shortDescription: "Test JavaScript regular expressions with match highlighting and capture groups.",
    title: `Regex Tester — ${SITE_NAME}`,
    metaDescription:
      "Test JavaScript regular expressions online with instant matches, capture groups and safe in-browser processing.",
  },
  {
    slug: "hash-generator",
    category: "Identifiers & Hashing",
    path: "/hash-generator",
    name: "Hash Generator",
    shortDescription: "Generate SHA-256, SHA-384, SHA-512 and SHA-1 hashes.",
    title: `Hash Generator — ${SITE_NAME}`,
    metaDescription:
      "Generate SHA-256, SHA-384, SHA-512 and SHA-1 hashes of any text instantly in your browser. UTF-8 input, hex output, nothing uploaded.",
  },
];

export const TOOL_GROUPS = TOOL_CATEGORIES.map((category) => ({
  category,
  tools: TOOLS.filter((tool) => tool.category === category),
}));

