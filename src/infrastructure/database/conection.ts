import mysql, { Pool, PoolOptions } from 'mysql2/promise';

let pool: Pool | null = null;

const getPool = (): Pool => {
  if (!pool) {
    const DBHOST: string = process.env.DBHOST || 'localhost';
    const DBPORT: number = +(process.env.DBPORT || 3306);
    const DBUSER: string = process.env.DBUSER || 'root';
    const DBPASS: string = process.env.DBPASS || 'Perfill0102@';
    const DBNAME: string = process.env.DBNAME || 'perfillDb';

    const localConfig: PoolOptions = {
      connectionLimit: 50,
      host: DBHOST,
      port: DBPORT,
      user: DBUSER,
      password: DBPASS,
      database: DBNAME,
    };

    pool = mysql.createPool(localConfig);
  }
  return pool;
};

export { pool, getPool };
