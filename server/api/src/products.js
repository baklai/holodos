const axios = require('axios');
const sharp = require('sharp');

const Category = require('../../services/category.service');
const Product = require('../../services/product.service');

const products = {
  async ['/products'](ctx) {
    let message = this.t(ctx.lang, 'bot:oops');
    let reply_markup = null;
    try {
      const categories = await Category.paginate(ctx.action.paginate.page);
      if (categories.docs.length) {
        message =
          `${this.t(ctx.lang, 'product:read')}` +
          `${this.t(ctx.lang, 'bot:cancel')}`;
        reply_markup = {
          inline_keyboard: categories.docs.map((item) => [
            {
              text: item.title,
              callback_data: JSON.stringify({
                id: item.id,
                cb: 'p:r:s-c'
              })
            }
          ])
        };
        reply_markup.inline_keyboard.push(
          this.initPaginate(ctx, categories.page, categories.pages)
        );
      } else {
        reply_markup = null;
        this.deleteAction(ctx.chatID);
        message = this.t(ctx.lang, 'category:oops');
      }
    } catch (err) {
      reply_markup = null;
      this.deleteAction(ctx.chatID);
      message = this.t(ctx.lang, 'bot:error %s', err.message);
    } finally {
      if (ctx.isPaginate) {
        this.bot.editMessageText(message, {
          chat_id: ctx.chatID,
          message_id: ctx.messageID,
          reply_markup: reply_markup,
          parse_mode: 'HTML'
        });
      } else {
        this.bot.sendMessage(ctx.chatID, message, {
          parse_mode: 'HTML',
          reply_markup: reply_markup
        });
      }
    }
  },

  async ['p:r:s-c'](ctx) {
    let message = this.t(ctx.lang, 'category:oops');
    let reply_markup = null;
    try {
      this.setActionType(ctx.chatID, 'p:r:s-c');
      ctx.action.obj.category = ctx.action.obj.category || ctx.data.id;
      const category = await Category.findOne(ctx.action.obj.category);
      const products = await Product.paginate(
        ctx.action.obj.category,
        ctx.action.paginate.page
      );
      if (products.docs.length) {
        message = this.t(
          ctx.lang,
          'product:read:select-category %s',
          category.title
        );
        products.docs.forEach((item, index) => {
          message += `<b>${
            index + 1 + (ctx.action.paginate.page - 1) * this.LIMIT
          }.</b> <i>${item.title} - ${item.pricePer} ${item.priceTitle}</i>\n`;
        });
        message +=
          `\n${this.t(ctx.lang, 'bot:help')}` +
          `${this.t(ctx.lang, 'bot:cancel')}`;
        reply_markup = {
          inline_keyboard: [
            this.initPaginate(ctx, products.page, products.pages)
          ]
        };
      } else {
        reply_markup = null;
        this.deleteAction(ctx.chatID);
        message = this.t(ctx.lang, 'product:oops');
      }
    } catch (err) {
      reply_markup = null;
      this.deleteAction(ctx.chatID);
      message = this.t(ctx.lang, 'bot:error %s', err.message);
    } finally {
      this.bot.editMessageText(message, {
        chat_id: ctx.chatID,
        message_id: ctx.messageID,
        reply_markup: reply_markup,
        parse_mode: 'HTML'
      });
    }
  }
};

