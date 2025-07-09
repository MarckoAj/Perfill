import dotenv from 'dotenv';
dotenv.config({ path: 'test.env' });

import definitionDb from '../../infrastructure/database/definitionDb.ts';
import { pool } from '../../infrastructure/database/connection.ts';
import usersMod from '../../models/usersMod.ts';
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

  describe('Verifica se as informações dos Usuários da plataforma Auvo estão sendo armazenadas', () => {
    const newAuvouser = {
      userType: { userTypeId: 1 },
      name: 'NovoUsuario',
      userID: 999,
    };

    it('Usuário da plataforma Auvo deve ser adicionado no banco de dados', async () => {
      const result = (await usersMod.synchronize(newAuvouser)) as ResultSetHeader;
      expect(isResultSetHeader(result)).toBeTruthy();
    });

    it('Deve selecionar usuário pelo ID', async () => {
      const user = await usersMod.selectById(newAuvouser.userID, ['name', 'userId']);
      expect(user).toEqual({
        userId: newAuvouser.userID,
        name: newAuvouser.name,
      });
    });

    it('Deve atualizar usuário pelo ID', async () => {
      await usersMod.synchronize({ ...newAuvouser, name: 'NomeAtualizado' });
      const entity = await usersMod.selectById(newAuvouser.userID, ['name', 'userId']);
      expect(entity).toEqual({
        userId: newAuvouser.userID,
        name: 'NomeAtualizado',
      });
    });
  });
})();
