const Middleware = require('./src/middleware');
const admin = require('./src/admin');
const update = require('./src/update');
const commands = require('./src/commands');
const notification = require('./src/notification');
const paginate = require('./src/paginate');
const categories = require('./src/categories');
const products = require('./src/products');

class API extends Middleware {
  constructor(bot, TOKEN, SECRET, WEB_APP, PAYEE) {
    super(bot);

    this.PAYEE = PAYEE;
    this.SECRET = SECRET;
    this.TOKEN = TOKEN;
    this.WEB_APP = WEB_APP;
  }
}

Object.assign(
  API.prototype,
  admin,
  update,
  commands,
  notification,
  paginate,
  categories,
  products
);

module.exports = API;
