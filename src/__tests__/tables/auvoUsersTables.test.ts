import dotenv from 'dotenv';
dotenv.config({ path: 'test.env' });

import definitionDb from '../../infrastructure/database/definitionDb.ts';
import { pool } from '../../infrastructure/database/conection.ts';
// import executeQuery from '../../infrastructure/database/queries.ts';

(async () => {
  beforeAll(async () => {
    await definitionDb.init();
  });

  afterAll(async () => {
    if (pool) {
      await pool.end();
    }
  });

  // describe('Teste de conexão com o banco de dados', () => {
  //   it('Deve conectar ao banco de dados', async () => {
  //     const sql: string = 'show tables';
  //     const result = await executeQuery(sql);
  //     expect(result).toBe('foo');
  //   });
  // });
})();
