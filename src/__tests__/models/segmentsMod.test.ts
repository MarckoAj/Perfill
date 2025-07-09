import dotenv from 'dotenv';
dotenv.config({ path: 'test.env' });

import definitionDb from '../../infrastructure/database/definitionDb.ts';
import { pool } from '../../infrastructure/database/connection.ts';
import segmentsMod from '../../models/segmentsMod.ts';
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

  describe('Verifica se as informações dos Segmentos da plataforma Auvo estão sendo armazenadas', () => {
    const newSegment = {
      id: 999,
      description: 'NovoSegmento',
      registrationDate: null,
    };

    it('Segmento da plataforma Auvo deve ser adicionado no banco de dados', async () => {
      const result = (await segmentsMod.synchronize(newSegment)) as ResultSetHeader;
      expect(isResultSetHeader(result)).toBeTruthy();
    });

    it('Deve selecionar segmento pelo ID', async () => {
      const result = await segmentsMod.selectById(newSegment.id);
      expect(result).toEqual({
        segmentId: newSegment.id,
        description: newSegment.description,
        registrationDate: null,
      });
    });

    it('Deve atualizar segmento pelo ID', async () => {
      await segmentsMod.synchronize({
        ...newSegment,
        description: 'DescriçãoAtualizada',
      });
      const entity = await segmentsMod.selectById(999);
      expect(entity).toEqual({
        segmentId: newSegment.id,
        description: 'DescriçãoAtualizada',
        registrationDate: null,
      });
    });
  });
})();
