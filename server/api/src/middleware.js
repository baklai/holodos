const Action = require('./action');

const i18n = require('../../config/i18n.config');

module.exports = class Middleware extends Action {
  constructor(bot, TOKEN, WEB_APP) {
    super(bot);

    this.TOKEN = TOKEN;

    this.WEB_APP = WEB_APP;

    this.LIMIT = 5;

    this.BOT_BUTTON = [
      [{ text: 'Відкрити холодос', web_app: { url: this.WEB_APP } }],
      [{ text: '❓ Help' }, { text: '💸 Donate' }]
    ];
  }

  t(locale = 'en', phrase, varible) {
    return i18n.__({ phrase: phrase, locale: locale }, varible);
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

  isPaginate(data) {
    return data?.type === 'paginate';
  }

  initPaginate(ctx, page, pages) {
    ctx.action.paginate.page = page;
    ctx.action.paginate.pages = pages;
    return [
      {
        text: '<<',
        callback_data: JSON.stringify({ type: 'paginate', key: 'prev' })
      },
      {
        text: `${page} ... ${pages}`,
        callback_data: JSON.stringify({ type: 'paginate', key: 'current' })
      },
      {
        text: '>>',
        callback_data: JSON.stringify({ type: 'paginate', key: 'next' })
      }
    ];
  }

  ctx(msg, next) {
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
      data: JSON.parse(msg.data || false) || undefined,
      photo: msg.photo || undefined,
      document: msg.document || undefined,
      lang: this.isLang(msg),
      action:
        this.getAction(msg.chat?.id || msg.message?.chat?.id || undefined) ||
        this.setAction(
          msg.chat?.id || msg.message?.chat?.id || undefined,
          next
        ),
      isCommand: this.isCommand(msg),
      isPaginate: this.isPaginate(JSON.parse(msg.data || false))
    };
    if (typeof this[next] === 'function') {
      if (ctx.data) {
        this.setActionType(ctx.data.type);
        return this[ctx.data.type](ctx);
      } else {
        return this[next](ctx);
      }
    }
  }
};
