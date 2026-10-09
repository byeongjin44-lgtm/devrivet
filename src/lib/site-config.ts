export const SITE_NAME = "DevRivet";
export const SITE_URL = "https://example.com";
export const SITE_DESCRIPTION =
  "Fast, private developer tools for Base64, UUIDs, SQL formatting, cron expressions, and more.";

export const SITE_TAGLINE = "Fast, private developer tools that run in your browser.";

export type ToolDefinition = {
  slug: string;
  path: string;
  name: string;
  shortDescription: string;
  title: string;
  metaDescription: string;
};

export const TOOLS: ToolDefinition[] = [
  {
    slug: "base64",
    path: "/base64",
    name: "Base64 Encoder / Decoder",
    shortDescription: "Encode and decode Base64 instantly in your browser.",
    title: `Base64 Encoder & Decoder — ${SITE_NAME}`,
    metaDescription:
      "Encode text to Base64 or decode Base64 to text instantly. Supports UTF-8, emoji, and multiline input. Runs entirely in your browser — nothing is sent to a server.",
  },
  {
    slug: "uuid-generator",
    path: "/uuid-generator",
    name: "UUID Generator",
    shortDescription: "Generate secure UUID v4 and time-ordered UUID v7 identifiers.",
    title: `UUID Generator — ${SITE_NAME}`,
    metaDescription:
      "Generate RFC 9562 compliant UUID v4 and UUID v7 identifiers online. Bulk generate up to 1000 UUIDs and validate existing UUIDs, all in your browser.",
  },
  {
    slug: "sql-formatter",
    path: "/sql-formatter",
    name: "SQL Formatter",
    shortDescription: "Format and beautify SQL queries for popular SQL dialects.",
    title: `SQL Formatter — ${SITE_NAME}`,
    metaDescription:
      "Format and beautify SQL queries for Standard SQL, MySQL, PostgreSQL, SQL Server, and SQLite. Free online SQL formatter that runs locally in your browser.",
  },
  {
    slug: "cron-generator",
    path: "/cron-generator",
    name: "Cron Expression Generator",
    shortDescription: "Build, understand and validate cron expressions.",
    title: `Cron Expression Generator — ${SITE_NAME}`,
    metaDescription:
      "Build cron expressions with an easy visual generator, get a plain-English explanation of any cron expression, and preview upcoming run times.",
  },
];

export const NAV_LINKS = TOOLS.map((tool) => ({ href: tool.path, label: tool.name }));
