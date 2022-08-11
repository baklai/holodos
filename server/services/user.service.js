const User = require('../models/user.model');

const findAll = async () => {
  return await User.find({});
};

const createOne = async (item) => {
  return await User.findOneAndUpdate(
    {
      userID: item.id
    },
    {
      $set: {
        userID: item.id,
        firstName: item.first_name,
        lastName: item.last_name,
        userName: item.username
      }
    },
    { new: true, upsert: true }
  );
};

module.exports = { findAll, createOne };
