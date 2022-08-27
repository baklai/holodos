/**
 * Telegram Bot
 * List of the bot's actions
 */

const axios = require('axios');
const sharp = require('sharp');

const User = require('../services/user.service');
const Category = require('../services/category.service');
const Product = require('../services/product.service');
const Stat = require('../services/statistic.service');

const i18n = require('./i18n.config');

const t = (locale = 'en', phrase, varible) => {
  return i18n.__({ phrase: phrase, locale: locale }, varible);
};

const paginate = (prev, of, next) => {
  return [
    { text: '<<', callback_data: 'prev' },
    { text: '1 из 5', callback_data: 'of' },
    { text: '>>', callback_data: 'next' }
  ];
};

const { helper } = require('./commands');

const { TOKEN, WEB_APP } = process.env;

const MAIN_BUTTON = [
  [{ text: 'Відкрити холодос', web_app: { url: WEB_APP } }],
  [{ text: '❓ Help' }, { text: '💸 Donate' }]
];

class Action {
  constructor(bot) {
    this.bot = bot;
    this.actions = [];
  }
  getAction(id) {
    return this.actions.find((item) => item.id === id);
  }
  setAction(id, type) {
    if (this.getAction(id)) this.deleteAction(id);
    this.actions.push({ id, type, obj: {}, paginate: { limit: 5, page: 1 } });
  }
  setActionType(id, type) {
    const action = this.getAction(id);
    if (action) {
      action.type = type;
    }
  }
  deleteAction(id) {
    const index = this.actions.findIndex((item) => {
      return item.id === id;
    });
    if (index >= 0) this.actions.splice(index, 1);
    return true;
  }
}

class Middleware extends Action {
  constructor(bot) {
    super(bot);
  }

  isLang(msg) {
    return msg.from?.language_code || 'uk';
  }

  isAdmin(msg) {
    return msg.entities?.find((item) => item.type === 'bot_command')
      ? true
      : false;
  }

  isCommand(msg) {
    return msg.entities?.find((item) => item.type === 'bot_command')
      ? true
      : false;
  }

  isPaginate(msg) {
    return msg.data === 'prev' || msg.data === 'next' || msg.data === 'current';
  }

  ctx(msg, next) {
    console.log('msg|query\n', msg);

    // switch (ctx.data) {
    //   case 'prev':
    //     page -= 1;
    //     break;
    //   case 'of':
    //     page = 1;
    //     break;

    //   case 'next':
    //     page += 1;
    //     break;
    //   default:
    //     page = 1;
    // }

    const ctx = {
      chatID: msg.chat?.id || msg.message?.chat?.id || undefined,
      messageID: msg.message_id || msg.message?.message_id || undefined,
      user: {
        userID: msg.from.id,
        firstName: msg.from.first_name,
        lastName: msg.from.last_name,
        userName: msg.from.username
      },
      text: msg.text || undefined,
      entities: msg.entities || [],
      data: msg.data || undefined,
      photo: msg.photo || undefined,
      document: msg.document || undefined,
      lang: this.isLang(msg),
      action: this.getAction(
        msg.chat?.id || msg.message?.chat?.id || undefined
      ),
      isPaginate: this.isPaginate(msg),
      isCommand: this.isCommand(msg)
    };

    console.log('ctx\n', ctx);

    if (typeof this[next] === 'function') {
      return this[next](ctx);
    }
  }
}

class Commands extends Middleware {
  constructor(bot) {
    super(bot);
  }

  async ['start'](ctx) {
    const message =
      `${t(ctx.lang, 'main:hi %s', ctx.user.firstName)}\n\n` +
      `${t(ctx.lang, 'start:title')}\n\n` +
      `${t(ctx.lang, 'main:help')}\n\n` +
      `${t(ctx.lang, 'main:created %s', new Date().getFullYear())}\n\n` +
      `${t(ctx.lang, 'start:subtitle')}`;

    this.bot.sendMessage(ctx.chatID, message, {
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      reply_markup: {
        keyboard: MAIN_BUTTON,
        resize_keyboard: true
      }
    });
    await User.createOne(ctx.user);
  }

