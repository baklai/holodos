const User = require('../models/user.model');

const findAll = async () => {
  return await User.find({}, 'userID firstName lastName userName');
};

const findOne = async (id) => {
  return await User.findOne({ userID: id });
};

const createOne = async (item) => {
  return await User.findOneAndUpdate(
    {
      userID: item.userID
    },
    {
      $set: { ...item }
    },
    { new: true, upsert: true }
  );
};

const removeOne = async (id) => {
  return await User.deleteOne({ _id: id });
};

module.exports = { findAll, findOne, createOne, removeOne };
