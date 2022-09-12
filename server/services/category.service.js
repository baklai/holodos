const Category = require('../models/category.model');
const Product = require('../models/product.model');

const paginate = async (page = 1, catalog = 'holodos') => {
  return await Category.paginate(
    { catalog },
    { select: 'title', page: page, limit: 5 }
  );
};

const findAll = async (catalog = 'holodos') => {
  return await Category.find({ catalog }, 'icon title');
};

const findOne = async (id) => {
  return await Category.findById(id);
};

const createOne = async (item) => {
  return await Category.create(item);
};

const updateOne = async (id, data) => {
  return await Category.findByIdAndUpdate(id, { $set: { ...data } });
};

const removeOne = async (id) => {
  const isDeleted = await Category.deleteOne({ _id: id });
  if (isDeleted) {
    await Product.deleteMany({ category: id });
  }
  return isDeleted;
};

module.exports = {
  paginate,
  findAll,
  findOne,
  createOne,
  updateOne,
  removeOne
};
