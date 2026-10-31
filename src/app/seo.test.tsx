import { describe, expect, it, vi } from "vitest";
import type { Metadata } from "next";
import type { ComponentType } from "react";
import { renderToString } from "react-dom/server";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, TOOLS, getRelatedTools } from "@/lib/site-config";
import { encodeBase64, decodeBase64 } from "@/lib/base64";
import { formatSql } from "@/lib/sql-format";
import { explainCronExpression, validateCronExpression } from "@/lib/cron";
import { formatJson, minifyJson, validateJson } from "@/lib/json-format";
import { encodeUrlComponent, decodeUrlComponent } from "@/lib/url-encode";
import { detectTimestampUnit, formatUtc, parseTimestamp } from "@/lib/timestamp";
import { decodeJwt, extractTimeClaims, isExpired } from "@/lib/jwt";
import { testRegex } from "@/lib/regex";
import { validateUuid } from "@/lib/uuid";
import { SAMPLE_JWT } from "@/components/tools/JwtDecoderTool";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import sitemap from "./sitemap";
import robots from "./robots";
import RootLayout, { metadata as layoutMetadata } from "./layout";
import * as home from "./page";
import * as about from "./about/page";
import * as privacy from "./privacy/page";
import * as terms from "./terms/page";
import * as contact from "./contact/page";
import * as base64 from "./base64/page";
import * as uuid from "./uuid-generator/page";
import * as sql from "./sql-formatter/page";
import * as cron from "./cron-generator/page";
import * as json from "./json-formatter/page";
import * as url from "./url-encoder/page";
import * as timestamp from "./timestamp-converter/page";
import * as jwt from "./jwt-decoder/page";
import * as regex from "./regex-tester/page";
import * as hash from "./hash-generator/page";
import * as blogIndex from "./blog/page";
import BlogPostPage, { generateMetadata as blogPostMetadata, generateStaticParams as blogStaticParams } from "./blog/[slug]/page";
import { blogPath, getAllPosts } from "@/lib/blog";

vi.mock("next/font/google", () => ({
  Geist: () => ({ variable: "font-sans" }),
  Geist_Mono: () => ({ variable: "font-mono" }),
}));

type PageModule = { metadata: Metadata; default: ComponentType };

const INFO_PAGES: Record<string, PageModule> = {
  "/about": about,
  "/privacy": privacy,
  "/terms": terms,
  "/contact": contact,
  "/blog": blogIndex,
};
const TOOL_PAGES: Record<string, PageModule> = {
  "/base64": base64,
  "/uuid-generator": uuid,
  "/sql-formatter": sql,
  "/cron-generator": cron,
  "/json-formatter": json,
  "/url-encoder": url,
  "/timestamp-converter": timestamp,
  "/jwt-decoder": jwt,
  "/regex-tester": regex,
  "/hash-generator": hash,
};
const PAGES: Record<string, PageModule> = { "/": home, ...INFO_PAGES, ...TOOL_PAGES };
const POSTS = getAllPosts();
const POST_PATHS = POSTS.map((post) => blogPath(post.slug));
const ROUTES = new Set([...Object.keys(PAGES), ...POST_PATHS]);

