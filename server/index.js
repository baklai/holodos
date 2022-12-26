const express = require('express');
const mongoose = require('mongoose');

const { MONGO, TOKEN } = process.env;

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

const bot = require('./holodos');
const Category = require('./services/category.service');
const Product = require('./services/product.service');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

module.exports = app;
