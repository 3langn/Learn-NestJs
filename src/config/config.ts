export const config = () => ({
  port: process.env.PORT || 3000,
  database: {
    type: 'mysql',
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    autoLoadEntities: true,
    synchronize: true,
  },
  jwt: {
    accessExpirationMinutes: process.env.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: process.env.JWT_REFRESH_EXPIRATION_DAYS,
    jwtVerifyEmailExpirationMinutes:
      process.env.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
    secret: process.env.JWT_SECRET_KEY,
  },
});