const newProduct = {
  async ['/newproduct'](ctx) {
    let message = this.t(ctx.lang, 'bot:oops');
    let reply_markup = null;
    try {
      const categories = await Category.paginate(ctx.action.paginate.page);
      if (categories.docs.length) {
        message =
          this.t(ctx.lang, 'product:create') + this.t(ctx.lang, 'bot:cancel');
        reply_markup = {
          inline_keyboard: categories.docs.map((item) => [
            {
              text: item.title,
              callback_data: JSON.stringify({
                id: item.id,
                cb: 'p:c:s-c'
              })
            }
          ])
        };
        reply_markup.inline_keyboard.push(
          this.initPaginate(ctx, categories.page, categories.pages)
        );
      } else {
        reply_markup = null;
        this.deleteAction(ctx.chatID);
        message = this.t(ctx.lang, 'category:oops');
      }
    } catch (err) {
      reply_markup = null;
      this.deleteAction(ctx.chatID);
      message = this.t(ctx.lang, 'bot:error %s', err.message);
    } finally {
      if (ctx.isPaginate) {
        this.bot.editMessageText(message, {
          chat_id: ctx.chatID,
          message_id: ctx.messageID,
          reply_markup: reply_markup,
          parse_mode: 'HTML'
        });
      } else {
        this.bot.sendMessage(ctx.chatID, message, {
          parse_mode: 'HTML',
          reply_markup: reply_markup
        });
      }
    }
  },

  async ['p:c:s-c'](ctx) {
    let message = this.t(ctx.lang, 'bot:oops');
    try {
      const category = await Category.findOne(ctx.data.id);
      ctx.action.obj.category = category.id;
      this.setActionType(ctx.chatID, 'product:create:title');
      message =
        this.t(ctx.lang, 'product:create:select-category %s', category.title) +
        this.t(ctx.lang, 'bot:cancel');
    } catch (err) {
      this.deleteAction(ctx.chatID);
      message = this.t(ctx.lang, 'bot:error %s', err.message);
    } finally {
      this.bot.editMessageText(message, {
        chat_id: ctx.chatID,
        message_id: ctx.messageID,
        reply_markup: null,
        parse_mode: 'HTML'
      });
    }
  },

  async ['product:create:title'](ctx) {
    let message = this.t(ctx.lang, 'bot:oops');
    let reply_markup = null;
    try {
      ctx.action.obj.title = ctx.text;
      message =
        this.t(ctx.lang, 'product:create:title %s', ctx.text) +
        `${this.t(ctx.lang, 'bot:cancel')}:`;
      reply_markup = {
        inline_keyboard: [
          [
            {
              text: 'грн/шт',
              callback_data: JSON.stringify({
                cb: 'p:c:i-p-t',
                key: 'грн/шт'
              })
            },
            {
              text: 'грн/кг',
              callback_data: JSON.stringify({
                cb: 'p:c:i-p-t',
                key: 'грн/кг'
              })
            },
            {
              text: 'грн/літр',
              callback_data: JSON.stringify({
                cb: 'p:c:i-p-t',
                key: 'грн/літр'
              })
            }
          ]
        ]
      };
    } catch (err) {
      reply_markup = null;
      this.deleteAction(ctx.chatID);
      message = this.t(ctx.lang, 'bot:error %s', err.message);
    } finally {
      this.bot.sendMessage(ctx.chatID, message, {
        parse_mode: 'HTML',
        reply_markup: reply_markup
      });
    }
  },

  async ['p:c:i-p-t'](ctx) {
    let message = this.t(ctx.lang, 'bot:oops');
    try {
      ctx.action.obj.priceTitle = ctx.data.key;
      message =
        this.t(
          ctx.lang,
          'product:create:price-title %s',
          ctx.action.obj.priceTitle
        ) + this.t(ctx.lang, 'bot:cancel');
      this.setActionType(ctx.chatID, 'product:create:price-per');
    } catch (err) {
      this.deleteAction(ctx.chatID);
      message = this.t(ctx.lang, 'bot:error %s', err.message);
    } finally {
      this.bot.editMessageText(message, {
        chat_id: ctx.chatID,
        message_id: ctx.messageID,
        parse_mode: 'HTML'
      });
    }
  },

  async ['product:create:price-per'](ctx) {
    let message = this.t(ctx.lang, 'bot:oops');
    let reply_markup = null;
    try {
      ctx.action.obj.pricePer = Number(ctx.text);
      message =
        this.t(ctx.lang, 'product:create:price-per %s', ctx.text) +
        this.t(ctx.lang, 'bot:cancel');
      this.setActionType(ctx.chatID, 'product:create:img');
    } catch (err) {
      this.deleteAction(ctx.chatID);
      message = this.t(ctx.lang, 'bot:error %s', err.message);
    } finally {
      this.bot.sendMessage(ctx.chatID, message, {
        parse_mode: 'HTML',
        reply_markup
      });
    }
  },

  async ['product:create:img'](ctx) {
    let fileID = null;
    if (ctx.photo) {
      fileID = ctx.photo[ctx.photo.length - 1].file_id;
    } else if (ctx.document) {
      fileID = ctx.document.file_id;
    }
    let message = this.t(ctx.lang, 'bot:oops');
    try {
      let url = `https://api.telegram.org/bot${this.TOKEN}/getFile?file_id=${fileID}`;
      const { data } = await axios.get(url);
      url = `https://api.telegram.org/file/bot${this.TOKEN}/${data.result.file_path}`;
      const img = await axios.get(url, {
        responseType: 'arraybuffer'
      });
      ctx.action.obj.img = await sharp(img.data).resize(256).webp().toBuffer();
      const product = await Product.createOne({ ...ctx.action.obj });
      const category = await Category.findOne(product.category);
      this.bot.sendPhoto(
        ctx.chatID,
        Buffer.from(product.img, 'base64'),
        {
          parse_mode: 'HTML',
          caption:
            `${this.t(ctx.lang, 'product:create:ok')}\n\n` +
            `${this.t(ctx.lang, 'product:category %s', category.title)}\n` +
            `${this.t(ctx.lang, 'product:title %s', product.title)}\n` +
            `${this.t(
              ctx.lang,
              'product:price %s',
              `${product.pricePer} ${product.priceTitle}\n\n`
            )}` +
            this.t(ctx.lang, 'bot:help')
        },
        {
          filename: undefined,
          contentType: undefined
        }
      );
    } catch (err) {
      message = this.t(ctx.lang, 'bot:error %s', err.message);
      this.bot.sendMessage(ctx.chatID, message, { parse_mode: 'HTML' });
    } finally {
      this.deleteAction(ctx.chatID);
    }
  }
};

