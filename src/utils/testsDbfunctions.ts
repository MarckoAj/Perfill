import { RowDataPacket } from 'mysql2';

const isRowDataPacketArray = (result: unknown): result is RowDataPacket[] => {
  return Array.isArray(result) && result.every((item) => typeof item === 'object' && item !== null);
};
const sqlTableCheck = (tableName: string, schemaName: string): string => {
  return `SELECT TABLE_NAME as 'Table' FROM information_schema.tables WHERE TABLE_SCHEMA = '${schemaName}' AND TABLE_NAME = '${tableName}'`;
};
const sqlColumnCheck = (tableName: string, schemaName: string): string => {
  return `SELECT COLUMN_NAME FROM information_schema.columns WHERE TABLE_NAME = '${tableName}' AND TABLE_SCHEMA = '${schemaName}'`;
};

export { isRowDataPacketArray, sqlTableCheck, sqlColumnCheck };
