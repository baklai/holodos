const { model, Schema } = require('mongoose');

const catalogSchema = new Schema(
  {
    category: {
      type: String,
      trim: true,
      unique: true,
      required: 'Category must is required'
    },
    products: {
      type: [
        {
          img: {
            type: String,
            trim: true
          },
          title: {
            type: String,
            trim: true
          },
          price: {
            type: Number,
            default: 0
          },
          priceTitle: {
            type: String,
            trim: true
          },
          counter: {
            type: Number,
            default: 0
          }
        }
      ],
      default: []
    }
  },
  {
    timestamps: true
  }
);

module.exports = model('catalog', catalogSchema);
