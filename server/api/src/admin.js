const User = require('../../services/user.service');

module.exports = {
  async ['/admin'](ctx) {
    let message = this.p('bot:oops');
    try {
      const user = await User.findOne(ctx.user.userID);
      if (user?.isAdmin) {
        message = `<b>SECRET</b>: <code>${this.SECRET}</code>`;
        this.deleteAction(ctx.chatID);
      } else {
        message =
          `${this.p('bot:hi %s', ctx.user.firstName)}\n\n` +
          this.p('admin:confirm') +
          this.p('bot:cancel');
        this.setAction(ctx.chatID, 'admin:send');
      }
    } catch (err) {
      this.deleteAction(ctx.chatID);
      message = this.p('bot:error %s', err.message);
    } finally {
      this.bot.sendMessage(ctx.chatID, message, { parse_mode: 'HTML' });
    }
  },

  async ['admin:send'](ctx) {
    let message = this.p('bot:oops');
    try {
      if (ctx.text === this.SECRET) {
        await User.createOne({ userID: ctx.user.userID, isAdmin: true });
        message =
          `${this.p('bot:hi %s', ctx.user.firstName)}\n\n` +
          `${this.p('admin:confirm:ok')}\n\n` +
          `${this.p('bot:help')}`;
      } else {
        await User.createOne({ userID: ctx.user.userID, isAdmin: false });
        message =
          `${this.p('bot:hi %s', ctx.user.firstName)}\n\n` +
          `${this.p('admin:confirm:cancel')}\n\n` +
          `${this.p('bot:help')}`;
      }
    } catch (err) {
      message = this.p('bot:error %s', err.message);
    } finally {
      this.deleteAction(ctx.chatID);
      this.bot.sendMessage(ctx.user.userID, message, {
        parse_mode: 'HTML'
      });
    }
  }
};
