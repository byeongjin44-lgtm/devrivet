import { describe, expect, it } from "vitest";
import { type BlogPost, getAllPosts, getPostsForTool, getRelatedPosts, parseInline, validatePost } from "@/lib/blog";

const valid = {
  slug: "example-post",
  title: "Example post",
  description: "A description that is comfortably longer than fifty characters in total.",
  published: "2026-10-31",
  relatedTool: "cron-generator",
  body: [
    { type: "p", text: "Hello" },
    { type: "ul", items: ["a", "b"] },
    { type: "code", text: "*/5 * * * *" },
  ],
};

describe("validatePost", () => {
  it("accepts a valid post", () => {
    expect(validatePost(valid, "example-post").slug).toBe("example-post");
  });

  it.each([
    ["slug mismatch", { ...valid }, "other-slug"],
    ["bad slug", { ...valid, slug: "Bad Slug" }, undefined],
    ["short description", { ...valid, description: "too short" }, undefined],
    ["bad date", { ...valid, published: "31/10/2026" }, undefined],
    ["unknown tool", { ...valid, relatedTool: "image-resizer" }, undefined],
    ["empty body", { ...valid, body: [] }, undefined],
    ["unknown block", { ...valid, body: [{ type: "html", text: "<b>x</b>" }] }, undefined],
    ["empty list", { ...valid, body: [{ type: "ul", items: [] }] }, undefined],
  ])("rejects %s", (_name, data, slug) => {
    expect(() => validatePost(data, slug)).toThrow(/Invalid blog post/);
  });
});

describe("parseInline", () => {
  it("splits text, inline code and links", () => {
    expect(parseInline("Use `*/5 * * * *` in the [generator](/cron-generator).")).toEqual([
      { kind: "text", value: "Use " },
      { kind: "code", value: "*/5 * * * *" },
      { kind: "text", value: " in the " },
      { kind: "link", value: "generator", href: "/cron-generator" },
      { kind: "text", value: "." },
    ]);
  });

  it("returns plain text unchanged", () => {
    expect(parseInline("plain")).toEqual([{ kind: "text", value: "plain" }]);
  });
});

describe("content/blog", () => {
  it("every post file is valid, newest first", () => {
    const posts = getAllPosts();
    for (let i = 1; i < posts.length; i++) expect(posts[i - 1].published >= posts[i].published).toBe(true);
  });

  it("hides posts dated in the future", () => {
    expect(getAllPosts("1999-01-01")).toEqual([]);
  });

  it("links posts to their tool", () => {
    expect(getPostsForTool("cron-generator").map((p) => p.slug)).toContain("cron-every-5-minutes");
  });

  it("related posts: same tool first, then same category, then newest; never the post itself", () => {
    const mk = (slug: string, relatedTool?: string): BlogPost => ({
      slug, title: slug, description: "x".repeat(50), published: "2026-11-01", relatedTool, body: [{ type: "p", text: "x" }],
    });
    // cron-generator and timestamp-converter share the "Time & Automation" category.
    const posts = [mk("a", "json-formatter"), mk("b", "timestamp-converter"), mk("c", "cron-generator"), mk("d"), mk("self", "cron-generator")];
    const self = posts[4];
    expect(getRelatedPosts(self, 3, posts).map((p) => p.slug)).toEqual(["c", "b", "a"]);
    expect(getRelatedPosts(self, 10, posts).map((p) => p.slug)).toEqual(["c", "b", "a", "d"]);
    expect(getRelatedPosts(mk("solo"), 3, [mk("solo")])).toEqual([]);
  });

  it("real cron posts recommend each other first", () => {
    const post = getAllPosts().find((p) => p.slug === "cron-every-5-minutes")!;
    expect(getRelatedPosts(post).slice(0, 2).map((p) => p.relatedTool)).toEqual(["cron-generator", "cron-generator"]);
  });
});
