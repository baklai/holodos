const { model, Schema } = require('mongoose');

const productSchema = new Schema({
  img: {
    type: Buffer,
    required: 'Фото товара должно быть обязательно'
  },
  title: {
    type: String,
    trim: true,
    required: "Фото товару має бути обов'язковим"
  },
  pricePer: {
    type: Number,
    default: 0,
    required: "Вартість товару має бути обов'язково"
  },
  priceTitle: {
    type: String,
    trim: true,
    required: "Розмірність товару має бути обов'язково"
  },
  category: {
    type: Schema.Types.ObjectId,
    required: "Категорія товару має бути обов'язково",
    ref: 'category'
  }
});

productSchema.virtual('count').get(function () {
  return 0;
});

module.exports = model('product', productSchema);
