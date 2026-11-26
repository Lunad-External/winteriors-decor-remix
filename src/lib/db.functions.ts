import { createServerFn } from "@tanstack/react-start";
import { executeDbQuery, type QueryOptions } from "./db.server";
import { currentAdmin } from "./auth.server";

// Tables any visitor may read: the content the public site shows.
const PUBLIC_READ = new Set([
  "site_content", "blogs", "projects", "project_images", "service_categories",
  "service_subcategories", "testimonials", "team_members", "clients", "offices",
]);
// The public enquiry page saves its form directly; only these columns, one row at a time.
const ENQUIRY_COLUMNS = new Set(["id", "name", "email", "phone", "company", "message"]);

/** Why this request may not run without an admin login, or null if it is allowed for everyone. */
export function publicDenyReason(q: QueryOptions): string | null {
  if (q.action === "select") return PUBLIC_READ.has(q.table) ? null : `reading ${q.table}`;
  if (q.action === "insert" && q.table === "enquiries") {
    const rows = [q.data].flat();
    const ok = rows.length === 1 && rows[0] && typeof rows[0] === "object" && Object.keys(rows[0]).every(k => ENQUIRY_COLUMNS.has(k));
    return ok ? null : "this enquiry insert";
  }
  return `${q.action} on ${q.table}`;
}

export const executeDbQueryFn = createServerFn({ method: "POST" })
  .validator((input: QueryOptions) => input)
  .handler(async ({ data }) => {
    const reason = publicDenyReason(data);
    if (reason && !(await currentAdmin())) {
      return { data: null, error: { message: `Not allowed: ${reason} requires an admin login`, code: "forbidden" } };
    }
    return await executeDbQuery(data);
  });