  async ['help'](ctx) {
    const message =
      `${t(ctx.lang, 'main:hi %s', ctx.user.firstName)}\n\n` +
      `${t(ctx.lang, 'help:title')}\n` +
      `${helper}\n\n` +
      `${t(ctx.lang, 'main:created %s', new Date().getFullYear())}`;

    this.bot.sendMessage(ctx.chatID, message, {
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      reply_markup: {
        keyboard: MAIN_BUTTON,
        resize_keyboard: true
      }
    });
  }

  async ['about'](ctx) {
    let message =
      `${t(ctx.lang, 'main:hi %s', ctx.user.firstName)}\n\n` +
      `${t(ctx.lang, 'about:title')}\n\n` +
      `${t(ctx.lang, 'about:list:a')}\n` +
      `${t(ctx.lang, 'about:list:b')}\n` +
      `${t(ctx.lang, 'about:list:c')}\n` +
      `${t(ctx.lang, 'about:list:d')}\n\n` +
      `${t(ctx.lang, 'main:help')}\n\n` +
      `${t(ctx.lang, 'main:created %s', new Date().getFullYear())}`;

    this.bot.sendMessage(ctx.chatID, message, {
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      reply_markup: {
        keyboard: MAIN_BUTTON,
        resize_keyboard: true
      }
    });
  }

  async ['statistic'](ctx) {
    const stat = await Stat.statAll();
    const message =
      `${t(ctx.lang, 'main:hi %s', ctx.user.firstName)}\n\n` +
      `${t(ctx.lang, 'stat:title')}\n\n` +
      `${t(ctx.lang, 'stat:users %s', stat.users)}\n` +
      `${t(ctx.lang, 'stat:categories %s', stat.categories)}\n` +
      `${t(ctx.lang, 'stat:products %s', stat.users)}\n\n` +
      `${t(ctx.lang, 'main:help')}`;

    this.bot.sendMessage(ctx.chatID, message, {
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      reply_markup: {
        keyboard: MAIN_BUTTON,
        resize_keyboard: true
      }
    });
  }

  async ['notification'](ctx) {
    let message =
      `${t(ctx.lang, 'notification')} ` + `${t(ctx.lang, 'main:cancel')} : `;

    this.setAction(ctx.chatID, 'notification:send');
    this.bot.sendMessage(ctx.chatID, message, { parse_mode: 'HTML' });
  }

  async ['notification:send'](ctx) {
    let message = t(ctx.lang, 'main:oops');
    try {
      const users = await User.findAll();
      users.forEach((user) => {
        message =
          `${t(ctx.lang, 'main:hi %s', user.firstName)}\n\n` +
          `${ctx.text}\n\n` +
          `${t(ctx.lang, 'main:help')}`;

        this.bot.sendMessage(user.userID, message, {
          parse_mode: 'HTML',
          entities: ctx.entities
        });
      });
    } catch (err) {
      message = t(ctx.lang, 'main:error %s', err.message);
    } finally {
      this.deleteAction(ctx.chatID);
    }
  }

  async ['action:cancel'](ctx) {
    let message = t(ctx.lang, 'main:oops');
    if (ctx.action) {
      this.deleteAction(ctx.chatID);
      message = `${t(ctx.lang, 'action:cancel:yes')}\n\n`;
    } else {
      message = `${t(ctx.lang, 'action:cancel:no')}\n\n`;
    }
    message += t(ctx.lang, 'main:help');
    this.bot.sendMessage(ctx.chatID, message, { parse_mode: 'HTML' });
  }
}

class Categories extends Commands {
  constructor(bot) {
    super(bot);
  }

