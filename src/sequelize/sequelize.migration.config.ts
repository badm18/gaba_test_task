const connection = {
  dialect: 'postgres' as const,
  host: process.env.POSTGRES_HOST!,
  port: process.env.POSTGRES_PORT!,
  database: process.env.POSTGRES_DB!,
  username: process.env.POSTGRES_USER!,
  password: process.env.POSTGRES_PASSWORD!,
}

module.exports = {
  development: connection,
  test: connection,
  production: connection,
}
