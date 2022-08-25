const User = require('../models/user.model');

const findAll = async () => {
  return await User.find({}, 'userID firstName lastName userName');
};

const createOne = async (item) => {
  return await User.findOneAndUpdate(
    {
      userID: item.userID
    },
    {
      $set: {
        userID: item.userID,
        firstName: item.firstName,
        lastName: item.lastName,
        userName: item.userName
      }
    },
    { new: true, upsert: true }
  );
};

module.exports = { findAll, createOne };
