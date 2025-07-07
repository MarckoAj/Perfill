import { QueryResult } from '../infrastructure/database/queries.ts';

abstract class BaseModel<U, T extends object> {
  protected abstract repository: {
    selectById: (id: number) => Promise<T | null>;
    update: (data: T) => Promise<QueryResult | null>;
    insert: (data: T) => Promise<QueryResult | null>;
  };

  protected abstract mapToDatabaseFormat(entity: U): T;

  protected abstract mainKey: keyof T;

  showMainKey() {
    console.log(this.mainKey);
  }

  protected getId(entity: T): number {
    const value = entity[this.mainKey];
    if (typeof value !== 'number') {
      throw new Error(`A chave '${String(this.mainKey)}' não é numérica ou está ausente.`);
    }
    return value;
  }

  async synchronize(entity: U): Promise<QueryResult | null> {
    const refactoredEntity = this.mapToDatabaseFormat(entity);
    const id = this.getId(refactoredEntity);
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
