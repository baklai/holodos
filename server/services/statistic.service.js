const User = require('../models/user.model');
const Category = require('../models/category.model');
const Product = require('../models/product.model');

const statAll = async () => {
  const users = await User.countDocuments();
  const categories = await Category.countDocuments();
  const products = await Product.countDocuments();
  return { users, categories, products };
};

module.exports = { statAll };
