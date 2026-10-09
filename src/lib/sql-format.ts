import { format, type FormatOptionsWithLanguage } from "sql-formatter";

export type SqlDialect = "sql" | "mysql" | "postgresql" | "tsql" | "sqlite";

export const SQL_DIALECTS: { value: SqlDialect; label: string }[] = [
  { value: "sql", label: "Standard SQL" },
  { value: "mysql", label: "MySQL" },
  { value: "postgresql", label: "PostgreSQL" },
  { value: "tsql", label: "SQL Server (T-SQL)" },
  { value: "sqlite", label: "SQLite" },
];

export type KeywordCase = "preserve" | "upper" | "lower";

export class SqlFormatError extends Error {}

export function formatSql(
  query: string,
  dialect: SqlDialect,
  keywordCase: KeywordCase = "upper",
): string {
  const options: FormatOptionsWithLanguage = {
    language: dialect,
    keywordCase,
    tabWidth: 2,
  };
  try {
    return format(query, options);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to format SQL.";
    throw new SqlFormatError(message);
  }
}