  async ['category:read'](ctx) {
    let message = t(ctx.lang, 'category:oops');
    let reply_markup = null;
    let page = 1;
    try {
      const category = await Category.findAllPaginate();

      console.log(category);

      if (category.docs.length) {
        this.setAction(ctx.chatID, 'category:read');

        message = `${t(ctx.lang, 'category:read')}\n\n`;
        category.docs.forEach((item, index) => {
          message += `<b>${index + 1}.</b> <i>${item.title}</i>\n`;
        });
        message += `\n${t(ctx.lang, 'main:help')}`;

        reply_markup = {
          inline_keyboard: [paginate('prev', 'of', 'next')]
        };
      }
    } catch (err) {
      message = t(ctx.lang, 'main:error %s', err.message);
    } finally {
      // this.deleteAction(ctx.chatID);
      if (ctx.isPaginate) {
        this.bot.editMessageText(message, {
          chat_id: ctx.chatID,
          message_id: ctx.messageID,
          reply_markup,
          parse_mode: 'HTML'
        });
      } else {
        this.bot.sendMessage(ctx.chatID, message, {
          parse_mode: 'HTML',
          reply_markup
        });
      }
    }
  }

  async ['category:create'](ctx) {
    let message =
      `${t(ctx.lang, 'category:create')}` + `${t(ctx.lang, 'main:cancel')}:`;
    this.setAction(ctx.chatID, 'category:create:input-title');
    this.bot.sendMessage(ctx.chatID, message, { parse_mode: 'HTML' });
  }

  async ['category:create:input-title'](ctx) {
    let message = t(ctx.lang, 'main:oops');
    try {
      message =
        `${t(ctx.lang, 'category:create:input-title %s', ctx.text)}\n\n` +
        `${t(ctx.lang, 'main:help')}`;
      await Category.createOne({ title: ctx.text });
    } catch (err) {
      message = t(ctx.lang, 'main:error %s', err.message);
    } finally {
      this.deleteAction(ctx.chatID);
      this.bot.sendMessage(ctx.chatID, message, { parse_mode: 'HTML' });
    }
  }

  async ['category:update'](ctx) {
    let message = t(ctx.lang, 'main:oops');
    let reply_markup = null;
    try {
      const category = await Category.findAll();
      if (category.length) {
        this.setAction(ctx.chatID, 'category:update:select');
        message =
          `${t(ctx.lang, 'category:update')}` +
          `${t(ctx.lang, 'main:cancel')}:`;
        reply_markup = {
          inline_keyboard: category.map((item) => [
            { text: item.title, callback_data: item.id }
          ])
        };
      } else {
        message = t(ctx.lang, 'category:oops');
      }
    } catch (err) {
      this.deleteAction(ctx.chatID);
      message = t(ctx.lang, 'main:error %s', err.message);
    } finally {
      this.bot.sendMessage(ctx.chatID, message, {
        parse_mode: 'HTML',
        reply_markup
      });
    }
  }

  async ['category:update:select'](ctx) {
    let message = t(ctx.lang, 'main:oops');
    try {
      const category = await Category.findOne(ctx.data);
      ctx.action.obj.id = category.id;
      ctx.action.obj.title = category.title;
      message =
        `${t(ctx.lang, 'category:update:select %s', category.title)}` +
        `${t(ctx.lang, 'main:cancel')}:`;
      this.setActionType(ctx.chatID, 'category:update:input-title');
    } catch (err) {
      this.deleteAction(ctx.chatID);
      message = t(ctx.lang, 'main:error %s', err.message);
    } finally {
      this.bot.editMessageText(message, {
        chat_id: ctx.chatID,
        message_id: ctx.messageID,
        parse_mode: 'HTML'
      });
    }
  }

  async ['category:update:input-title'](ctx) {
    let message = t(ctx.lang, 'main:oops');
    try {
      message = t(
        ctx.lang,
        'category:update:input-title %s',
        ctx.action.obj.title
      );
      ctx.action.obj.title = ctx.text;
      await Category.updateOne(ctx.action.obj.id, {
        ...ctx.action.obj
      });
    } catch (err) {
      message = t(ctx.lang, 'main:error %s', err.message);
    } finally {
      this.deleteAction(ctx.chatID);
      this.bot.sendMessage(ctx.chatID, message, { parse_mode: 'HTML' });
    }
  }

