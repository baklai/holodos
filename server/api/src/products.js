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
                type: 'p:r:s-c'
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
          }.</b> <i>${item.title}</i>\n`;
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
                type: 'p:c:s-c'
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
      this.setActionType(ctx.chatID, 'product:create:input-title');
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

  async ['product:create:input-title'](ctx) {
    let message = this.t(ctx.lang, 'bot:oops');
    let reply_markup = null;
    try {
      ctx.action.obj.title = ctx.text;
      message =
        this.t(ctx.lang, 'product:create:input-title %s', ctx.text) +
        `${this.t(ctx.lang, 'bot:cancel')}:`;
      reply_markup = {
        inline_keyboard: [
          [
            {
              text: 'грн/шт',
              callback_data: JSON.stringify({
                type: 'p:c:i-p-t',
                key: 'грн/шт'
              })
            },
            {
              text: 'грн/кг',
              callback_data: JSON.stringify({
                type: 'p:c:i-p-t',
                key: 'грн/кг'
              })
            },
            {
              text: 'грн/літр',
              callback_data: JSON.stringify({
                type: 'p:c:i-p-t',
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
        t(
          ctx.lang,
          'product:create:input-price-title %s',
          ctx.action.obj.priceTitle
        ) + this.t(ctx.lang, 'bot:cancel');
      this.setActionType(ctx.chatID, 'product:create:input-price-per');
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

  async ['product:create:input-price-per'](ctx) {
    let message = this.t(ctx.lang, 'bot:oops');
    let reply_markup = null;
    try {
      ctx.action.obj.pricePer = ctx.text;
      message =
        this.t(ctx.lang, 'product:create:input-price-per %s', ctx.text) +
        this.t(ctx.lang, 'bot:cancel');
      this.setActionType(ctx.chatID, 'product:create:input-img');
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

  async ['product:create:input-img'](ctx) {
    let fileID = null;
    if (ctx.photo) {
      fileID = ctx.photo[ctx.photo.length - 1].file_id;
    } else if (ctx.document) {
      fileID = ctx.document.file_id;
    }
    let message = this.t(ctx.lang, 'bot:oops');
    try {
      let url = `https://api.telegram.org/bot${TOKEN}/getFile?file_id=${fileID}`;
      const { data } = await axios.get(url);
      url = `https://api.telegram.org/file/bot${TOKEN}/${data.result.file_path}`;
      message = this.t(ctx.lang, 'product:create:input-img');
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
            `${this.t(ctx.lang, 'product:category %s', category.title)}\n` +
            `${this.t(ctx.lang, 'product:title %s', product.title)}\n` +
            `${t(
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
    } finally {
      this.deleteAction(ctx.chatID);
      this.bot.sendMessage(ctx.chatID, message, { parse_mode: 'HTML' });
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
                type: 'p:u:s-c'
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
    this.setActionType(ctx.chatID, 'p:d:s-c');
    try {
      ctx.action.obj.category = ctx.action.obj.category || ctx.data.id;
      const category = await Category.findOne(ctx.action.obj.category);
      const products = await Product.paginate(
        ctx.action.obj.category,
        ctx.action.paginate.page
      );
      if (products.docs.length) {
        message = t(
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
                type: 'p:u:s-p'
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
      this.setActionType(ctx.chatID, 'input-new-product-title');
      message = `👌 Добре, вибрано категорію товарів "<b><i>${product.title}</i></b>".\n\n⁉️ Який новий товар хочемо додати?\n\nВведіть назву товару для категорії товарів "<b><i>${category.title}</i></b>" або натисніть /cancel, щоб скасувати поточну операцію:`;
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
                type: 'p:d:s-c'
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
        message = t(
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
                type: 'p:d:s-p'
              })
            }
          ])
        };
        message +=
          `\n${this.t(ctx.lang, 'bot:help')}` +
          `${this.t(ctx.lang, 'bot:cancel')}`;
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
      reply_markup = {
        inline_keyboard: [
          [
            {
              text: 'Так, 💯 видалити!',
              callback_data: JSON.stringify({ type: 'p:d:confirm', key: 'yes' })
            }
          ],
          [
            {
              text: '🚫 Ні, не видаляти!',
              callback_data: JSON.stringify({ type: 'p:d:confirm', key: 'no' })
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
            `${t(
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
      this.bot.editMessageText(message, {
        chat_id: ctx.chatID,
        message_id: ctx.messageID,
        reply_markup: null,
        parse_mode: 'HTML'
      });
    }
  },

  async ['p:d:confirm'](ctx) {
    console.log(ctx);
    let message = this.t(ctx.lang, 'bot:oops');
    let reply_markup = null;
    try {
      switch (ctx.data.key) {
        case 'yes':
          const dd = await Product.removeOne(ctx.action.obj.id);

          console.log(dd);

          message = `👌 Добре, категорія товарів "<i>${ctx.action.obj.title}</i>" була успішно <b>видалена</b>.`;
          break;
        case 'no':
          message = `👌 Добре, команда була скасована.\n\n<i>Що я ще можу зробити для вас? Надішліть /help для отримання списку команд.</i>`;
          break;
      }
    } catch (err) {
      reply_markup = null;
      message = this.t(ctx.lang, 'bot:error %s', err.message);
    } finally {
      //  this.deleteAction(ctx.chatID);
      // this.bot.sendMessage(message, {
      //   chat_id: ctx.chatID,
      //   reply_markup: reply_markup,
      //   parse_mode: 'HTML'
      // });

      this.bot.deleteMessage(ctx.chatID, ctx.messageID);

      // this.bot.sendMessage(ctx.chatID, message, {
      //   parse_mode: 'HTML',

      //   reply_markup: null
      // });
    }
  }
};

module.exports = {
  ...products,
  ...newProduct,
  ...editProduct,
  ...deleteProduct
};
