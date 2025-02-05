import dotenv from 'dotenv';
import { getPool } from './infrastructure/database/connection.ts';
import definitionDb from './infrastructure/database/definitionDb.js';

dotenv.config();

async function testConnection(): Promise<boolean> {
  try {
    const pool = getPool();
    const connection = await pool.getConnection();
    console.log('Conexão com o banco de dados bem sucedida');
    connection.release();
    return true;
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
    return false;
  }
}

async function main() {
  const connectionSuccess = await testConnection();

  if (connectionSuccess) {
    try {
      await definitionDb.init();
      console.log('Tabelas criadas com sucesso');
    } catch (error) {
      console.error('Erro ao criar tabelas:', error);
    }
  } else {
    console.error('Conexão ao banco de dados falhou. Criação de tabelas não executada.');
  }
}

main();
