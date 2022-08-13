const { model, Schema } = require('mongoose');

const categorySchema = new Schema({
  title: {
    type: String,
    trim: true,
    required: "Назва категорії товарів має бути обов'язковою"
  }
});

module.exports = model('category', categorySchema);