  async ['category:delete'](ctx) {
    let message = t(ctx.lang, 'main:oops');
    let reply_markup = null;
    try {
      const category = await Category.findAll();
      if (category.length) {
        this.setAction(ctx.chatID, 'category:delete:select');
        message =
          `${t(ctx.lang, 'category:delete')}` +
          `${t(ctx.lang, 'main:cancel')}:`;
        reply_markup = {
          inline_keyboard: category.map((item) => [
            { text: item.title, callback_data: item.id }
          ])
        };
      } else {
        message = t(ctx.lang, 'category:oops');
      }
    } catch (err) {
      message = t(ctx.lang, 'main:error %s', err.message);
    } finally {
      this.bot.sendMessage(ctx.chatID, message, {
        parse_mode: 'HTML',
        reply_markup
      });
    }
  }

  async ['category:delete:select'](ctx) {
    let message = t(ctx.lang, 'main:oops');
    let reply_markup = null;
    try {
      const category = await Category.findOne(ctx.data);
      message = t(ctx.lang, 'category:delete:select %s', category.title);
      ctx.action.obj.id = category.id;
      ctx.action.obj.title = category.title;
      this.setActionType(ctx.chatID, 'category:delete:confirm');
      reply_markup = {
        inline_keyboard: [
          [
            { text: 'Так 💯 видалити!', callback_data: 'delete' },
            { text: 'Ні, не видаляти!', callback_data: 'cancel' }
          ]
        ]
      };
    } catch (err) {
      this.deleteAction(ctx.chatID);
      message = t(ctx.lang, 'main:error %s', err.message);
    } finally {
      this.bot.editMessageText(message, {
        chat_id: ctx.chatID,
        message_id: ctx.messageID,
        parse_mode: 'HTML',
        reply_markup
      });
    }
  }

  async ['category:delete:confirm'](ctx) {
    let message = t(ctx.lang, 'main:oops');
    try {
      if (ctx.data === 'delete') {
        await Category.removeOne(ctx.action.obj.id);
        message = t(
          ctx.lang,
          'category:delete:confirm:delete %s',
          ctx.action.obj.title
        );
      } else if (ctx.data === 'cancel') {
        message =
          `${t(ctx.lang, 'category:delete:confirm:cancel')}\n\n` +
          `${t(ctx.lang, 'main:help')}`;
      }
    } catch (err) {
      message = t(ctx.lang, 'main:error %s', err.message);
    } finally {
      this.deleteAction(ctx.chatID);
      this.bot.editMessageText(message, {
        chat_id: ctx.chatID,
        message_id: ctx.messageID,
        parse_mode: 'HTML'
      });
    }
  }
}

class Products extends Categories {
  constructor(bot) {
    super(bot);
  }
  async ['product:read'](ctx) {
    let message = t(ctx.lang, 'main:oops');
    let reply_markup = null;
    try {
      const category = await Category.findAll();
      if (category.length) {
        this.setAction(ctx.chatID, 'product:read:select-category');
        message =
          `${t(ctx.lang, 'product:read')}` + `${t(ctx.lang, 'main:cancel')}:`;
        reply_markup = {
          inline_keyboard: category.map((item) => [
            { text: item.title, callback_data: item.id }
          ])
        };
      } else {
        message = t(ctx.lang, 'category:oops');
      }
    } catch (err) {
      message = t(ctx.lang, 'main:error %s', err.message);
    } finally {
      this.bot.sendMessage(ctx.chatID, message, {
        parse_mode: 'HTML',
        reply_markup
      });
    }
  }

  async ['product:read:select-category'](ctx) {
    let message = t(ctx.lang, 'category:oops');
    try {
      const category = await Category.findOne(ctx.data);
      const products = await Product.findAll(ctx.data);
      if (products.length) {
        message = t(
          ctx.lang,
          'product:read:select-category %s',
          category.title
        );
        products.forEach((item, index) => {
          message += `<b>${index + 1}.</b> <i>${item.title}</i>\n`;
        });
        message += `\n${t(ctx.lang, 'main:help')}`;
      } else {
        message = t(ctx.lang, 'product:oops');
      }
    } catch (err) {
      message = t(ctx.lang, 'main:error %s', err.message);
    } finally {
      this.deleteAction(ctx.chatID);
      this.bot.editMessageText(message, {
        chat_id: ctx.chatID,
        message_id: ctx.messageID,
        parse_mode: 'HTML'
      });
    }
  }

