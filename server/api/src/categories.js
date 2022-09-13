const Category = require('../../services/category.service');

const categories = {
  async ['/categories'](ctx) {
    let message = this.p('category:oops');
    let reply_markup = null;
    try {
      const categories = await Category.paginate(ctx.action.paginate.page);
      if (categories.docs.length) {
        message = `${this.p('category:read')}\n\n`;
        categories.docs.forEach((item, index) => {
          message += `<b>${
            index + 1 + (ctx.action.paginate.page - 1) * this.LIMIT
          }.</b> <i>${item.title}</i>\n`;
        });
        message += `\n${this.p('bot:help')}` + `${this.p('bot:cancel')}`;
        reply_markup = {
          inline_keyboard: [
            this.initPaginate(ctx, categories.page, categories.pages)
          ]
        };
      }
    } catch (err) {
      reply_markup = null;
      this.deleteAction(ctx.chatID);
      message = this.p('bot:error %s', err.message);
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
  }
};

const newCategory = {
  async ['/newcategory'](ctx) {
    let message = `${this.p('category:create')}` + `${this.p('bot:cancel')}:`;
    this.setAction(ctx.chatID, 'category:create:title');
    this.bot.sendMessage(ctx.chatID, message, { parse_mode: 'HTML' });
  },

  async ['category:create:title'](ctx) {
    let message = this.p('bot:oops');
    try {
      message =
        `${this.p('category:create:title %s', ctx.text)}\n\n` +
        `${this.p('bot:help')}`;
      await Category.createOne({ title: ctx.text });
    } catch (err) {
      message = this.p('bot:error %s', err.message);
    } finally {
      this.deleteAction(ctx.chatID);
      this.bot.sendMessage(ctx.chatID, message, { parse_mode: 'HTML' });
    }
  }
};

const editCategory = {
  async ['/editcategory'](ctx) {
    let message = this.p('bot:oops');
    let reply_markup = null;
    try {
      const categories = await Category.paginate(ctx.action.paginate.page);
      if (categories.docs.length) {
        message = `${this.p('category:update')}` + `${this.p('bot:cancel')}`;
        reply_markup = {
          inline_keyboard: categories.docs.map((item) => [
            {
              text: item.title,
              callback_data: JSON.stringify({
                id: item.id,
                cb: 'c:u:s'
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
        message = this.p('category:oops');
      }
    } catch (err) {
      reply_markup = null;
      this.deleteAction(ctx.chatID);
      message = this.p('bot:error %s', err.message);
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

  async ['c:u:s'](ctx) {
    let message = this.p('bot:oops');
    try {
      const category = await Category.findOne(ctx.data.id);
      ctx.action.obj.id = category.id;
      ctx.action.obj.title = category.title;
      message =
        `${this.p('category:update:select %s', category.title)}` +
        `${this.p('bot:cancel')}:`;
      this.setActionType(ctx.chatID, 'category:update:title');
    } catch (err) {
      this.deleteAction(ctx.chatID);
      message = this.p('bot:error %s', err.message);
    } finally {
      this.bot.editMessageText(message, {
        chat_id: ctx.chatID,
        message_id: ctx.messageID,
        parse_mode: 'HTML'
      });
    }
  },

  async ['category:update:title'](ctx) {
    let message = this.p('bot:oops');
    try {
      message = this.p('category:update:title %s', ctx.action.obj.title);
      ctx.action.obj.title = ctx.text;
      await Category.updateOne(ctx.action.obj.id, {
        ...ctx.action.obj
      });
    } catch (err) {
      message = this.p('bot:error %s', err.message);
    } finally {
      this.deleteAction(ctx.chatID);
      this.bot.sendMessage(ctx.chatID, message, { parse_mode: 'HTML' });
    }
  }
};

const deleteCategory = {
  async ['/deletecategory'](ctx) {
    let message = this.p('bot:oops');
    let reply_markup = null;
    try {
      const categories = await Category.paginate(ctx.action.paginate.page);
      if (categories.docs.length) {
        message = `${this.p('category:delete')}` + `${this.p('bot:cancel')}:`;
        reply_markup = {
          inline_keyboard: categories.docs.map((item) => [
            {
              text: item.title,
              callback_data: JSON.stringify({
                id: item.id,
                cb: 'c:d:s'
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
        message = this.p('category:oops');
      }
    } catch (err) {
      reply_markup = null;
      this.deleteAction(ctx.chatID);
      message = this.p('bot:error %s', err.message);
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

  async ['c:d:s'](ctx) {
    let message = this.p('bot:oops');
    let reply_markup = null;
    try {
      const category = await Category.findOne(ctx.data.id);
      message = this.p('category:delete:select %s', category.title);
      ctx.action.obj.id = category.id;
      ctx.action.obj.title = category.title;
      reply_markup = {
        inline_keyboard: [
          [
            {
              text: 'Так 💯 видалити!',
              callback_data: JSON.stringify({
                cb: 'c:d:confirm',
                key: 'delete'
              })
            },
            {
              text: 'Ні, не видаляти!',
              callback_data: JSON.stringify({
                cb: 'c:d:confirm',
                key: 'cancel'
              })
            }
          ]
        ]
      };
    } catch (err) {
      this.deleteAction(ctx.chatID);
      message = this.p('bot:error %s', err.message);
    } finally {
      this.bot.editMessageText(message, {
        chat_id: ctx.chatID,
        message_id: ctx.messageID,
        reply_markup: reply_markup,
        parse_mode: 'HTML'
      });
    }
  },

  async ['c:d:confirm'](ctx) {
    let message = this.p('bot:oops');
    try {
      switch (ctx.data.key) {
        case 'delete':
          await Category.removeOne(ctx.action.obj.id);
          message = this.p(
            'category:delete:confirm:delete %s',
            ctx.action.obj.title
          );
          break;
        case 'cancel':
          message =
            `${this.p('category:delete:confirm:cancel')}\n\n` +
            `${this.p('bot:help')}`;
          break;
      }
    } catch (err) {
      message = this.p('bot:error %s', err.message);
    } finally {
      this.deleteAction(ctx.chatID);
      this.bot.editMessageText(message, {
        chat_id: ctx.chatID,
        message_id: ctx.messageID,
        reply_markup: null,
        parse_mode: 'HTML'
      });
    }
  }
};

module.exports = {
  ...categories,
  ...newCategory,
  ...editCategory,
  ...deleteCategory
};
