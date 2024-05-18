const PORT = 3000;
const HOST = 'localhost';
const MONGO_URI = 'mongodb://localhost:27017/holodos';

export default () => ({
  HOST: process.env.HOST || HOST,
  PORT: parseInt(process.env.PORT, 10) || PORT,
  DONATE_URI: process.env.DONATE_URI,
  MONGO_URI: process.env.MONGO_URI || MONGO_URI,
  BOT_TOKEN: process.env.BOT_TOKEN,
  WEB_APP: process.env.WEB_APP
});