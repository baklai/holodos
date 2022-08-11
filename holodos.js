const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
  path:
    process.env.NODE_ENV === 'production'
      ? path.join(__dirname, '.env.prod')
      : path.join(__dirname, '.env.dev')
});

const app = require('./server');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.info('Express server is listening');
});
