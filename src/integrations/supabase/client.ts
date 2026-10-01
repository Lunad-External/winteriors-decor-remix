import { executeDbQueryFn } from "@/lib/db.functions";
import { syncDriveFn } from "@/lib/drive.functions";
import type { QueryOptions } from "@/lib/db.server";

class QueryBuilder {
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
    executeDbQueryFn({ data: this.opts })
      .then((res) => resolve(res))
      .catch((err) => {
        if (reject) reject(err);
        else resolve({ data: null, error: err });
      });
  }
}

import { getStorageUrl } from "@/lib/storage";

// Storage helper
const storageClient = {
  from(bucket: string) {
    return {
      getPublicUrl(path: string) {
        return { data: { publicUrl: getStorageUrl(path) } };
      },
      async upload(path: string, file: any) {
        if (typeof window !== "undefined" && file && (file instanceof File || file instanceof Blob)) {
          try {
            const dataUrl = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(file);
            });
            return { data: { path: dataUrl }, error: null };
          } catch (e) {
            console.warn("Base64 upload failed, using fallback path", e);
          }
        }
        return { data: { path }, error: null };
      },
      async remove(paths: string[]) {
        return { data: paths, error: null };
      },
    };
  },
};

const authListeners = new Set<(event: string, session: any) => void>();

// Auth client with synchronous event dispatching
const authClient = {
  async getSession() {
    const sessionStr = typeof window !== 'undefined' ? localStorage.getItem('supabase_session') : null;
    const session = sessionStr ? JSON.parse(sessionStr) : null;
    return { data: { session }, error: null };
  },
  async getUser() {
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('supabase_user') : null;
    const user = userStr ? JSON.parse(userStr) : null;
    return { data: { user }, error: null };
  },
  async signInWithPassword({ email, password }: any) {
    const mockUser = { id: 'admin-user-id', email: email || 'admin@winteriorsdecor.com', role: 'admin' };
    const mockSession = { access_token: 'mock-token', user: mockUser };
    if (typeof window !== 'undefined') {
      localStorage.setItem('supabase_user', JSON.stringify(mockUser));
      localStorage.setItem('supabase_session', JSON.stringify(mockSession));
    }
    authListeners.forEach(cb => cb('SIGNED_IN', mockSession));
    return { data: { user: mockUser, session: mockSession }, error: null };
  },
  async signOut() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('supabase_user');
      localStorage.removeItem('supabase_session');
    }
    authListeners.forEach(cb => cb('SIGNED_OUT', null));
    return { error: null };
  },
  onAuthStateChange(callback: any) {
    authListeners.add(callback);
    return { data: { subscription: { unsubscribe: () => authListeners.delete(callback) } } };
  },
};

// Functions helper to emulate edge function calls
const functionsClient = {
  async invoke(functionName: string, options?: { body?: any }) {
    const body = options?.body || {};
    try {
      const res = await syncDriveFn({ data: body });
      return { data: res, error: null };
    } catch (err: any) {
      return { data: null, error: err };
    }
  }
};

export const supabase = {
  from(table: string) {
    return new QueryBuilder(table);
  },
  storage: storageClient,
  auth: authClient,
  functions: functionsClient,
};