const decodeEntities = (s: string) =>
  s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#123;/g, "{")
    .replace(/&#125;/g, "}")
    .replace(/&amp;/g, "&");
/** Visible text of server-rendered markup, with whitespace collapsed (code blocks keep their newlines). */
const textOf = (html: string) => decodeEntities(html.replace(/<!-- -->/g, "").replace(/<[^>]+>/g, " ")).replace(/[ \t]+/g, " ");
const flat = (s: string) => s.replace(/\s+/g, " ").trim();

const rendered = new Map<string, string>();
function render(path: string): string {
  if (!rendered.has(path)) {
    const Page = PAGES[path].default;
    rendered.set(path, renderToString(<Page />));
  }
  return rendered.get(path)!;
}
const pageText = (path: string) => flat(textOf(render(path)));
/** Exact contents of each <pre> code block (whitespace preserved). */
const preBlocks = (path: string) =>
  [...render(path).matchAll(/<pre[^>]*>([\s\S]*?)<\/pre>/g)].map((m) => decodeEntities(m[1].replace(/<!-- -->/g, "")));
const hrefs = (html: string) => [...html.matchAll(/<a [^>]*href="([^"]+)"/g)].map((m) => m[1]);
const internal = (links: string[]) => links.filter((h) => h.startsWith("/"));

describe("metadata", () => {
  it("every indexable page has a unique, non-empty title and description", () => {
    const titles = Object.values(PAGES).map((p) => String(p.metadata.title ?? ""));
    const descriptions = Object.values(PAGES).map((p) => String(p.metadata.description ?? ""));
    for (const value of [...titles, ...descriptions]) expect(value.trim().length).toBeGreaterThan(10);
    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });

  it.each(Object.keys(PAGES))("%s has a self-referencing canonical and complete Open Graph", (path) => {
    const { metadata } = PAGES[path];
    const expected = `${SITE_URL}${path}`;
    expect(metadata.alternates?.canonical).toBe(expected);
    expect(metadata.openGraph).toMatchObject({
      url: expected,
      title: metadata.title,
      description: metadata.description,
      siteName: SITE_NAME,
      type: "website",
    });
  });

  it("tool metadata comes from the registry and names the brand", () => {
    for (const tool of TOOLS) {
      const { metadata } = TOOL_PAGES[tool.path];
      expect(metadata.title).toBe(tool.title);
      expect(metadata.description).toBe(tool.metaDescription);
      expect(tool.title.endsWith(` — ${SITE_NAME}`)).toBe(true);
    }
  });

  it("the root layout does not set a canonical that other pages (e.g. 404) would inherit", () => {
    expect(layoutMetadata.alternates?.canonical).toBeUndefined();
  });

  it("the site description states the actual number of tools", () => {
    expect(SITE_DESCRIPTION.startsWith(`${TOOLS.length} free developer tools`)).toBe(true);
  });

  it("renders <html lang=\"en\">", () => {
    const html = renderToString(<RootLayout params={Promise.resolve({})}>{null}</RootLayout>);
    expect(html).toMatch(/^<html lang="en"/);
  });
});

describe("sitemap and robots", () => {
  const entries = sitemap();

  it("lists the homepage, info pages, the blog, every tool and every post exactly once", () => {
    const urls = entries.map((e) => e.url);
    expect(urls).toHaveLength(ROUTES.size);
    expect(new Set(urls).size).toBe(ROUTES.size);
    expect(new Set(urls)).toEqual(new Set([...ROUTES].map((path) => `${SITE_URL}${path}`)));
  });

  it("has no build-time lastmod; only blog posts carry their real content dates", () => {
    for (const entry of entries) {
      const post = POSTS.find((p) => `${SITE_URL}${blogPath(p.slug)}` === entry.url);
      expect(entry.lastModified).toBe(post ? (post.updated ?? post.published) : undefined);
    }
  });

  it("robots.txt allows crawling and points to the sitemap", () => {
    const r = robots();
    expect(r.rules).toEqual({ userAgent: "*", allow: "/" });
    expect(r.sitemap).toBe(`${SITE_URL}/sitemap.xml`);
  });
});

describe("static HTML", () => {
  it.each(Object.keys(PAGES))("%s renders exactly one H1 and no heading-level skips", (path) => {
    const levels = [...render(path).matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]));
    expect(levels.filter((l) => l === 1)).toHaveLength(1);
    expect(levels[0]).toBe(1);
    levels.forEach((level, i) => {
      if (i > 0) expect(level).toBeLessThanOrEqual(levels[i - 1] + 1);
    });
  });

  it("homepage states the key facts and links every tool", () => {
    const text = pageText("/");
    expect(text).toContain("Free developer tools that run in your browser");
    expect(text).toContain(`${TOOLS.length} fast, focused tools`);
    expect(text).toContain("No sign-up required");
    expect(new Set(internal(hrefs(render("/"))))).toEqual(new Set(TOOLS.map((t) => t.path)));
  });

  it.each(TOOLS.map((t) => t.path))("%s has its explanation content in the static HTML", (path) => {
    const tool = TOOLS.find((t) => t.path === path)!;
    expect(pageText(path)).toContain(tool.name);
    const h2s = [...render(path).matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map((m) => flat(textOf(m[1])));
    expect(h2s.some((h) => /^(What is|Why)/.test(h)), h2s.join(" | ")).toBe(true);
    expect(h2s.some((h) => /example/i.test(h)), h2s.join(" | ")).toBe(true);
    expect(h2s).toContain("FAQ");
  });

  it("about page lists every tool from the registry", () => {
    const html = render("/about");
    expect(pageText("/about")).toContain(`free collection of ${TOOLS.length} focused`);
    expect(new Set(internal(hrefs(html)))).toEqual(new Set(TOOLS.map((t) => t.path)));
  });

  it("every internal link on pages, header and footer points to an existing route", () => {
    const all = [
      ...Object.keys(PAGES).flatMap((path) => hrefs(render(path))),
      ...hrefs(renderToString(<Header />)),
      ...hrefs(renderToString(<Footer />)),
    ];
    for (const href of internal(all)) expect(ROUTES.has(href), href).toBe(true);
  });
});

