require('dotenv').config();
global.config = require('./config').get(process.env.AMBIENTE);
