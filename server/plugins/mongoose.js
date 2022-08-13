module.exports = (schema, options) => {
  schema.set('autoCreate', false);
  schema.set('versionKey', false);
  schema.set('timestamps', true);

  schema.virtual('id').get(function () {
    return this._id;
  });

  schema.virtual('created').get(function () {
    return this.createdAt;
  });

  schema.virtual('updated').get(function () {
    return this.updatedAt;
  });

  schema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret, options) {
      delete ret._id;
      delete ret.updatedAt;
      delete ret.createdAt;
    }
  });

  schema.set('toObject', {
    virtuals: true,
    transform: function (doc, ret, options) {
      delete ret._id;
      delete ret.updatedAt;
      delete ret.createdAt;
    }
  });
};
