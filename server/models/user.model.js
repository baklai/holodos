const { model, Schema } = require('mongoose');

const userSchema = new Schema(
  {
    userID: {
      type: String,
      unique: 'ID користувача має бути унікальним',
      required: "ID користувача має бути обов'язково"
    },
    firstName: {
      type: String,
      trim: true,
      default: null
    },
    lastName: {
      type: String,
      trim: true,
      default: null
    },
    userName: {
      type: String,
      trim: true,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = model('user', userSchema);
