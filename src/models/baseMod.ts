import { QueryResult } from '../infrastructure/database/queries.ts';
import BaseRepository from '../repositories/baseRep.ts';

abstract class BaseModel<U, T extends object> {
  protected abstract repository: BaseRepository<T>;
  protected abstract mapToDatabaseFormat(entity: U): T;
  protected abstract mainKey: keyof T;

  protected getId(entity: T): number {
    const value = entity[this.mainKey];
    if (typeof value !== 'number') {
      throw new Error(`A chave '${String(this.mainKey)}' não é numérica ou está ausente.`);
    }
    return value;
  }

  async selectById(id: number, fields?: (keyof T)[]): Promise<unknown> {
    const alowedFields = this.repository.getAllowedsFields();
    const fieldList = fields?.length ? fields.filter((k) => alowedFields.includes(k)) : [];
    const entity = await this.repository.selectById(id, fieldList);
    return entity;
  }

  async synchronize(entity: U): Promise<QueryResult | null> {
    const refactoredEntity = this.mapToDatabaseFormat(entity);
    const id = this.getId(refactoredEntity);
    try {
      const entityInDatabase = await this.repository.selectById(id);
      return entityInDatabase
        ? this.repository.updateEntity(refactoredEntity)
        : this.repository.insertEntity(refactoredEntity);
    } catch (error) {
      console.error(
        `Erro ao sincronizar entidade: ${error instanceof Error ? error.message : error}`,
      );
      return null;
    }
  }

  async addList(list: U[]): Promise<(QueryResult | null)[]> {
    return Promise.all(list.map((entity) => this.synchronize(entity))).catch((error) => {
      console.error(
        `Erro ao adicionar lista de entidades: ${error instanceof Error ? error.message : error}`,
      );
      return list.map(() => null);
    });
  }
}

export default BaseModel;
