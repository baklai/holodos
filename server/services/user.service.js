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

module.exports = { findAll, findOne, createOne };
