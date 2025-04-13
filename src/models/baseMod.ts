import { QueryResult } from '../infrastructure/database/queries.ts';

abstract class BaseModel<T extends object, U> {
  protected abstract repository: {
    selectById: (id: number) => Promise<U | null>;
    update: (data: U) => Promise<QueryResult | null>;
    insert: (data: U) => Promise<QueryResult | null>;
  };

  protected abstract mapToDatabaseFormat(entity: T): U;

  constructor(protected mainKey: keyof T) {}

  protected getId(entity: T): number {
    const value = entity[this.mainKey];
    if (typeof value !== 'number') {
      throw new Error(`A chave '${String(this.mainKey)}' não é numérica ou está ausente.`);
    }
    return value;
  }

  async synchronize(entity: T): Promise<QueryResult | null> {
    const refactoredEntity = this.mapToDatabaseFormat(entity);
    const id = this.getId(entity);
    try {
      const entityInDatabase = await this.repository.selectById(id);
      return entityInDatabase
        ? this.repository.update(refactoredEntity)
        : this.repository.insert(refactoredEntity);
    } catch (error) {
      console.error(
        `Erro ao sincronizar entidade: ${error instanceof Error ? error.message : error}`,
      );
      return null;
    }
  }

  async addList(list: T[]): Promise<(QueryResult | null)[]> {
    return Promise.all(list.map((entity) => this.synchronize(entity))).catch((error) => {
      console.error(
        `Erro ao adicionar lista de entidades: ${error instanceof Error ? error.message : error}`,
      );
      return list.map(() => null);
    });
  }
}

export default BaseModel;
