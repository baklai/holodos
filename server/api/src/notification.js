const User = require('../../services/user.service');

module.exports = {
  async ['/notification'](ctx) {
    let message =
      this.t(ctx.lang, 'notification') + this.t(ctx.lang, 'bot:cancel');
    this.setAction(ctx.chatID, 'notification:send');
    this.bot.sendMessage(ctx.chatID, message, { parse_mode: 'HTML' });
  },

  async ['notification:send'](ctx) {
    let message = this.t(ctx.lang, 'bot:oops');
    try {
      const users = await User.findAll();
      users.forEach((user) => {
        message =
          `${this.t(ctx.lang, 'bot:hi %s', user.firstName)}\n\n` +
          `${ctx.text}\n\n` +
          `${this.t(ctx.lang, 'bot:help')}`;
        this.bot.sendMessage(user.userID, message, {
          parse_mode: 'HTML'
        });
      });
    } catch (err) {
      message = this.t(ctx.lang, 'bot:error %s', err.message);
    } finally {
      this.deleteAction(ctx.chatID);
    }
  }
};
