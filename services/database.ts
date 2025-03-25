import pg from "pg"
const { Pool } = pg

const databaseClient = async () => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })
  return await pool.connect()
}

export const query = async (sql: string, values: string[]) => {
  const client = await databaseClient()
  try {
    const result = await client.query(sql, values)
    client.release()
    return result.rows
  } catch(e) {
    console.log(e)
    client.release()
    throw new Error("Ocorreu algum erro na execução da query, verifique a sintaxe")
  }
}