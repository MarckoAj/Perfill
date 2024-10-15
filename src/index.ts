import dotenv from 'dotenv';
import pool from './infrastructure/database/conection.js';
import definitionDb from './infrastructure/database/definitionDb.js';

dotenv.config();

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Conexão com o banco de dados bem sucedida');

    connection.release();
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
  }
}

try {
  await definitionDb.createTables();
} catch (error) {
  console.log(error);
}

testConnection();
