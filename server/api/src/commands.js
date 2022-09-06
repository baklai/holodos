const User = require('../../services/user.service');
const Stat = require('../../services/statistic.service');

const { helper } = require('../../config/commands');

module.exports = {
  async ['/start'](ctx) {
    const message =
      `${this.t(ctx.lang, 'bot:hi %s', ctx.user.firstName)}\n\n` +
      `${this.t(ctx.lang, 'start:title')}\n\n` +
      `${this.t(ctx.lang, 'bot:help')}\n\n` +
      `${this.t(ctx.lang, 'bot:created %s', new Date().getFullYear())}\n\n` +
      `${this.t(ctx.lang, 'start:subtitle')}`;

    this.bot.sendMessage(ctx.chatID, message, {
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      reply_markup: {
        keyboard: ctx.btnMenu,
        resize_keyboard: true
      }
    });
    this.deleteAction(ctx.chatID);
    await User.createOne(ctx.user);
  },

  async ['/help'](ctx) {
    const message =
      `${this.t(ctx.lang, 'bot:hi %s', ctx.user.firstName)}\n\n` +
      `${this.t(ctx.lang, 'help:title')}\n` +
      `${helper}\n\n` +
      `${this.t(ctx.lang, 'bot:created %s', new Date().getFullYear())}`;
    this.deleteAction(ctx.chatID);
    this.bot.sendMessage(ctx.chatID, message, {
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      reply_markup: {
        keyboard: ctx.btnMenu,
        resize_keyboard: true
      }
    });
    await User.createOne(ctx.user);
  },

  async ['/about'](ctx) {
    let message =
      `${this.t(ctx.lang, 'bot:hi %s', ctx.user.firstName)}\n\n` +
      `${this.t(ctx.lang, 'about:title')}\n\n` +
      `${this.t(ctx.lang, 'about:list:a')}\n` +
      `${this.t(ctx.lang, 'about:list:b')}\n` +
      `${this.t(ctx.lang, 'about:list:c')}\n` +
      `${this.t(ctx.lang, 'about:list:d')}\n\n` +
      `${this.t(ctx.lang, 'bot:help')}\n\n` +
      `${this.t(ctx.lang, 'bot:created %s', new Date().getFullYear())}`;
    this.deleteAction(ctx.chatID);
    this.bot.sendMessage(ctx.chatID, message, {
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      reply_markup: {
        keyboard: ctx.btnMenu,
        resize_keyboard: true
      }
    });
    await User.createOne(ctx.user);
  },

  async ['/statistic'](ctx) {
    const stat = await Stat.statAll();
    const message =
      `${this.t(ctx.lang, 'bot:hi %s', ctx.user.firstName)}\n\n` +
      `${this.t(ctx.lang, 'stat:title')}\n\n` +
      `${this.t(ctx.lang, 'stat:users %s', stat.users)}\n` +
      `${this.t(ctx.lang, 'stat:categories %s', stat.categories)}\n` +
      `${this.t(ctx.lang, 'stat:products %s', stat.products)}\n\n` +
      `${this.t(ctx.lang, 'bot:help')}`;
    this.deleteAction(ctx.chatID);
    this.bot.sendMessage(ctx.chatID, message, {
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      reply_markup: {
        keyboard: ctx.btnMenu,
        resize_keyboard: true
      }
    });
  },

  async ['/donate'](ctx) {
    let message = this.t(ctx.lang, 'bot:oops');
    let reply_markup = null;
    try {
      message =
        `${this.t(ctx.lang, 'bot:hi %s', ctx.user.firstName)}\n\n` +
        `${this.t(ctx.lang, 'donate:text')}\n\n` +
        `${this.t(ctx.lang, 'bot:help')}\n\n` +
        `${this.t(ctx.lang, 'bot:created %s', new Date().getFullYear())}`;
      reply_markup = {
        inline_keyboard: [
          [
            {
              text: '💸 DONATE FOR BOT',
              url: this.PAYEE
            }
          ]
        ]
      };
    } catch (err) {
      reply_markup = null;
      message = this.t(ctx.lang, 'bot:error %s', err.message);
    } finally {
      this.deleteAction(ctx.chatID);
      this.bot.sendMessage(ctx.chatID, message, {
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        reply_markup: reply_markup
      });
    }
  },

  async ['/cancel'](ctx) {
    let message = this.t(ctx.lang, 'bot:oops');
    if (ctx.action) {
      this.deleteAction(ctx.chatID);
      message = `${this.t(ctx.lang, 'action:cancel:yes')}\n\n`;
    } else {
      message = `${this.t(ctx.lang, 'action:cancel:no')}\n\n`;
    }
    message += this.t(ctx.lang, 'bot:help');
    this.bot.sendMessage(ctx.chatID, message, { parse_mode: 'HTML' });
  }
};
