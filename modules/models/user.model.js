const { model, Schema } = require('mongoose');

const userSchema = new Schema(
  {
    chat_id: {
      type: String,
      trim: true,
      unique: true,
      required: 'Chat ID must is required'
    },
    first_name: {
      type: String,
      trim: true,
      default: ''
    },
    last_name: {
      type: String,
      trim: true,
      default: ''
    },
    username: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = model('user', userSchema);
