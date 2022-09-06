const User = require('../../services/user.service');

module.exports = {
  async ['/admin'](ctx) {
    let message = this.t(ctx.lang, 'bot:oops');
    try {
      message =
        `${this.t(ctx.lang, 'bot:hi %s', ctx.user.firstName)}\n\n` +
        this.t(ctx.lang, 'admin:confirm') +
        this.t(ctx.lang, 'bot:cancel');
      this.setAction(ctx.chatID, 'admin:send');
    } catch (err) {
      this.deleteAction(ctx.chatID);
      message = this.t(ctx.lang, 'bot:error %s', err.message);
    } finally {
      this.bot.sendMessage(ctx.chatID, message, { parse_mode: 'HTML' });
    }
  },

  async ['admin:send'](ctx) {
    let message = this.t(ctx.lang, 'bot:oops');
    try {
      if (ctx.text === this.SECRET) {
        await User.createOne({ userID: ctx.user.userID, isAdmin: true });
        message =
          `${this.t(ctx.lang, 'bot:hi %s', ctx.user.firstName)}\n\n` +
          `${this.t(ctx.lang, 'admin:confirm:ok')}\n\n` +
          `${this.t(ctx.lang, 'bot:help')}`;
      } else {
        await User.createOne({ userID: ctx.user.userID, isAdmin: false });
        message =
          `${this.t(ctx.lang, 'bot:hi %s', ctx.user.firstName)}\n\n` +
          `${this.t(ctx.lang, 'admin:confirm:cancel')}\n\n` +
          `${this.t(ctx.lang, 'bot:help')}`;
      }
    } catch (err) {
      message = this.t(ctx.lang, 'bot:error %s', err.message);
    } finally {
      this.deleteAction(ctx.chatID);
      this.bot.sendMessage(ctx.user.userID, message, {
        parse_mode: 'HTML'
      });
    }
  }
};
