import { describe, expect, it, vi } from "vitest";

const query = vi.fn(async () => ({ rows: [] }));
vi.mock("pg", () => ({ default: { Pool: vi.fn(() => ({ query })) } }));
process.env.DB_Connection = "postgresql://test@localhost:5432/test";

const { executeDbQuery } = await import("./db.server");

describe("executeDbQuery upsert", () => {
  it("quotes each column of a multi-column conflict key", async () => {
    await executeDbQuery({
      table: "project_images",
      action: "upsert",
      data: [{ project_slug: "p", file_name: "01.jpg", sort_order: 0 }],
      onConflict: "project_slug,file_name",
    });
    const sql = query.mock.calls.at(-1)![0] as string;
    expect(sql).toContain('ON CONFLICT ("project_slug", "file_name")');
    expect(sql).toContain('DO UPDATE SET "sort_order" = EXCLUDED."sort_order"');
    expect(sql).not.toContain('"project_slug" = EXCLUDED');
  });

  it("keeps single-column conflict keys working", async () => {
    await executeDbQuery({ table: "projects", action: "upsert", data: { slug: "p", title: "T" }, onConflict: "slug" });
    expect(query.mock.calls.at(-1)![0]).toContain('ON CONFLICT ("slug") DO UPDATE SET "title" = EXCLUDED."title"');
  });
});
