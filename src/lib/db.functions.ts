import { createServerFn } from "@tanstack/react-start";
import { executeDbQuery, type QueryOptions } from "./db.server";

export const executeDbQueryFn = createServerFn({ method: "POST" })
  .validator((input: QueryOptions) => input)
  .handler(async ({ data }) => {
    return await executeDbQuery(data);
  });
