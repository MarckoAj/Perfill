import executeQuery from '../infrastructure/database/queries.ts';
import { QueryResult } from '../infrastructure/database/queries.ts';
import { RowDataPacket } from 'mysql2';

type PrimaryKey<T> = keyof T | (keyof T)[];

abstract class BaseRepository<T> {
  protected abstract get tableName(): string;
  protected abstract get primaryKey(): PrimaryKey<T>;
  protected abstract get columns(): (keyof T)[];

  private getWhereClauseFromKeys(keys: PrimaryKey<T>): string {
    if (Array.isArray(keys)) {
      return keys.map((key) => `\`${String(key)}\` = ?`).join(' AND ');
    }
    return `\`${String(keys)}\` = ?`;
  }

  private getKeyValues(entityOrKey: Partial<T>): unknown[] {
    if (Array.isArray(this.primaryKey)) {
      return this.primaryKey.map((key) => entityOrKey[key]);
    }
    return [entityOrKey[this.primaryKey]];
  }

  async selectById(id: number | Partial<T>, fields?: (keyof T)[]): Promise<T | null> {
    const selectedFields = fields?.length ? fields.map((f) => `\`${String(f)}\``).join(', ') : '*';

    const whereClause = this.getWhereClauseFromKeys(this.primaryKey);
    const values = typeof id === 'object' ? this.getKeyValues(id) : [id];

    const sql = `SELECT ${selectedFields} FROM ${this.tableName} WHERE ${whereClause}`;

    const result = (await executeQuery(sql, values)) as RowDataPacket[];

    return result.length ? (result[0] as T) : null;
  }

  getAllowedsFields(): (keyof T)[] {
    return this.columns;
  }

  async insertEntity(entity: T): Promise<QueryResult | null> {
    const values = this.columns.map((col) => entity[col]);
    const placeholders = this.columns.map(() => '?').join(', ');
    const columns = this.columns.map((col) => `\`${String(col)}\``).join(', ');

    const sql = `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders})`;
    return executeQuery(sql, values);
  }

  async updateEntity(entity: T): Promise<QueryResult | null> {
    const setColumns = this.columns.filter((col) => !this.isPrimaryKey(col));
    const setClause = setColumns.map((col) => `\`${String(col)}\` = ?`).join(', ');

    const setValues = setColumns.map((col) => entity[col]);

    const whereClause = this.getWhereClauseFromKeys(this.primaryKey);
    const keyValues = this.getKeyValues(entity);

    const sql = `UPDATE ${this.tableName} SET ${setClause} WHERE ${whereClause}`;

    return executeQuery(sql, [...setValues, ...keyValues]);
  }

  private isPrimaryKey(col: keyof T): boolean {
    if (Array.isArray(this.primaryKey)) {
      return this.primaryKey.includes(col);
    }
    return col === this.primaryKey;
  }
}

export default BaseRepository;
