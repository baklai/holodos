const Product = require('../models/product.model');

const paginate = async (categoryID, page = 1) => {
  return await Product.paginate(
    { category: categoryID },
    {
      select: 'img title pricePer priceTitle category',
      populate: 'category',
      page: page,
      leanWithId: true,
      limit: 5
    }
  );
};

const findAll = async (categoryID) => {
  return await Product.find(
    { category: categoryID },
    'img title pricePer priceTitle'
  ).populate('category', 'title');
};

const findOne = async (id) => {
  return await Product.findById(id);
};

const createOne = async (item) => {
  return await Product.create(item);
};

const updateOne = async (id, data) => {
  return await Product.findByIdAndUpdate(id, { $set: { ...data } });
};

const removeOne = async (id) => {
  return await Product.deleteOne({ _id: id });
};

module.exports = {
  paginate,
  findAll,
  findOne,
  createOne,
  updateOne,
  removeOne
};
