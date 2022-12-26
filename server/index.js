const http = require('http');
const path = require('path');
const dotenv = require('dotenv');
const compression = require('compression');
const express = require('express');
const mongoose = require('mongoose');

dotenv.config({
  path:
    process.env.NODE_ENV === 'production'
      ? path.join(__dirname, '..', '.env.prod')
      : path.join(__dirname, '..', '.env.dev')
});

const { MONGO, TOKEN, HOST, PORT } = process.env;

mongoose.set('strictQuery', false);

mongoose.plugin(require('./plugins/mongoose'));
mongoose.plugin(require('mongoose-paginate'));

mongoose
  .connect(MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.info('Success MongoDB connected');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(0);
  });

const bot = require('./lib/holodos');
const Category = require('./services/category.service');
const Product = require('./services/product.service');

const app = express();

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'client')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', '200.html'));
});

app.post(`/bot${TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

app.get('/category', async (req, res, next) => {
  try {
    const items = await Category.findAll(req.query.catalog);
    res.status(200).json(items);
  } catch (err) {
    next(err);
  }
});

app.get('/category/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const items = await Product.findAll(id);
    res.status(200).json(items);
  } catch (err) {
    next(err);
  }
});

app.use((req, res, next) => {
  res.status(404).json({ message: 'Oops! Error 404 has occurred' });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: 'Oops! Internal server error' });
});

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});
