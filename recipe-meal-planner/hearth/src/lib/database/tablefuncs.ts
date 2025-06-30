import type { Table } from "./table";
import { sql } from "./postgres.server";

export async function getOtherStats(sheetid: string): Promise<Table[]> {
  const otherStats = await sql<Table[]>`
      SELECT * FROM otherstats WHERE sheet_id = ${sheetid}
    `;

  return otherStats;
}

export async function addTable(table: Table) {
  let id = table.id;
  let entry = table.entry;
  let createdAt = table.createdAt;
  const result = await sql`
    INSERT INTO otherstats (id, entry, createdAt) VALUES (${id}, ${entry}, ${createdAt}) RETURNING *
  `;

  return result;
}

export async function addTables(tables: Table[]) {
  for (const table of tables) {
    addTable(table);
  }
}

export async function dbTableReset() {
  await sql`DO $$ 
            DECLARE
              table_name text := 'tables';
            BEGIN
              EXECUTE 'DROP TABLE IF EXISTS public.' || table_name || ' CASCADE';
            END $$;
    `;

  await sql`CREATE TABLE tables(
            id VARCHAR(100) NOT NULL,
            entry INT NOT NULL,
            created_at DATE NOT NULL DEFAULT NOW();`;

  await addTable({
    id : "dudes-bros-2025-04-03-15:20-0",
    entry: 0,
    createdAt: new Date("2025-04-03T15:20:00Z"),
  });

  const res = await addTable({
    id: "dudes-bros-2025-04-03-15:20-1",
    entry: 1,
    createdAt: new Date("2025-04-03T15:20:00Z"),
  });

  return res;
}