  async ['product:create'](ctx) {
    let message = t(ctx.lang, 'main:oops');
    let reply_markup = null;
    try {
      const category = await Category.findAll();
      if (category.length) {
        this.setAction(ctx.chatID, 'product:create:select-category');
        message = t(ctx.lang, 'product:create') + t(ctx.lang, 'main:cancel');
        reply_markup = {
          inline_keyboard: category.map((item) => [
            { text: item.title, callback_data: item.id }
          ])
        };
      } else {
        message = t(ctx.lang, 'category:oops');
      }
    } catch (err) {
      message = t(ctx.lang, 'main:error %s', err.message);
    } finally {
      this.bot.sendMessage(ctx.chatID, message, {
        parse_mode: 'HTML',
        reply_markup
      });
    }
  }

  async ['product:create:select-category'](ctx) {
    let message = t(ctx.lang, 'main:oops');
    try {
      const category = await Category.findOne(ctx.data);
      ctx.action.obj.category = category.id;
      this.setActionType(ctx.chatID, 'product:create:input-title');
      message =
        t(ctx.lang, 'product:create:select-category %s', category.title) +
        `${t(ctx.lang, 'main:cancel')}:`;
    } catch (err) {
      this.deleteAction(ctx.chatID);
      message = t(ctx.lang, 'main:error %s', err.message);
    } finally {
      this.bot.editMessageText(message, {
        chat_id: ctx.chatID,
        message_id: ctx.messageID,
        parse_mode: 'HTML'
      });
    }
  }

  async ['product:create:input-title'](ctx) {
    let message = t(ctx.lang, 'main:oops');
    let reply_markup = null;
    try {
      ctx.action.obj.title = ctx.text;
      message =
        t(ctx.lang, 'product:create:input-title %s', ctx.text) +
        `${t(ctx.lang, 'main:cancel')}:`;
      reply_markup = {
        inline_keyboard: [
          [
            { text: 'грн/шт', callback_data: 'грн/шт' },
            { text: 'грн/100г', callback_data: 'грн/100г' },
            { text: 'грн/кг', callback_data: 'грн/кг' },
            { text: 'грн/літр', callback_data: 'грн/літр' }
          ]
        ]
      };
      this.setActionType(ctx.chatID, 'product:create:input-price-title');
    } catch (err) {
      this.deleteAction(ctx.chatID);
      message = t(ctx.lang, 'main:error %s', err.message);
    } finally {
      this.bot.sendMessage(ctx.chatID, message, {
        parse_mode: 'HTML',
        reply_markup
      });
    }
  }

  async ['product:create:input-price-title'](ctx) {
    let message = t(ctx.lang, 'main:oops');
    try {
      ctx.action.obj.priceTitle = ctx.data;
      message =
        t(
          ctx.lang,
          'product:create:input-price-title %s',
          ctx.action.obj.priceTitle
        ) + `${t(ctx.lang, 'main:cancel')}:`;

      this.setActionType(ctx.chatID, 'product:create:input-price-per');
    } catch (err) {
      this.deleteAction(ctx.chatID);
      message = t(ctx.lang, 'main:error %s', err.message);
    } finally {
      this.bot.editMessageText(message, {
        chat_id: ctx.chatID,
        message_id: ctx.messageID,
        parse_mode: 'HTML'
      });
    }
  }

  async ['product:create:input-price-per'](ctx) {
    let message = t(ctx.lang, 'main:oops');
    let reply_markup = null;
    try {
      ctx.action.obj.pricePer = ctx.text;
      message =
        t(ctx.lang, 'product:create:input-price-per %s', ctx.text) +
        `${t(ctx.lang, 'main:cancel')}:`;
      this.setActionType(ctx.chatID, 'product:create:input-img');
    } catch (err) {
      this.deleteAction(ctx.chatID);
      message = t(ctx.lang, 'main:error %s', err.message);
    } finally {
      this.bot.sendMessage(ctx.chatID, message, {
        parse_mode: 'HTML',
        reply_markup
      });
    }
  }

