import dotenv from 'dotenv';
import pool from './infrastructure/database/conection.js';

dotenv.config();

pool.getConnection((error, connection) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Conexão com o banco de dados bem sucedida');
  }
  connection.release();
});
