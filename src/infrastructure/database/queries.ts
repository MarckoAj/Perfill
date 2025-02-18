import { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { getPool } from './connection.ts';

export type QueryResult = ResultSetHeader | RowDataPacket[];

const executeQuery = async (
  query: string,
  parametros: string | number | (string | number)[] = [],
): Promise<QueryResult> => {
  let connection: PoolConnection | null = null;

  try {
    const pool = getPool();
    connection = await pool.getConnection();

    await connection.beginTransaction();

    const [resultados] = await connection.query<QueryResult>(query, parametros);

    await connection.commit();

    return resultados;
  } catch (error) {
    console.log(query);
    if (connection) {
      await connection.rollback();
    }
    throw new Error(
      `Database query error : ${error instanceof Error ? error.message : String(error)}`,
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

export default executeQuery;
