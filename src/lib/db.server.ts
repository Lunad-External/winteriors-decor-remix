import pg from 'pg';

let pool: pg.Pool | null = null;

export function getDbPool() {
  if (!pool) {
    const connectionString =
      process.env.DB_Connection ||
      process.env.DATABASE_URL ||
      "postgresql://neondb_owner:npg_VqNK0XaC2yDH@ep-spring-night-b7hncdq1-pooler.c-13.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

    pool = new pg.Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
    });
  }
  return pool;
}

export interface QueryOptions {
  table: string;
  action: 'select' | 'insert' | 'update' | 'delete' | 'upsert';
  columns?: string;
  filters?: Array<{ column: string; op: 'eq' | 'ne' | 'or' | 'in' | 'is'; value: any }>;
  orConditions?: string;
  order?: Array<{ column: string; ascending: boolean }>;
  limit?: number;
  offset?: number;
  single?: boolean;
  maybeSingle?: boolean;
  data?: any;
  onConflict?: string;
}

export async function executeDbQuery(opts: QueryOptions) {
  const p = getDbPool();
  const { table, action, data, filters = [], orConditions, order = [], limit, offset, single, maybeSingle, onConflict } = opts;

  let sql = '';
  const params: any[] = [];
  let paramIdx = 1;

  function buildWhere() {
    const clauses: string[] = [];
    for (const f of filters) {
      if (f.op === 'eq') {
        clauses.push(`"${f.column}" = $${paramIdx++}`);
        params.push(f.value);
      } else if (f.op === 'ne') {
        clauses.push(`"${f.column}" != $${paramIdx++}`);
        params.push(f.value);
      } else if (f.op === 'is') {
        if (f.value === null) clauses.push(`"${f.column}" IS NULL`);
        else if (f.value === 'not_null') clauses.push(`"${f.column}" IS NOT NULL`);
      } else if (f.op === 'in' && Array.isArray(f.value)) {
        const inParams = f.value.map(() => `$${paramIdx++}`);
        clauses.push(`"${f.column}" IN (${inParams.join(', ')})`);
        params.push(...f.value);
      }
    }
    if (orConditions) {
      // e.g. drive_folder_id.eq.abc,slug.eq.abc
      const parts = orConditions.split(',');
      const orClauses: string[] = [];
      for (const part of parts) {
        const match = part.match(/^([\w.-]+)\.eq\.(.+)$/);
        if (match) {
          orClauses.push(`"${match[1]}" = $${paramIdx++}`);
          params.push(match[2]);
        }
      }
      if (orClauses.length > 0) {
        clauses.push(`(${orClauses.join(' OR ')})`);
      }
    }
    return clauses.length > 0 ? ` WHERE ${clauses.join(' AND ')}` : '';
  }

  if (action === 'select') {
    const cols = opts.columns && opts.columns !== '*' ? opts.columns.split(',').map(c => `"${c.trim()}"`).join(', ') : '*';
    sql = `SELECT ${cols} FROM public."${table}"${buildWhere()}`;
    if (order.length > 0) {
      const orderClause = order.map(o => `"${o.column}" ${o.ascending ? 'ASC' : 'DESC'}`).join(', ');
      sql += ` ORDER BY ${orderClause}`;
    }
    if (limit !== undefined) {
      sql += ` LIMIT $${paramIdx++}`;
      params.push(limit);
    }
    if (offset !== undefined) {
      sql += ` OFFSET $${paramIdx++}`;
      params.push(offset);
    }
  } else if (action === 'insert') {
    const records = Array.isArray(data) ? data : [data];
    if (records.length === 0) return { data: [], error: null };
    const keys = Object.keys(records[0]);
    const colNames = keys.map(k => `"${k}"`).join(', ');
    const valueTuples: string[] = [];
    for (const rec of records) {
      const tuple: string[] = [];
      for (const k of keys) {
        tuple.push(`$${paramIdx++}`);
        params.push(rec[k]);
      }
      valueTuples.push(`(${tuple.join(', ')})`);
    }
    sql = `INSERT INTO public."${table}" (${colNames}) VALUES ${valueTuples.join(', ')} RETURNING *`;
  } else if (action === 'upsert') {
    const records = Array.isArray(data) ? data : [data];
    if (records.length === 0) return { data: [], error: null };
    const keys = Object.keys(records[0]);
    const colNames = keys.map(k => `"${k}"`).join(', ');
    const valueTuples: string[] = [];
    for (const rec of records) {
      const tuple: string[] = [];
      for (const k of keys) {
        tuple.push(`$${paramIdx++}`);
        params.push(rec[k]);
      }
      valueTuples.push(`(${tuple.join(', ')})`);
    }
    const conflictCol = onConflict || 'id';
    const updateCols = keys.filter(k => k !== conflictCol).map(k => `"${k}" = EXCLUDED."${k}"`).join(', ');
    const doUpdate = updateCols ? `DO UPDATE SET ${updateCols}` : 'DO NOTHING';
    sql = `INSERT INTO public."${table}" (${colNames}) VALUES ${valueTuples.join(', ')} ON CONFLICT ("${conflictCol}") ${doUpdate} RETURNING *`;
  } else if (action === 'update') {
    const keys = Object.keys(data || {});
    if (keys.length === 0) return { data: [], error: null };
    const setClause = keys.map(k => {
      params.push(data[k]);
      return `"${k}" = $${paramIdx++}`;
    }).join(', ');
    sql = `UPDATE public."${table}" SET ${setClause}${buildWhere()} RETURNING *`;
  } else if (action === 'delete') {
    sql = `DELETE FROM public."${table}"${buildWhere()} RETURNING *`;
  }

  try {
    const res = await p.query(sql, params);
    let rows = res.rows;
    if (single || maybeSingle) {
      return { data: rows[0] || null, error: null };
    }
    return { data: rows, error: null };
  } catch (err: any) {
    console.error(`DB Query Error [${table} ${action}]:`, err.message, sql);
    return { data: null, error: { message: err.message, code: err.code } };
  }
}