  async ['product:create:input-img'](ctx) {
    let fileID = null;
    if (ctx.photo) {
      fileID = ctx.photo[ctx.photo.length - 1].file_id;
    } else if (ctx.document) {
      fileID = ctx.document.file_id;
    }
    let message = t(ctx.lang, 'main:oops');
    try {
      let url = `https://api.telegram.org/bot${TOKEN}/getFile?file_id=${fileID}`;
      const { data } = await axios.get(url);
      url = `https://api.telegram.org/file/bot${TOKEN}/${data.result.file_path}`;
      message = t(ctx.lang, 'product:create:input-img');
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
            `${t(ctx.lang, 'product:category %s', category.title)}\n` +
            `${t(ctx.lang, 'product:title %s', product.title)}\n` +
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
      message = t(ctx.lang, 'main:error %s', err.message);
    } finally {
      this.deleteAction(ctx.chatID);
      this.bot.sendMessage(ctx.chatID, message, { parse_mode: 'HTML' });
    }
  }

  async ['product:update'](ctx) {
    let message = t(ctx.lang, 'main:oops');
    let reply_markup = null;
    try {
      const category = await Category.findAll();
      if (category.length) {
        this.setAction(ctx.chatID, 'product:update:select-category');
        message =
          `${t(ctx.lang, 'product:update', ctx.text)}` +
          `${t(ctx.lang, 'main:cancel')}:`;

        reply_markup = {
          inline_keyboard: category.map((item) => [
            { text: item.title, callback_data: item.id }
          ])
        };
      } else {
        message = t(ctx.lang, 'category:oops');
      }
    } catch (err) {
      this.deleteAction(ctx.chatID);
      message = t(ctx.lang, 'main:error %s', err.message);
    } finally {
      this.bot.sendMessage(ctx.chatID, message, {
        parse_mode: 'HTML',
        reply_markup
      });
    }
  }

  async ['product:update:select-category'](ctx) {
    let message = t(ctx.lang, 'main:oops');
    let reply_markup = null;
    try {
      const category = await Category.findOne(ctx.data);
      ctx.action.obj.category = category.id;
      this.setActionType(ctx.chatID, 'product:update:select-product');
      message =
        `${t(ctx.lang, 'product:update:select-category %s', category.title)}` +
        `${t(ctx.lang, 'main:cancel')}:`;

      const products = await Product.findAll(ctx.data);

      if (products.length) {
        this.setAction(ctx.chatID, 'product:update:select-category');
        message =
          `${t(ctx.lang, 'product:update', ctx.text)}` +
          `${t(ctx.lang, 'main:cancel')}:`;

        reply_markup = {
          inline_keyboard: category.map((item) => [
            { text: item.title, callback_data: item.id }
          ])
        };
      } else {
        this.deleteAction(ctx.chatID);
        message = t(ctx.lang, 'product:oops');
      }
    } catch (err) {
      this.deleteAction(ctx.chatID);
      message = t(ctx.lang, 'main:error %s', err.message);
    } finally {
      this.bot.editMessageText(message, {
        chat_id: ctx.chatID,
        message_id: ctx.messageID,
        parse_mode: 'HTML'
      });
    }
  }

  async ['product:update:select-product'](ctx) {
    let message = t(ctx.lang, 'main:oops');
    try {
      const category = await Category.findOne(ctx.data);
      ctx.action.obj.category = category.id;
      this.setActionType(ctx.chatID, 'input-new-product-title');
      message = `👌 Добре, вибрано категорію товарів "<b><i>${category.title}</i></b>".\n\n⁉️ Який новий товар хочемо додати?\n\nВведіть назву товару для категорії товарів "<b><i>${category.title}</i></b>" або натисніть /cancel, щоб скасувати поточну операцію:`;
    } catch (err) {
      this.deleteAction(ctx.chatID);
      message = t(ctx.lang, 'main:error %s', err.message);
    } finally {
      this.bot.editMessageText(message, {
        chat_id: ctx.chatID,
        message_id: ctx.messageID,
        parse_mode: 'HTML'
      });
    }
  }

