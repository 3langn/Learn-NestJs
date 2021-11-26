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
    accessExpiration: process.env.JWT_ACCESS_EXPIRATION,
    refreshExpiration: process.env.JWT_REFRESH_EXPIRATION,
    jwtVerifyEmailExpiration: process.env.JWT_VERIFY_EMAIL_EXPIRATION,
    secret: process.env.JWT_SECRET_KEY,
    resetPasswordExpiration: process.env.JWT_RESET_PASSWORD_EXPIRATION,
  },
  host: {
    url: process.env.HOST_URL,
  },
  email: {
    host: process.env.EMAIL_HOST,
  },
});
