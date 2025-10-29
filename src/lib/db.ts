import mysql from 'mysql2/promise'

type MySqlPool = mysql.Pool

declare global {
  // eslint-disable-next-line no-var
  var mysqlPool: MySqlPool | undefined
}

const getRequiredEnv = (key: 'DB_HOST' | 'DB_USER' | 'DB_PASSWORD' | 'DB_NAME'): string => {
  const value = process.env[key]

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }

  return value
}

const createPool = () =>
  mysql.createPool({
    host: getRequiredEnv('DB_HOST'),
    user: getRequiredEnv('DB_USER'),
    password: getRequiredEnv('DB_PASSWORD'),
    database: getRequiredEnv('DB_NAME'),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    namedPlaceholders: true,
    charset: 'utf8mb4',
  })

const pool = globalThis.mysqlPool ?? createPool()

if (process.env.NODE_ENV !== 'production') {
  globalThis.mysqlPool = pool
}

export default pool
export { pool }
