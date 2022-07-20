const Сatalog = require('../models/catalog.model');

const allСatalog = async () => {
  return Сatalog.find({}, 'category');
};

const oneСatalog = async (id) => {
  return Сatalog.findById(id);
};

const createMany = async (data) => {
  return Сatalog.insertMany(data);
};

module.exports = { allСatalog, oneСatalog };
