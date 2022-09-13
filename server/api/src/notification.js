const User = require('../../services/user.service');

module.exports = {
  async ['/notification'](ctx) {
    let message = this.p('bot:oops');
    try {
      const user = await User.findOne(ctx.user.userID);
      if (user?.isAdmin) {
        message = this.p('notification') + this.p('bot:cancel');
        this.setAction(ctx.chatID, 'notification:send');
      } else {
        message =
          `${this.p('bot:hi %s', ctx.user.firstName)}\n\n` +
          `${this.p('bot:notadmin')}\n\n` +
          this.p('bot:help');
      }
    } catch (err) {
      this.deleteAction(ctx.chatID);
      message = this.p('bot:error %s', err.message);
    } finally {
      this.bot.sendMessage(ctx.chatID, message, { parse_mode: 'HTML' });
    }
  },

  async ['notification:send'](ctx) {
    let message = this.p('bot:oops');
    try {
      const users = await User.findAll();
      users.forEach((user) => {
        message =
          `${this.p('bot:hi %s', user.firstName)}\n\n` +
          `${ctx.text}\n\n` +
          `${this.p('bot:help')}`;
        this.bot.sendMessage(user.userID, message, {
          parse_mode: 'HTML'
        });
      });
    } catch (err) {
      message = this.p('bot:error %s', err.message);
    } finally {
      this.deleteAction(ctx.chatID);
    }
  }
};
