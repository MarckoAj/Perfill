import { ResultSetHeader, RowDataPacket } from 'mysql2';
import executeQuery from '../infrastructure/database/queries.ts';

const isRowDataPacketArray = (result: unknown): result is RowDataPacket[] => {
  return Array.isArray(result) && result.every((item) => typeof item === 'object' && item !== null);
};

export const isResultSetHeader = (result: unknown): result is ResultSetHeader => {
  if (typeof result !== 'object' || result === null) return false;

  const obj = result as Partial<ResultSetHeader>;

  return (
    typeof obj.affectedRows === 'number' &&
    typeof obj.insertId === 'number' &&
    typeof obj.warningStatus === 'number'
  );
};

const sqlTableCheck = (tableName: string, schemaName: string): string => {
  return `SELECT TABLE_NAME as 'Table' FROM information_schema.tables WHERE TABLE_SCHEMA = '${schemaName}' AND TABLE_NAME = '${tableName}'`;
};
const sqlColumnCheck = (tableName: string, schemaName: string): string => {
  return `SELECT COLUMN_NAME FROM information_schema.columns WHERE TABLE_NAME = '${tableName}' AND TABLE_SCHEMA = '${schemaName}'`;
};

const sqlDataCheck = (tableName: string, schemaName: string): string => {
  return `SELECT * FROM ${schemaName}.${tableName}`;
};

const clearDbTables = async (databaseName: string) => {
  try {
    await executeQuery('SET FOREIGN_KEY_CHECKS = 0;');

    const result = await executeQuery(`
      SELECT TABLE_NAME
      FROM information_schema.tables
      WHERE table_schema = '${databaseName}';
    `);

    if (Array.isArray(result) && result.length > 0) {
      for (const row of result) {
        const tableName = row.TABLE_NAME;
        await executeQuery(`DROP TABLE IF EXISTS \`${tableName}\`;`);
      }
    } else {
      console.log(`Nenhuma tabela encontrada no banco ${databaseName}.`);
    }

    await executeQuery('SET FOREIGN_KEY_CHECKS = 1;');
  } catch (error) {
    console.error(`Erro ao excluir tabelas: ${error}`);
  }
};

export { isRowDataPacketArray, sqlTableCheck, sqlColumnCheck, clearDbTables, sqlDataCheck };
