import mysql, { PoolOptions } from 'mysql2/promise'; // Use mysql2/promise para suporte a Promises
import dotenv from 'dotenv';

dotenv.config();
const DBHOST: string = process.env.DBHOST || 'localhost';
const DBPORT: number = +(process.env.DBPORT || 3306);
const DBUSER: string = process.env.DBUSER || 'root';
const DBPASS: string = process.env.DBPASS || 'Perfill0102@';
const DBNAME: string = process.env.DBNAME || 'perfillDb';

console.log(DBHOST);
console.log(DBPORT);
console.log(DBUSER);
console.log(DBPASS);
console.log(DBNAME);

const localConfig: PoolOptions = {
  connectionLimit: 100,
  host: DBHOST,
  port: DBPORT,
  user: DBUSER,
  password: DBPASS,
  database: DBNAME,
};

const pool = mysql.createPool(localConfig);

export default pool;
