const User = require('../models/user.model');

const findAll = async () => {
  return User.find({});
};

const createOne = async (data) => {
  return User.findOneAndUpdate(
    {
      chat_id: data.id
    },
    {
      $set: {
        chat_id: data.id,
        first_name: data.first_name,
        last_name: data.last_name,
        username: data.username
      }
    },
    { new: true, upsert: true }
  );
};

module.exports = { findAll, createOne };
