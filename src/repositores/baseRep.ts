import executeQuery from '../infrastructure/database/queries.ts';
import { QueryResult } from '../infrastructure/database/queries.ts';
import { RowDataPacket } from 'mysql2';

class BaseRepository<T> {
  protected readonly tableName: string;
  protected readonly primaryKey: keyof T;
  protected readonly columns: (keyof T)[];

  showValues() {
    console.log(this.tableName);
    console.log(this.primaryKey);
    console.log(this.columns);
  }

  constructor(repositoryInfo: { tableName: string; primaryKey: keyof T; columns: (keyof T)[] }) {
    this.tableName = repositoryInfo.tableName;
    this.primaryKey = repositoryInfo.primaryKey;
    this.columns = repositoryInfo.columns;
  }

  async selectById(id: number): Promise<T | null> {
    const result = (await executeQuery(
      `SELECT * FROM ${this.tableName} WHERE ${String(this.primaryKey)} = ?`,
      [id],
    )) as RowDataPacket[];
    console.log(result);
    return result.length ? (result[0] as T) : null;
  }

  async insertEntity(entity: T): Promise<QueryResult | null> {
    const values = this.columns.map((col) => entity[col]);
    return executeQuery(
      `INSERT INTO ${this.tableName} (${this.columns.join(', ')}) VALUES (${this.columns.map(() => '?').join(', ')})`,
      values,
    );
  }

  async updateEntity(entity: T): Promise<QueryResult | null> {
    const values = this.columns.map((col) => entity[col]).slice(1);
    const primaryKeyValue = entity[this.primaryKey];
    return executeQuery(
      `UPDATE ${this.tableName} SET ${this.columns
        .slice(1)
        .map((col) => `${String(col)} = ?`)
        .join(', ')} WHERE ${String(this.primaryKey)} = ?`,
      [...values, primaryKeyValue],
    );
  }
}

export default BaseRepository;