describe("related tools", () => {
  it("only references existing tools, never the tool itself, without duplicates", () => {
    const slugs = new Set(TOOLS.map((t) => t.slug));
    for (const tool of TOOLS) {
      expect(new Set(tool.related).size).toBe(tool.related.length);
      for (const slug of tool.related) {
        expect(slugs.has(slug), `${tool.slug} → ${slug}`).toBe(true);
        expect(slug).not.toBe(tool.slug);
      }
    }
  });

  it.each(TOOLS.map((t) => t.path))("%s renders its related tools as real links", (path) => {
    const related = getRelatedTools(path);
    const html = render(path);
    if (related.length === 0) {
      expect(html).not.toContain("Related tools");
      return;
    }
    const section = html.slice(html.indexOf('id="related-tools"'));
    expect(internal(hrefs(section))).toEqual(related.map((t) => t.path));
    expect(hrefs(section)).not.toContain(path);
  });

  it("regex tester is not forced into an unrelated pairing", () => {
    expect(getRelatedTools("/regex-tester")).toEqual([]);
  });
});

// Every example documented on a tool page must match what the tool's own logic produces.
describe("documented examples", () => {
  it("Base64", () => {
    expect(encodeBase64("hello")).toBe("aGVsbG8=");
    expect(encodeBase64("안녕하세요")).toBe("7JWI64WV7ZWY7IS47JqU");
    expect(decodeBase64("7JWI64WV7ZWY7IS47JqU")).toBe("안녕하세요");
    expect(() => decodeBase64("aGVsbG8")).toThrow(); // unpadded (Base64URL-style) input is rejected
    expect(() => decodeBase64("a-b_")).toThrow();
    const text = pageText("/base64");
    expect(text).toContain("안녕하세요 (Korean for \"hello\") encodes to 7JWI64WV7ZWY7IS47JqU");
    expect(text).toContain("Base64 is not encryption");
  });

  it("UUID", () => {
    expect(validateUuid("9b2f1e3a-7c4d-4a1b-8f3e-1234567890ab")).toEqual({ valid: true, version: 4 });
    const v7 = "01a139bf-b332-75b9-81d3-bcd3cba532f2";
    expect(validateUuid(v7)).toEqual({ valid: true, version: 7 });
    const ms = parseInt(v7.replace(/-/g, "").slice(0, 12), 16);
    expect(new Date(ms).toISOString()).toBe("2026-10-14T09:30:26.994Z");
    const text = pageText("/uuid-generator");
    expect(text).toContain(v7);
    expect(text).toContain("2026-10-14 09:30:26.994 UTC");
  });

  it("SQL Formatter (default Standard SQL dialect, UPPERCASE keywords)", () => {
    const input =
      "select u.id,u.name,count(o.id) as order_count from users u left join orders o on u.id=o.user_id where u.active=1 and o.created_at>='2026-01-01' group by u.id,u.name order by order_count desc;";
    const output = formatSql(input, "sql", "upper");
    expect(preBlocks("/sql-formatter")).toEqual([input, output]);
    // Keyword case only affects keywords: count() keeps the casing as typed.
    expect(formatSql(input, "sql", "lower")).toMatch(/^select\n[\s\S]*count\(o\.id\) as order_count\nfrom/);
  });

  it("Cron", () => {
    expect(explainCronExpression("0 9 * * 1-5")).toBe("At 09:00 AM, Monday through Friday");
    expect(explainCronExpression("*/5 * * * *")).toBe("Every 5 minutes");
    expect(explainCronExpression("30 2 1 * *")).toBe("At 02:30 AM, on day 1 of the month");
    expect(explainCronExpression("0 0 * * 0")).toBe("At 12:00 AM, only on Sunday");
    expect(explainCronExpression("0 0 * * 7")).toBe("At 12:00 AM, only on Sunday");
    const text = pageText("/cron-generator");
    for (const expr of ["*/5 * * * *", "30 2 1 * *", "0 0 * * 0"]) expect(text).toContain(expr);
  });

  it("JSON", () => {
    const minified = '{"name":"DevRivet","tools":10,"private":true,"tags":["json","regex","hash"]}';
    const formatted = formatJson(minified);
    expect(minifyJson(formatted)).toBe(minified);
    expect(preBlocks("/json-formatter")).toEqual([minified, formatted]);
    // V8 (Chrome / Node) reports the trailing comma at line 1, column 31.
    expect(validateJson('{"name":"DevRivet","tools":10,}')).toMatchObject({ valid: false, line: 1, column: 31 });
    expect(pageText("/json-formatter")).toContain("Line 1, Column 31");
  });

  it("URL Encoder", () => {
    expect(encodeUrlComponent("name=John Doe&city=New York")).toBe("name%3DJohn%20Doe%26city%3DNew%20York");
    const ko = "%EC%95%88%EB%85%95%ED%95%98%EC%84%B8%EC%9A%94";
    expect(encodeUrlComponent("안녕하세요")).toBe(ko);
    expect(decodeUrlComponent(ko)).toBe("안녕하세요");
    expect(encodeUrlComponent("a b+c")).toBe("a%20b%2Bc");
    expect(decodeUrlComponent("a+b")).toBe("a+b");
    const text = pageText("/url-encoder");
    expect(text).toContain(ko);
    expect(text).toContain("a b+c encodes to a%20b%2Bc");
  });

  it("Timestamp", () => {
    expect(detectTimestampUnit("1704067200")).toBe("seconds");
    expect(detectTimestampUnit("1704067200000")).toBe("milliseconds");
    const s = parseTimestamp("1704067200", "seconds");
    const ms = parseTimestamp("1704067200000", "milliseconds");
    expect(s.getTime()).toBe(ms.getTime());
    expect(formatUtc(s)).toBe("2024-01-01 00:00:00 UTC");
    const text = pageText("/timestamp-converter");
    expect(text).toContain("1704067200 (10 digits, read as seconds)");
    expect(text).toContain("2024-01-01 00:00:00 UTC");
  });

  it("JWT (Load sample token)", () => {
    const decoded = decodeJwt(SAMPLE_JWT);
    expect(decoded.header).toEqual({ alg: "HS256", typ: "JWT" });
    expect(decoded.payload).toEqual({ sub: "1234567890", name: "John Doe", iat: 1516239022 });
    const claims = extractTimeClaims(decoded.payload);
    expect(claims.map((c) => c.claim)).toEqual(["iat"]);
    expect(claims[0].date.toISOString().replace("T", " ").replace(".000Z", " UTC")).toBe("2018-01-18 01:30:22 UTC");
    expect(isExpired(decoded.payload)).toBeNull();
    const text = pageText("/jwt-decoder");
    expect(text).toContain('{"sub":"1234567890","name":"John Doe","iat":1516239022}');
    expect(text).toContain("2018-01-18 01:30:22 UTC");
    expect(text).toContain("it never checks the signature");
  });

  it("Regex", () => {
    const result = testRegex("(?<year>\\d{4})-(?<month>\\d{2})", "g", "Released 2024-01, patched 2025-12");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.matches.map((m) => [m.text, m.index])).toEqual([
      ["2024-01", 9],
      ["2025-12", 26],
    ]);
    expect(result.matches[0].groups).toEqual([
      { index: 1, name: "year", value: "2024" },
      { index: 2, name: "month", value: "01" },
    ]);
    const original = testRegex("\\d+", "g", "Order 123, Order 456");
    expect(original.ok && original.matches.map((m) => [m.text, m.index])).toEqual([
      ["123", 6],
      ["456", 17],
    ]);
    const text = pageText("/regex-tester");
    expect(text).toContain("(?<year>\\d{4})-(?<month>\\d{2})");
    expect(text).toContain("2024-01 at index 9");
    expect(text).toContain("2025-12 at index 26");
    expect(text).toContain("Regular expression timed out. The pattern may cause excessive backtracking.");
    expect(text).toContain("about 1.5 seconds");
  });
});

