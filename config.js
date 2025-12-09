
require('dotenv').config();

const config = {
    dev: {
        url: process.env.URL_DEV || "http://localhost",
        port: process.env.PORT_DEV || 3000,
        ambiente: process.env.AMBIENTE || "DEV",
        database: {
            host: process.env.DATABASE_HOST_DEV || "localhost",
            port: process.env.DATABASE_PORT_DEV || 3306,
            user: process.env.DATABASE_USER_DEV || "root",
            password: process.env.DATABASE_PASSWORD_DEV || "admin",
            database: process.env.DATABASE_NAME_DEV || "pedioon"
        }
    },
    prod: {
        url: process.env.URL_PROD,
        port: process.env.PORT_PROD,
        ambiente: "PROD",
        database: {
            host: process.env.DATABASE_HOST_PROD,
            port: process.env.DATABASE_PORT_PROD,
            user: process.env.DATABASE_USER_PROD,
            password: process.env.DATABASE_PASSWORD_PROD,
            database: process.env.DATABASE_NAME_PROD
        }
    }
};

exports.get = function get(ambiente) {
    if (ambiente.toLowerCase() === "dev") {
        return config.dev;
    } else {
        return config.prod;
    }
};