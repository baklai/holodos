const PORT = 3000;
const HOST = '0.0.0.0';
const SECRET = '4EfVKy5nXIXgD6fNk2ssI';
const DONATE = 'http://localhost:3000';
const MONGO_URI = 'mongodb://localhost:27017/holodos';

export default () => ({
  HOST: process.env.HOST || HOST,
  PORT: parseInt(process.env.PORT, 10) || PORT,
  SECRET: process.env.SECRET || SECRET,
  DONATE: process.env.DONATE || DONATE,
  MONGO_URI: process.env.MONGO_URI || MONGO_URI,
  BOT_TOKEN: process.env.BOT_TOKEN,
  WEB_APP: process.env.WEB_APP,
  PROXY: process.env.PROXY || null
});
