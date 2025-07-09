import dotenv from 'dotenv';
dotenv.config({ path: 'test.env' });

import definitionDb from '../../infrastructure/database/definitionDb.ts';
import { pool } from '../../infrastructure/database/connection.ts';
import groupsMod from '../../models/groupsMod.ts';
import { ResultSetHeader } from 'mysql2';
import { clearDbTables, isResultSetHeader } from '../../utils/testsDbfunctions.ts';

(async () => {
  let originalDBName: string | undefined;

  beforeAll(async () => {
    originalDBName = process.env.DBNAME;
    await definitionDb.createTables();
    await definitionDb.seedData();
  });

  afterAll(async () => {
    process.env.DBNAME = originalDBName;
    await clearDbTables(process.env.DBNAME as string);

    if (pool) {
      await pool.end();
    }
  });

  describe('Verifica se as informações dos Grupos da plataforma Auvo estão sendo armazenados', () => {
    const newGroup = {
      id: 999,
      description: 'NovoGupo',
    };

    it('Grupo da plataforma Auvo deve ser adicionado no banco de dados', async () => {
      const result = (await groupsMod.synchronize(newGroup)) as ResultSetHeader;
      expect(isResultSetHeader(result)).toBeTruthy();
    });

    it('Deve selecionar grupo pelo ID', async () => {
      const result = await groupsMod.selectById(newGroup.id);
      expect(result).toEqual({
        groupId: newGroup.id,
        description: newGroup.description,
      });
    });

    it('Deve atualizar grupo pelo ID', async () => {
      await groupsMod.synchronize({ ...newGroup, description: 'DescriçãoAtualizada' });
      const entity = await groupsMod.selectById(999);
      expect(entity).toEqual({
        groupId: newGroup.id,
        description: 'DescriçãoAtualizada',
      });
    });
  });
})();
