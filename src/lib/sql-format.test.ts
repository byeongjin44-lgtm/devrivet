import { describe, expect, it } from "vitest";
import { SqlFormatError, formatSql } from "./sql-format";

describe("formatSql", () => {
  it("formats a simple query with uppercase keywords by default", () => {
    const result = formatSql("select * from foo where a=1 and b=2", "sql");
    expect(result).toContain("SELECT");
    expect(result).toContain("FROM");
    expect(result).toContain("WHERE");
  });

  it("formats with lowercase keywords when requested", () => {
    const result = formatSql("SELECT * FROM foo", "sql", "lower");
    expect(result).toContain("select");
    expect(result).toContain("from");
  });

  it("formats MySQL dialect-specific syntax", () => {
    const result = formatSql("SELECT * FROM foo LIMIT 10", "mysql");
    expect(result).toContain("LIMIT");
  });

  it("formats PostgreSQL dialect-specific syntax", () => {
    const result = formatSql("SELECT a::text FROM foo", "postgresql");
    expect(result.replace(/\s+/g, " ")).toContain("a::text");
  });

  it("formats SQL Server (tsql) dialect-specific syntax", () => {
    const result = formatSql("SELECT TOP 10 * FROM foo", "tsql");
    expect(result).toContain("TOP");
  });

  it("formats SQLite dialect", () => {
    const result = formatSql("SELECT * FROM foo", "sqlite");
    expect(result).toContain("SELECT");
  });

  it("indents multi-line output", () => {
    const result = formatSql("select a, b from foo where a = 1", "sql");
    expect(result.split("\n").length).toBeGreaterThan(1);
  });

  it("throws SqlFormatError on unparsable input", () => {
    expect(() => formatSql("select * from foo where (", "sql")).toThrow(SqlFormatError);
  });
});
