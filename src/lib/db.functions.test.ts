import { describe, expect, it, vi } from "vitest";

vi.mock("@tanstack/react-start/server", () => ({ getCookie: vi.fn(), setCookie: vi.fn(), deleteCookie: vi.fn() }));
vi.mock("pg", () => ({ default: { Pool: vi.fn(() => ({ query: vi.fn(async () => ({ rows: [] })) })) } }));
process.env.DB_Connection = "postgresql://test@localhost:5432/test";

const { publicDenyReason } = await import("./db.functions");
const { invalidIdentifier } = await import("./db.server");
const { hashPassword, verifyPassword } = await import("./auth.server");

describe("public access rules", () => {
  it("lets visitors read public content", () => {
    for (const table of ["projects", "project_images", "blogs", "site_content", "testimonials"]) {
      expect(publicDenyReason({ table, action: "select" })).toBeNull();
    }
  });

  it("blocks visitors from reading private tables", () => {
    for (const table of ["enquiries", "profiles", "user_roles", "admin_users", "admin_sessions", "cms_pages", "email_send_log"]) {
      expect(publicDenyReason({ table, action: "select" })).not.toBeNull();
    }
  });

  it("blocks visitors from changing anything", () => {
    expect(publicDenyReason({ table: "projects", action: "delete", filters: [] })).not.toBeNull();
    expect(publicDenyReason({ table: "site_content", action: "update", data: { value: "x" } })).not.toBeNull();
    expect(publicDenyReason({ table: "blogs", action: "insert", data: { title: "x" } })).not.toBeNull();
    expect(publicDenyReason({ table: "projects", action: "upsert", data: { slug: "x" } })).not.toBeNull();
  });

  it("allows one enquiry from the public form, with its own columns only", () => {
    const enquiry = { id: "1", name: "A", email: "a@b.c", phone: "1", company: null, message: "hi" };
    expect(publicDenyReason({ table: "enquiries", action: "insert", data: enquiry })).toBeNull();
    expect(publicDenyReason({ table: "enquiries", action: "insert", data: [enquiry, enquiry] })).not.toBeNull();
    expect(publicDenyReason({ table: "enquiries", action: "insert", data: { ...enquiry, status: "read" } })).not.toBeNull();
  });
});

describe("identifier check", () => {
  it("accepts the plain names the app uses", () => {
    expect(invalidIdentifier({ table: "projects", action: "select", columns: "id, slug, title", order: [{ column: "updated_at", ascending: false }] })).toBeNull();
    expect(invalidIdentifier({ table: "projects", action: "select", orConditions: "slug.eq.a,slug.eq.b" })).toBeNull();
  });

  it("rejects SQL smuggled into names", () => {
    expect(invalidIdentifier({ table: 'projects"; DROP TABLE projects; --', action: "select" })).not.toBeNull();
    expect(invalidIdentifier({ table: "projects", action: "select", columns: 'id" FROM enquiries --' })).not.toBeNull();
    expect(invalidIdentifier({ table: "projects", action: "update", data: { 'title" = 1; --': "x" } })).not.toBeNull();
    expect(invalidIdentifier({ table: "projects", action: "select", filters: [{ column: "slug OR 1=1", op: "eq", value: 1 }] })).not.toBeNull();
  });
});

describe("password hashing", () => {
  it("verifies the right password and rejects others", async () => {
    const stored = await hashPassword("correct horse battery");
    expect(stored.startsWith("scrypt$")).toBe(true);
    expect(await verifyPassword("correct horse battery", stored)).toBe(true);
    expect(await verifyPassword("wrong password", stored)).toBe(false);
    expect(await verifyPassword("anything", "not-a-hash")).toBe(false);
  });
});
