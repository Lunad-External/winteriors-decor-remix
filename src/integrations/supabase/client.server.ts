import { executeDbQuery, type QueryOptions } from '@/lib/db.server';

class ServerQueryBuilder {
  private opts: QueryOptions;

  constructor(table: string) {
    this.opts = {
      table,
      action: 'select',
      columns: '*',
      filters: [],
      order: [],
    };
  }

  select(columns: string = '*') {
    this.opts.action = 'select';
    this.opts.columns = columns;
    return this;
  }

  insert(data: any) {
    this.opts.action = 'insert';
    this.opts.data = data;
    return this;
  }

  update(data: any) {
    this.opts.action = 'update';
    this.opts.data = data;
    return this;
  }

  upsert(data: any, options?: { onConflict?: string }) {
    this.opts.action = 'upsert';
    this.opts.data = data;
    if (options?.onConflict) {
      this.opts.onConflict = options.onConflict;
    }
    return this;
  }

  delete() {
    this.opts.action = 'delete';
    return this;
  }

  eq(column: string, value: any) {
    if (!this.opts.filters) this.opts.filters = [];
    this.opts.filters.push({ column, op: 'eq', value });
    return this;
  }

  neq(column: string, value: any) {
    if (!this.opts.filters) this.opts.filters = [];
    this.opts.filters.push({ column, op: 'ne', value });
    return this;
  }

  is(column: string, value: any) {
    if (!this.opts.filters) this.opts.filters = [];
    this.opts.filters.push({ column, op: 'is', value });
    return this;
  }

  in(column: string, value: any[]) {
    if (!this.opts.filters) this.opts.filters = [];
    this.opts.filters.push({ column, op: 'in', value });
    return this;
  }

  or(conditions: string) {
    this.opts.orConditions = conditions;
    return this;
  }

  order(column: string, options?: { ascending?: boolean }) {
    if (!this.opts.order) this.opts.order = [];
    this.opts.order.push({ column, ascending: options?.ascending !== false });
    return this;
  }

  limit(n: number) {
    this.opts.limit = n;
    return this;
  }

  range(from: number, to: number) {
    this.opts.offset = from;
    this.opts.limit = to - from + 1;
    return this;
  }

  single() {
    this.opts.single = true;
    return this;
  }

  maybeSingle() {
    this.opts.maybeSingle = true;
    return this;
  }

  then(resolve: (res: { data: any; error: any }) => void, reject?: (err: any) => void) {
    executeDbQuery(this.opts)
      .then((res) => resolve(res))
      .catch((err) => {
        if (reject) reject(err);
        else resolve({ data: null, error: err });
      });
  }
}

export const supabaseAdmin = {
  from(table: string) {
    return new ServerQueryBuilder(table);
  },
  auth: {
    async getUser() {
      return { data: { user: { id: 'admin-user-id', email: 'admin@winteriorsdecor.com' } }, error: null };
    }
  }
};