  // async ['product:update:input-title'](ctx) {
  //   let message = t(ctx.lang, 'main:oops');
  //   let reply_markup = null;
  //   try {
  //     ctx.action.obj.title = ctx.text;
  //     message = `👌 Добре, назва нового товару "<b>${ctx.text}</b>" успішно прийнята.\n\nВиберіть розмірність нового товару або натисніть /cancel, щоб скасувати поточну операцію:`;
  //     reply_markup = {
  //       inline_keyboard: [
  //         [
  //           { text: 'грн/шт', callback_data: 'грн/шт' },
  //           { text: 'грн/кг', callback_data: 'грн/кг' },
  //           { text: 'грн/літр', callback_data: 'грн/літр' }
  //         ]
  //       ]
  //     };
  //     this.setActionType(ctx.chatID, 'input-new-product-price-title');
  //   } catch (err) {
  //     this.deleteAction(ctx.chatID);
  //     message = t(ctx.lang, 'main:error %s', err.message);
  //   } finally {
  //     this.bot.sendMessage(ctx.chatID, message, {
  //       parse_mode: 'HTML',
  //       reply_markup
  //     });
  //   }
  // }

  // async ['product:update:input-price-title'](ctx) {
  //   const { message_id } = ctx.message || {};
  //   const { id } = ctx.message?.chat || {};
  //   let message = t(ctx.lang, 'main:oops');
  //   try {
  //     ctx.action.obj.priceTitle = ctx.data;
  //     message = `👌 Добре, вибрано розмірність нового товару "<b><i>${ctx.action.obj.priceTitle}</i></b>".\n\nВведіть вартість нового товару "<b><i>${action.obj.title}</i></b>" або натисніть /cancel, щоб скасувати поточну операцію:`;
  //     this.setActionType(ctx.chatID, 'input-new-product-price');
  //   } catch (err) {
  //     this.deleteAction(ctx.chatID);
  //     message = t(ctx.lang, 'main:error %s', err.message);
  //   } finally {
  //     this.bot.editMessageText(message, {
  //       chat_id: id,
  //       message_id: message_id,
  //       parse_mode: 'HTML'
  //     });
  //   }
  // }

  // async ['product:update:input-price-per'](ctx) {
  //   let message = t(ctx.lang, 'main:oops');
  //   let reply_markup = null;
  //   const action = this.getAction(ctx.chatID);
  //   try {
  //     action.obj.pricePer = ctx.text;
  //     message = `👌 Добре, вартість нового товару "<b>${ctx.text}</b>" успішно прийнято.\n\n<i>Надішліть фото нового товару або натисніть /cancel, щоб скасувати поточну операцію:</i>`;
  //     this.setActionType(ctx.chatID, 'input-new-product-img');
  //   } catch (err) {
  //     this.deleteAction(ctx.chatID);
  //     message = t(ctx.lang, 'main:error %s', err.message);
  //   } finally {
  //     this.bot.sendMessage(ctx.chatID, message, {
  //       parse_mode: 'HTML',
  //       reply_markup
  //     });
  //   }
  // }

  // async ['product:update:input-img'](ctx) {
  //   let fileID = null;
  //   if (msg.photo) {
  //     fileID = msg.photo[msg.photo.length - 1].file_id;
  //   } else if (msg.document) {
  //     fileID = msg.document.file_id;
  //   }
  //   let message = t(ctx.lang, 'main:oops');
  //   const action = this.getAction(id);
  //   try {
  //     let url = `https://api.telegram.org/bot${TOKEN}/getFile?file_id=${fileID}`;
  //     const { data } = await axios.get(url);
  //     url = `https://api.telegram.org/file/bot${TOKEN}/${data.result.file_path}`;
  //     message = `👌 Фото нового товару успішно прийнято.`;
  //     const img = await axios.get(url, {
  //       responseType: 'arraybuffer'
  //     });
  //     ctx.action.obj.img = await sharp(img.data).resize(256).webp().toBuffer();
  //     const product = await Product.createOne({ ...ctx.action.obj });
  //     const category = await Category.findOne(product.category);
  //     this.bot.sendPhoto(
  //       ctx.chatID,
  //       Buffer.from(product.img, 'base64'),
  //       {
  //         parse_mode: 'HTML',
  //         caption: `<b>Категорія товарів</b>: ${category.title}\n<b>Назва товару</b>: ${product.title}\n<b>Ціна товару</b>: ${product.pricePer} ${product.priceTitle}`
  //       },
  //       {
  //         filename: undefined,
  //         contentType: undefined
  //       }
  //     );
  //   } catch (err) {
  //     message = t(ctx.lang, 'main:error %s', err.message);
  //   } finally {
  //     this.deleteAction(ctx.chatID);
  //     this.bot.sendMessage(ctx.chatID, message, { parse_mode: 'HTML' });
  //   }
  // }

