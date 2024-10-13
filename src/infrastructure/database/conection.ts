import mysql, { PoolConfig } from 'mysql';

const DBHOST: string = process.env.DBHOST || 'localhost';
const DBPORT: number = +(process.env.DBPORT || 3306);
const DBUSER: string = process.env.DBUSER || 'root';
const DBPASS: string = process.env.DBPASS || 'Perfill0102@';
const DBNAME: string = process.env.DBNAME || 'auvodb';

const localConfig: PoolConfig = {
  connectionLimit: 100,
  host: DBHOST,
  port: DBPORT,
  user: DBUSER,
  password: DBPASS,
  database: DBNAME,
};

const pool = mysql.createPool(localConfig);

export default pool;