const editProduct = {
  async ['/editproduct'](ctx) {
    let message = this.t(ctx.lang, 'bot:oops');
    let reply_markup = null;
    try {
      const categories = await Category.paginate(ctx.action.paginate.page);
      if (categories.docs.length) {
        message =
          this.t(ctx.lang, 'product:update', ctx.text) +
          this.t(ctx.lang, 'bot:cancel');
        reply_markup = {
          inline_keyboard: categories.docs.map((item) => [
            {
              text: item.title,
              callback_data: JSON.stringify({
                id: item.id,
                cb: 'p:u:s-c'
              })
            }
          ])
        };
        reply_markup.inline_keyboard.push(
          this.initPaginate(ctx, categories.page, categories.pages)
        );
      } else {
        reply_markup = null;
        this.deleteAction(ctx.chatID);
        message = this.t(ctx.lang, 'category:oops');
      }
    } catch (err) {
      reply_markup = null;
      this.deleteAction(ctx.chatID);
      message = this.t(ctx.lang, 'bot:error %s', err.message);
    } finally {
      if (ctx.isPaginate) {
        this.bot.editMessageText(message, {
          chat_id: ctx.chatID,
          message_id: ctx.messageID,
          reply_markup: reply_markup,
          parse_mode: 'HTML'
        });
      } else {
        this.bot.sendMessage(ctx.chatID, message, {
          parse_mode: 'HTML',
          reply_markup: reply_markup
        });
      }
    }
  },

  async ['p:u:s-c'](ctx) {
    let message = this.t(ctx.lang, 'category:oops');
    let reply_markup = null;
    this.setActionType(ctx.chatID, 'p:u:s-c');
    try {
      ctx.action.obj.category = ctx.action.obj.category || ctx.data.id;
      const category = await Category.findOne(ctx.action.obj.category);
      const products = await Product.paginate(
        ctx.action.obj.category,
        ctx.action.paginate.page
      );
      if (products.docs.length) {
        message = this.t(
          ctx.lang,
          'product:update:select-category %s',
          category.title
        );
        reply_markup = {
          inline_keyboard: products.docs.map((item) => [
            {
              text: item.title,
              callback_data: JSON.stringify({
                id: item.id,
                cb: 'p:u:s-p'
              })
            }
          ])
        };
        message += this.t(ctx.lang, 'bot:cancel');
        reply_markup.inline_keyboard.push(
          this.initPaginate(ctx, products.page, products.pages)
        );
      } else {
        reply_markup = null;
        this.deleteAction(ctx.chatID);
        message = this.t(ctx.lang, 'product:oops');
      }
    } catch (err) {
      reply_markup = null;
      this.deleteAction(ctx.chatID);
      message = this.t(ctx.lang, 'bot:error %s', err.message);
    } finally {
      this.bot.editMessageText(message, {
        chat_id: ctx.chatID,
        message_id: ctx.messageID,
        reply_markup: reply_markup,
        parse_mode: 'HTML'
      });
    }
  },

  async ['p:u:s-p'](ctx) {
    let message = this.t(ctx.lang, 'bot:oops');
    try {
      const category = await Category.findOne(ctx.action.obj.category);
      const product = await Product.findOne(ctx.data.id);
      ctx.action.obj.id = product.id;
      this.bot.sendPhoto(
        ctx.chatID,
        Buffer.from(product.img, 'base64'),
        {
          parse_mode: 'HTML',
          caption:
            `${this.t(ctx.lang, 'product:category %s', category.title)}\n` +
            `${this.t(ctx.lang, 'product:title %s', product.title)}\n` +
            `${this.t(
              ctx.lang,
              'product:price %s',
              `${product.pricePer} ${product.priceTitle}\n\n`
            )}` +
            `${this.t(
              ctx.lang,
              'product:update:select-product %s',
              product.title
            )}` +
            `${this.t(ctx.lang, 'bot:cancel')}\n\n`,
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: this.t(ctx.lang, 'product:btn:category'),
                  callback_data: JSON.stringify({
                    cb: 'p:u:cb',
                    key: 'category'
                  })
                }
              ],
              [
                {
                  text: this.t(ctx.lang, 'product:btn:img'),
                  callback_data: JSON.stringify({ cb: 'p:u:cb', key: 'img' })
                }
              ],
              [
                {
                  text: this.t(ctx.lang, 'product:btn:title'),
                  callback_data: JSON.stringify({ cb: 'p:u:cb', key: 'title' })
                }
              ],
              [
                {
                  text: this.t(ctx.lang, 'product:btn:price-title'),
                  callback_data: JSON.stringify({
                    cb: 'p:u:cb',
                    key: 'price-title'
                  })
                }
              ],
              [
                {
                  text: this.t(ctx.lang, 'product:btn:price-per'),
                  callback_data: JSON.stringify({
                    cb: 'p:u:cb',
                    key: 'price-per'
                  })
                }
              ]
            ]
          }
        },
        {
          filename: undefined,
          contentType: undefined
        }
      );
    } catch (err) {
      this.deleteAction(ctx.chatID);
      message = this.t(ctx.lang, 'bot:error %s', err.message);
      this.bot.sendMessage(ctx.chatID, message, {
        parse_mode: 'HTML'
      });
    }
  },

  async ['p:u:cb'](ctx) {
    let message = this.t(ctx.lang, 'bot:oops');
    let reply_markup = null;
    try {
      switch (ctx.data.key) {
        case 'category':
          const categories = await Category.paginate(ctx.action.paginate.page);
          message =
            this.t(ctx.lang, 'product:update:category') +
            this.t(ctx.lang, 'bot:cancel');
          reply_markup = {
            inline_keyboard: categories.docs.map((item) => [
              {
                text: item.title,
                callback_data: JSON.stringify({
                  id: item.id,
                  cb: 'p:u:s-c'
                })
              }
            ])
          };
          reply_markup.inline_keyboard.push(
            this.initPaginate(ctx, categories.page, categories.pages)
          );
          break;
        case 'title':
          this.setActionType(ctx.chatID, 'product:update:title');
          message =
            this.t(ctx.lang, 'product:update:title') +
            this.t(ctx.lang, 'bot:cancel');
          break;
        case 'img':
          this.setActionType(ctx.chatID, 'product:update:img');
          message =
            this.t(ctx.lang, 'product:update:img') +
            this.t(ctx.lang, 'bot:cancel');
          break;
        case 'price-title':
          this.setActionType(ctx.chatID, 'product:update:price-title');
          message =
            this.t(ctx.lang, 'product:update:price-title') +
            this.t(ctx.lang, 'bot:cancel');
          reply_markup = {
            inline_keyboard: [
              [
                {
                  text: 'грн/шт',
                  callback_data: JSON.stringify({
                    cb: 'p:u:p-t',
                    key: 'грн/шт'
                  })
                },
                {
                  text: 'грн/кг',
                  callback_data: JSON.stringify({
                    cb: 'p:u:p-t',
                    key: 'грн/кг'
                  })
                },
                {
                  text: 'грн/літр',
                  callback_data: JSON.stringify({
                    cb: 'p:u:p-t',
                    key: 'грн/літр'
                  })
                }
              ]
            ]
          };
          break;
        case 'price-per':
          this.setActionType(ctx.chatID, 'product:update:price-per');
          message =
            this.t(ctx.lang, 'product:update:price-per') +
            this.t(ctx.lang, 'bot:cancel');
          break;
      }
    } catch (err) {
      this.deleteAction(ctx.chatID);
      message = this.t(ctx.lang, 'bot:error %s', err.message);
      this.bot.sendMessage(ctx.chatID, message, {
        parse_mode: 'HTML'
      });
    } finally {
      this.bot.sendMessage(ctx.chatID, message, {
        parse_mode: 'HTML',
        reply_markup: reply_markup
      });
    }
  }
};