  // async ['product:delete'](ctx) {
  //   let message = t(ctx.lang, 'main:oops');
  //   let reply_markup = null;
  //   try {
  //     const category = await Category.findAll();
  //     if (category.length) {
  //       this.setAction(ctx.chatID, 'select-delete-category');
  //       message = `👌 Добре, давайте видалимо <b><i>категорію товарів</i></b>.\n\n<i>⁉️ Яку категорію товарів хочемо видалити?</i>\n\n👉 Будь ласка, виберіть зі списку <b><i>категорію товарів</i></b> або натисніть /cancel, щоб скасувати поточну операцію:`;
  //       reply_markup = {
  //         inline_keyboard: category.map((item) => [
  //           { text: item.title, callback_data: item.id }
  //         ])
  //       };
  //     } else {
  //       message = t(ctx.lang, 'category:oops');
  //     }
  //   } catch (err) {
  //     message = t(ctx.lang, 'main:error %s', err.message);
  //   } finally {
  //     this.bot.sendMessage(ctx.chatID, message, {
  //       parse_mode: 'HTML',
  //       reply_markup
  //     });
  //   }
  // }

  // async ['product:delete:select'](ctx) {
  //   const { message_id } = ctx.message || {};
  //   const { id } = ctx.message?.chat || {};
  //   let message = t(ctx.lang, 'main:oops');
  //   let reply_markup = null;
  //   try {
  //     const category = await Category.findOne(ctx.data);
  //     message = `👌 Добре, вибрано категорію товарів "<b><i>${category.title}</i></b>".\n\n<i>Ви дійсно хочете видалити її?</i>\n\n‼️ Зверніть увагу, що при видаленні категорії товарів будуть видалені всі товари цієї категорії!`;
  //     ctx.action.obj.id = category.id;
  //     ctx.action.obj.title = category.title;
  //     this.setActionType(id, 'query-delete-category');
  //     reply_markup = {
  //       inline_keyboard: [
  //         [
  //           { text: 'Так 💯 видалити!', callback_data: 'delete' },
  //           { text: 'Ні, не видаляти!', callback_data: 'cancel' }
  //         ]
  //       ]
  //     };
  //   } catch (err) {
  //     this.deleteAction(ctx.chatID);
  //     message = t(ctx.lang, 'main:error %s', err.message);
  //   } finally {
  //     this.bot.editMessageText(message, {
  //       chat_id: id,
  //       message_id: message_id,
  //       parse_mode: 'HTML',
  //       reply_markup
  //     });
  //   }
  // }

  // async ['product:delete:confirm'](ctx) {
  //   const { message_id } = ctx.message || {};
  //   const { id } = ctx.message?.chat || {};
  //   let message = t(ctx.lang, 'main:oops');
  //   try {
  //     if (ctx.data === 'delete') {
  //       await Category.removeOne(ctx.action.obj.id);
  //       message = `👌 Добре, категорія товарів "<i>${ctx.action.obj.title}</i>" була успішно <b>видалена</b>.`;
  //     } else if (ctx.data === 'cancel') {
  //       message = `👌 Добре, команда була скасована.\n\n<i>Що я ще можу зробити для вас? Надішліть /help для отримання списку команд.</i>`;
  //     }
  //   } catch (err) {
  //     message = t(ctx.lang, 'main:error %s', err.message);
  //   } finally {
  //     this.deleteAction(id);
  //     this.bot.editMessageText(message, {
  //       chat_id: id,
  //       message_id: message_id,
  //       parse_mode: 'HTML'
  //     });
  //   }
  // }
}

class API extends Products {
  constructor(bot) {
    super(bot);
  }
}

module.exports = API;
