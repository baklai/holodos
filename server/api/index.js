const Middleware = require('./src/middleware');
const commands = require('./src/commands');
const notification = require('./src/notification');
const paginate = require('./src/paginate');
const categories = require('./src/categories');
const products = require('./src/products');

class API extends Middleware {
  constructor(bot, TOKEN, WEB_APP) {
    super(bot, TOKEN, WEB_APP);
  }
}

Object.assign(
  API.prototype,
  commands,
  notification,
  paginate,
  categories,
  products
);

module.exports = API;