describe("blog posts", () => {
  it("has at least one post and pre-renders every post", () => {
    expect(POSTS.length).toBeGreaterThan(0);
    expect(blogStaticParams()).toEqual(POSTS.map((p) => ({ slug: p.slug })));
  });

  it("blog index links every post", () => {
    const links = internal(hrefs(render("/blog")));
    for (const postPath of POST_PATHS) expect(links).toContain(postPath);
  });

  it.each(POSTS.map((p) => p.slug))("%s has metadata, one H1, valid internal links and a link to its tool", async (slug) => {
    const params = Promise.resolve({ slug });
    const metadata = await blogPostMetadata({ params });
    const expected = `${SITE_URL}${blogPath(slug)}`;
    expect(metadata.alternates?.canonical).toBe(expected);
    expect(metadata.openGraph).toMatchObject({ url: expected, siteName: SITE_NAME });

    const html = renderToString(await BlogPostPage({ params }));
    const levels = [...html.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]));
    expect(levels.filter((l) => l === 1)).toHaveLength(1);
    expect(levels[0]).toBe(1);
    levels.forEach((level, i) => {
      if (i > 0) expect(level).toBeLessThanOrEqual(levels[i - 1] + 1);
    });
    for (const href of internal(hrefs(html))) expect(ROUTES.has(href), href).toBe(true);

    const post = POSTS.find((p) => p.slug === slug)!;
    const tool = TOOLS.find((t) => t.slug === post.relatedTool);
    if (tool) {
      expect(internal(hrefs(html))).toContain(tool.path);
      expect(internal(hrefs(render(tool.path)))).toContain(blogPath(slug));
    }
  });

  it("cron-every-5-minutes only documents valid cron expressions", () => {
    const post = POSTS.find((p) => p.slug === "cron-every-5-minutes")!;
    const expressions = post.body
      .flatMap((b) => (b.type === "code" ? [b.text] : b.type === "ul" ? b.items : b.type === "p" ? [b.text] : []))
      .flatMap((text) => [...text.matchAll(/`([^`]+)`/g)].map((m) => m[1]).concat(text.split("\n").at(-1) ?? []))
      .filter((s) => /^[\d*/,-]+( [\d*/,-]+){4}$/.test(s));
    expect(expressions).toEqual(expect.arrayContaining(["*/5 * * * *", "*/5 9-17 * * 1-5", "2-59/5 * * * *", "*/7 * * * *"]));
    for (const expr of expressions) expect(validateCronExpression(expr), expr).toEqual({ valid: true });
  });
});
