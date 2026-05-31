# Database Cleanup Instructions for GNIMS

This document explains why the `db-cleanup.js` script fails and provides **step‑by‑step instructions** to resolve the issue. Choose the approach that best fits your workflow.

---

## 📚 Background
The script attempts to call a PostgreSQL stored procedure named **`public.execute_sql`**:

```js
await supabase.rpc('execute_sql', { sql: yourSql });
```

Supabase does **not** include this helper function by default, so the API returns the error:

```
PGRST202: Could not find the function public.execute_sql(sql) in the schema cache
```

To fix it you have three options:

1. **Run the cleanup SQL directly in the Supabase dashboard** (quick one‑time fix).
2. **Create the missing `execute_sql` function once** so the script works repeatedly.
3. **Rewrite `db-cleanup.js` to use Supabase's built‑in `pg_execute_sql` RPC** (no custom function needed).

---

## ✅ Option 1 – One‑off cleanup using the Supabase UI
1. Log in to your Supabase project.
2. Navigate to **SQL → Editor**.
3. Open the file `cleanup-and-setup.sql` in the repository (it contains the TRUNCATE statements).
4. Copy its entire contents and paste them into the editor.
5. Click **Run**.
6. Verify that the tables are emptied (you should see a success message).
7. *(Optional)* Comment out or delete the `execute_sql` call in `db-cleanup.js` so you don’t hit the error again.

---

## 🛠️ Option 2 – Add the missing stored procedure (keep the script reusable)
1. Open the **SQL → Editor** in Supabase.
2. Paste the following definition and run it **once**:

```sql
create or replace function public.execute_sql(p_sql text)
returns void
language plpgsql
as $$
begin
  execute p_sql;
end;
$$;
```
3. After the function is created, re‑run your script:

```powershell
node db-cleanup.js
```
4. The script should now output **"✅ Cleanup succeeded"**.
5. You can keep using `db-cleanup.js` for future cleanups or CI pipelines.

---

## 🔧 Option 3 – Update the script to use Supabase’s native RPC
If you prefer not to add a custom function, modify `db-cleanup.js` as follows:

```js
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function runCleanup() {
  const sql = fs.readFileSync(path.resolve(__dirname, 'cleanup-and-setup.sql'), 'utf8');

  // Supabase provides a built‑in RPC called pg_execute_sql (requires service role key)
  const { data, error } = await supabase.rpc('pg_execute_sql', { sql });

  if (error) {
    console.error('❌ Cleanup failed:', error);
  } else {
    console.log('✅ Cleanup succeeded');
  }
}

runCleanup();
```

**Important:** This uses the **service‑role key**, which has elevated privileges. Make sure the key is stored in an environment variable (`SUPABASE_SERVICE_ROLE_KEY`) and **never** commit it to version control.

---

## 📌 Quick Checklist
- [ ] Decide which option fits your workflow.
- [ ] If you choose Option 2, run the function‑creation SQL **once**.
- [ ] If you choose Option 3, replace the script contents as shown and ensure the service‑role key is set.
- [ ] Re‑run `node db-cleanup.js` and confirm you see a success message.

---

### 🎉 You’re all set!
Follow the steps above and the database cleanup will work without the `PGRST202` error. If you run into permission issues or need further assistance, just let me know.
