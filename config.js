require('dotenv').config();

const ambiente = (process.env.AMBIENTE || 'DEV').toLowerCase();

const config = {
    dev: {
        url: process.env.URL_DEV || "http://localhost",
        port: Number(process.env.PORT_DEV) || 3000,
        ambiente: "DEV",
        database: {
            host: process.env.DATABASE_HOST_DEV,
            port: process.env.DATABASE_PORT_DEV,
            user: process.env.DATABASE_USER_DEV,
            password: process.env.DATABASE_PASSWORD_DEV,
            database: process.env.DATABASE_NAME_DEV
        },
        jwt_secret: process.env.JWT_SECRET_DEV
    },
    prod: {
        url: process.env.URL_PROD,
        port: Number(process.env.PORT_PROD),
        ambiente: "PROD",
        database: {
            host: process.env.DATABASE_HOST_PROD,
            port: process.env.DATABASE_PORT_PROD,
            user: process.env.DATABASE_USER_PROD,
            password: process.env.DATABASE_PASSWORD_PROD,
            database: process.env.DATABASE_NAME_PROD 
        },
        jwt_secret: process.env.JWT_SECRET_PROD
    }
};

module.exports = ambiente === 'dev' ? config.dev : config.prod;
