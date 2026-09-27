import { Pool, types } from 'pg';

// DECIMAL/NUMERIC se devuelve como numero y DATE como texto (YYYY-MM-DD)
types.setTypeParser(1700, (valor) => parseFloat(valor));
types.setTypeParser(1082, (valor) => valor);

// Configuracion de conexion a PostgreSQL (contenedor Docker)
export const pool = new Pool({
  host: 'localhost',
  port: 5433,
  database: 'VeterinariaDB',
  user: 'postgres',
  password: 'Veterinaria2026*',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
