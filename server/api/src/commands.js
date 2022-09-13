const User = require('../../services/user.service');
const Stat = require('../../services/statistic.service');

const { helper } = require('../config/commands');

module.exports = {
  async ['/start'](ctx) {
    const message =
      `${this.p('bot:hi %s', ctx.user.firstName)}\n\n` +
      `${this.p('start:title')}\n\n` +
      `${this.p('bot:help')}\n\n` +
      `${this.p('bot:created %s', new Date().getFullYear())}\n\n` +
      `${this.p('start:subtitle')}`;

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
    let message =
      `${this.p('bot:hi %s', ctx.user.firstName)}\n\n` +
      `${this.p('help:title')}\n\n`;

    message += `${helper.main.commands
      .map((item) => `/${item.command} - ${item.description}`)
      .join('\n')}`;

    message += `\n\n<b><i>${
      helper.category.description
    }</i></b>\n${helper.category.commands
      .map((item) => `/${item.command} - ${item.description}`)
      .join('\n')}`;

    message += `\n\n<b><i>${
      helper.product.description
    }</i></b>\n${helper.product.commands
      .map((item) => `/${item.command} - ${item.description}`)
      .join('\n')}`;

    message += `\n\n<b><i>${
      helper.operation.description
    }</i></b>\n${helper.operation.commands
      .map((item) => `/${item.command} - ${item.description}`)
      .join('\n')}`;

    const user = await User.findOne(ctx.user.userID);
    if (user?.isAdmin) {
      message += `\n\n<b><i>${
        helper.administration.description
      }</i></b>\n${helper.administration.commands
        .map((item) => `/${item.command} - ${item.description}`)
        .join('\n')}`;
    }

    message += `\n\n${this.p('bot:created %s', new Date().getFullYear())}`;

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
      `${this.p('bot:hi %s', ctx.user.firstName)}\n\n` +
      `${this.p('about:title')}\n\n` +
      `${this.p('about:list:a')}\n` +
      `${this.p('about:list:b')}\n` +
      `${this.p('about:list:c')}\n` +
      `${this.p('about:list:d')}\n\n` +
      `${this.p('bot:help')}\n\n` +
      `${this.p('bot:created %s', new Date().getFullYear())}`;
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
      `${this.p('bot:hi %s', ctx.user.firstName)}\n\n` +
      `${this.p('stat:title')}\n\n` +
      `${this.p('stat:users %s', stat.users)}\n` +
      `${this.p('stat:categories %s', stat.categories)}\n` +
      `${this.p('stat:products %s', stat.products)}\n\n` +
      `${this.p('bot:help')}`;
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
    let message = this.p('bot:oops');
    let reply_markup = null;
    try {
      message =
        `${this.p('bot:hi %s', ctx.user.firstName)}\n\n` +
        `${this.p('donate:text')}\n\n` +
        `${this.p('bot:help')}\n\n` +
        `${this.p('bot:created %s', new Date().getFullYear())}`;
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
      message = this.p('bot:error %s', err.message);
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
    let message = this.p('bot:oops');
    if (ctx.action) {
      this.deleteAction(ctx.chatID);
      message = `${this.p('action:cancel:yes')}\n\n`;
    } else {
      message = `${this.p('action:cancel:no')}\n\n`;
    }
    message += this.p('bot:help');
    this.bot.sendMessage(ctx.chatID, message, { parse_mode: 'HTML' });
  }
};