const deleteProduct = {
  async ['/deleteproduct'](ctx) {
    let message = this.t(ctx.lang, 'bot:oops');
    let reply_markup = null;
    try {
      const categories = await Category.paginate(ctx.action.paginate.page);
      if (categories.docs.length) {
        message =
          this.t(ctx.lang, 'product:delete', ctx.text) +
          this.t(ctx.lang, 'bot:cancel');
        reply_markup = {
          inline_keyboard: categories.docs.map((item) => [
            {
              text: item.title,
              callback_data: JSON.stringify({
                id: item.id,
                cb: 'p:d:s-c'
              })
            }
          ])
        };
        reply_markup.inline_keyboard.push(
          this.initPaginate(ctx, categories.page, categories.pages)
        );
      } else {
        reply_markup = null;
        this.deleteAction(ctx.chatID);
        message = this.t(ctx.lang, 'category:oops');
      }
    } catch (err) {
      reply_markup = null;
      this.deleteAction(ctx.chatID);
      message = this.t(ctx.lang, 'bot:error %s', err.message);
    } finally {
      if (ctx.isPaginate) {
        this.bot.editMessageText(message, {
          chat_id: ctx.chatID,
          message_id: ctx.messageID,
          reply_markup: reply_markup,
          parse_mode: 'HTML'
        });
      } else {
        this.bot.sendMessage(ctx.chatID, message, {
          parse_mode: 'HTML',
          reply_markup: reply_markup
        });
      }
    }
  },

  async ['p:d:s-c'](ctx) {
    let message = this.t(ctx.lang, 'category:oops');
    let reply_markup = null;
    this.setActionType(ctx.chatID, 'p:d:s-c');
    try {
      ctx.action.obj.category = ctx.action.obj.category || ctx.data.id;
      const category = await Category.findOne(ctx.action.obj.category);
      const products = await Product.paginate(
        ctx.action.obj.category,
        ctx.action.paginate.page
      );
      if (products.docs.length) {
        message = this.t(
          ctx.lang,
          'product:delete:select-category %s',
          category.title
        );
        reply_markup = {
          inline_keyboard: products.docs.map((item) => [
            {
              text: item.title,
              callback_data: JSON.stringify({
                id: item.id,
                cb: 'p:d:s-p'
              })
            }
          ])
        };
        message += `${this.t(ctx.lang, 'bot:cancel')}`;
        reply_markup.inline_keyboard.push(
          this.initPaginate(ctx, products.page, products.pages)
        );
      } else {
        reply_markup = null;
        this.deleteAction(ctx.chatID);
        message = this.t(ctx.lang, 'product:oops');
      }
    } catch (err) {
      reply_markup = null;
      this.deleteAction(ctx.chatID);
      message = this.t(ctx.lang, 'bot:error %s', err.message);
    } finally {
      this.bot.editMessageText(message, {
        chat_id: ctx.chatID,
        message_id: ctx.messageID,
        reply_markup: reply_markup,
        parse_mode: 'HTML'
      });
    }
  },

  async ['p:d:s-p'](ctx) {
    let message = this.t(ctx.lang, 'bot:oops');
    let reply_markup = null;
    try {
      const product = await Product.findOne(ctx.data.id);
      const category = await Category.findOne(product.category);
      ctx.action.obj = product;
      reply_markup = {
        inline_keyboard: [
          [
            {
              text: 'Так, 💯 видалити!',
              callback_data: JSON.stringify({ cb: 'p:d:confirm', key: 'yes' })
            }
          ],
          [
            {
              text: '🚫 Ні, не видаляти!',
              callback_data: JSON.stringify({ cb: 'p:d:confirm', key: 'no' })
            }
          ]
        ]
      };
      this.bot.sendPhoto(
        ctx.chatID,
        Buffer.from(product.img, 'base64'),
        {
          reply_markup: reply_markup,
          parse_mode: 'HTML',
          caption:
            `${this.t(ctx.lang, 'product:category %s', category.title)}\n` +
            `${this.t(ctx.lang, 'product:title %s', product.title)}\n` +
            `${this.t(
              ctx.lang,
              'product:price %s',
              `${product.pricePer} ${product.priceTitle}`
            )}`
        },
        {
          filename: undefined,
          contentType: undefined
        }
      );
    } catch (err) {
      this.deleteAction(ctx.chatID);
      message = this.t(ctx.lang, 'bot:error %s', err.message);
      this.bot.sendMessage(ctx.chatID, message, {
        parse_mode: 'HTML',
        reply_markup: reply_markup
      });
    }
  },

  async ['p:d:confirm'](ctx) {
    let message = this.t(ctx.lang, 'bot:oops');
    try {
      switch (ctx.data.key) {
        case 'yes':
          await Product.removeOne(ctx.action.obj.id);
          message =
            `${this.t(
              ctx.lang,
              'product:delete:confirm:delete %s',
              ctx.action.obj.title
            )}\n\n` + this.t(ctx.lang, 'bot:help');
          break;
        case 'no':
          message =
            `${this.t(ctx.lang, 'product:delete:confirm:cancel')}\n\n` +
            this.t(ctx.lang, 'bot:help');
          break;
      }
    } catch (err) {
      message = this.t(ctx.lang, 'bot:error %s', err.message);
    } finally {
      this.deleteAction(ctx.chatID);
      this.bot.deleteMessage(ctx.chatID, ctx.messageID);
      this.bot.sendMessage(ctx.chatID, message, {
        parse_mode: 'HTML'
      });
    }
  }
};

module.exports = {
  ...products,
  ...newProduct,
  ...editProduct,
  ...deleteProduct
};
