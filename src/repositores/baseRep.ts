import executeQuery from '../infrastructure/database/queries.ts';
import { QueryResult } from '../infrastructure/database/queries.ts';
import { RowDataPacket } from 'mysql2';

abstract class BaseRepository<T> {
  protected abstract tableName: string;
  protected abstract get primaryKey(): keyof T;
  protected abstract get columns(): (keyof T)[];

  showtableName() {
    console.log(this.tableName);
  }

  async selectById(id: number): Promise<T | null> {
    this.showtableName();
    const result = (await executeQuery(
      `SELECT * FROM ${this.tableName} WHERE ${String(this.primaryKey)} = ?`,
      [id],
    )) as RowDataPacket[];

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
