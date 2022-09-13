const Action = require('./action');

const phrases = require('../config/phrases.json');

module.exports = class Middleware extends Action {
  constructor(bot) {
    super(bot);

    this.LIMIT = 5;
  }

  p(phrase, varible) {
    return phrases[phrase]
      ? varible
        ? phrases[phrase].replace(/%s/g, varible)
        : phrases[phrase]
      : '';
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
    return data?.cb === 'paginate';
  }

  initPaginate(ctx, page, pages) {
    ctx.action.paginate.page = page;
    ctx.action.paginate.pages = pages;
    return [
      {
        text: '<<',
        callback_data: JSON.stringify({ cb: 'paginate', key: 'start' })
      },
      {
        text: '<',
        callback_data: JSON.stringify({ cb: 'paginate', key: 'prev' })
      },
      {
        text: `${page}/${pages}`,
        callback_data: JSON.stringify({ cb: 'paginate', key: 'current' })
      },
      {
        text: '>',
        callback_data: JSON.stringify({ cb: 'paginate', key: 'next' })
      },
      {
        text: '>>',
        callback_data: JSON.stringify({ cb: 'paginate', key: 'end' })
      }
    ];
  }

  btnMenu(msg) {
    return [
      [
        {
          text: this.p('bot:menubtn'),
          web_app: { url: this.WEB_APP }
        }
      ],
      [{ text: '❓ Help' }, { text: '💸 Donate' }]
    ];
  }

  ctx(msg, cb) {
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
      action:
        this.getAction(msg.chat?.id || msg.message?.chat?.id || undefined) ||
        this.setAction(msg.chat?.id || msg.message?.chat?.id || undefined, cb),
      isCommand: this.isCommand(msg),
      isPaginate: this.isPaginate(JSON.parse(msg.data || false)),
      btnMenu: this.btnMenu(msg)
    };
    if (typeof this[cb] === 'function') {
      if (ctx.data) {
        this.setActionType(ctx.data.cb);
        return this[ctx.data.cb](ctx);
      } else {
        return this[cb](ctx);
      }
    }
  }
};
