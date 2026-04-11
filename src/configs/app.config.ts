import * as process from "node:process";

const config = () => ({
  app: {
    port: Number(process.env.APP_PORT) || 3000,
  },
  postgres: {
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    db: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    statementTimeout: Number(process.env.POSTGRES_STATEMENT_TIMEOUT),
    poolMax: Number(process.env.POSTGRES_POOL_MAX),
    poolMin: Number(process.env.POSTGRES_POOL_MIN),
  },
})

export default config

export type AppConfig = ReturnType<typeof config>
