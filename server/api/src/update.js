const User = require('../../services/user.service');

const DBUPDATE = require('./scraping');

module.exports = {
  async ['/update'](ctx) {
    let message = this.t(ctx.lang, 'bot:oops');
    try {
      const user = await User.findOne(ctx.user.userID);
      if (user?.isAdmin) {
        await DBUPDATE();
        const users = await User.findAll();
        users.forEach((user) => {
          message =
            `${this.t(ctx.lang, 'bot:hi %s', user.firstName)}\n\n` +
            `${this.t(ctx.lang, 'update')}\n\n` +
            this.t(ctx.lang, 'bot:help');
          this.bot.sendMessage(user.userID, message, {
            parse_mode: 'HTML'
          });
        });
        message = 'Notification sent to all users';
      } else {
        message =
          `${this.t(ctx.lang, 'bot:hi %s', ctx.user.firstName)}\n\n` +
          `${this.t(ctx.lang, 'bot:notadmin')}\n\n` +
          this.t(ctx.lang, 'bot:help');
      }
    } catch (err) {
      message = this.t(ctx.lang, 'bot:error %s', err.message);
    } finally {
      this.deleteAction(ctx.chatID);
      this.bot.sendMessage(ctx.chatID, message, { parse_mode: 'HTML' });
    }
  }
};
