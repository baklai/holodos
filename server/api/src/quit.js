const User = require('../../services/user.service');

module.exports = {
  async ['/quit'](ctx) {
    let message = this.p('bot:oops');
    let reply_markup = null;
    try {
      const user = await User.findOne(ctx.user.userID);
      if (user) {
        message =
          `${this.p('bot:hi %s', ctx.user.firstName)}\n\n` +
          this.p('quit:title') +
          this.p('bot:cancel');
        reply_markup = {
          inline_keyboard: [
            [
              {
                text: 'Так 💯 відписатися!',
                callback_data: JSON.stringify({
                  cb: 'quit:confirm',
                  key: 'quit'
                })
              },
              {
                text: 'Ні, не відписуватися!',
                callback_data: JSON.stringify({
                  cb: 'quit:confirm',
                  key: 'cancel'
                })
              }
            ]
          ]
        };
      } else {
        this.deleteAction(ctx.chatID);
        reply_markup = null;
        message =
          `${this.p('bot:hi %s', ctx.user.firstName)}\n\n` +
          `${this.p('quit:anonim')}\n\n` +
          this.p('bot:help');
      }
    } catch (err) {
      this.deleteAction(ctx.chatID);
      reply_markup = null;
      message = this.p('bot:error %s', err.message);
    } finally {
      this.bot.sendMessage(ctx.chatID, message, {
        parse_mode: 'HTML',
        reply_markup: reply_markup
      });
    }
  },

  async ['quit:confirm'](ctx) {
    let message = this.p('bot:oops');
    try {
      const user = await User.findOne(ctx.user.userID);
      switch (ctx.data.key) {
        case 'quit':
          await User.removeOne(user.id);
          message = this.p('quit:confirm:quit');
          break;
        case 'cancel':
          message =
            `${this.p('quit:confirm:cancel')}\n\n` + `${this.p('bot:help')}`;
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
