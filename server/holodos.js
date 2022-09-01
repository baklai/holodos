/*
 * Holodos Telegram Bot
 * Copyright(c) 2022 Dmitrii Baklai
 * MIT Licensed
 */
process.env.NTBA_FIX_319 = 1;
process.env.NTBA_FIX_350 = 1;

const TelegramBot = require('node-telegram-bot-api');

const { TOKEN, PROXY, WEB_APP } = process.env;

const APIBot = require('./api');

const bot = new TelegramBot(
  TOKEN,
  process.env.NODE_ENV === 'production'
    ? {}
    : {
        filepath: false,
        polling: {
          interval: 300,
          autoStart: true,
          params: { timeout: 10 }
        },
        request: {
          proxy: PROXY ? PROXY : null
        }
      }
);

const api = new APIBot(bot, TOKEN, WEB_APP);

if (process.env.NODE_ENV === 'production') {
  bot.setWebHook(`${WEB_APP}/bot/v1/bot${TOKEN}`);
} else {
  bot.on('polling_error', (err) => {
    console.error(err);
    process.exit(1);
  });
}

const { commands } = require('./config/commands');

bot
  .setMyCommands(commands)
  .then((msg) => {
    console.info('Telegram Bot is running...');
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

bot.onText(/\/(.)/, async (msg) => {
  api.ctx(msg, msg.text);
});

bot.on('message', async (msg) => {
  const { id } = msg.chat;
  const isCommand = api.isCommand(msg);
  const action = api.getAction(id);
  if (action && !isCommand) {
    try {
      api.ctx(msg, action.type);
    } catch (err) {
      api.deleteAction(id);
      bot.sendMessage(id, '💢 <b>Упс!</b> Щось пішло не так!', {
        parse_mode: 'HTML'
      });
    }
  } else if (!isCommand && !msg.web_app_data) {
    bot.sendMessage(
      id,
      '✌️ Дуже цікаво, але я поки що не вмію вести розмову!',
      {
        parse_mode: 'HTML'
      }
    );
  }
});

bot.on('callback_query', async (query) => {
  const { id } = query.message.chat;
  const action = api.getAction(id);
  const { type } = JSON.parse(query.data || false);
  if (action) {
    try {
      api.ctx(query, type);
    } catch (err) {
      api.deleteAction(id);
      bot.sendMessage(id, '💢 <b>Упс!</b> Щось пішло не так!', {
        parse_mode: 'HTML'
      });
    }
  } else {
    bot.sendMessage(id, '✌️ Дивно, але я не зрозумів, що від мене потрібно!', {
      parse_mode: 'HTML'
    });
  }
});

bot.on('web_app_data', async (msg) => {
  const { id } = msg.chat;
  const { order, price, comment } = JSON.parse(msg.web_app_data.data);
  let message = '';
  if (order) {
    message = '🔖 <b>Ваш список товарів:</b>\n';
    for (const key in order) {
      message += `\n<b>${key}</b>\n`;
      order[key].forEach((item, index) => {
        message += `   <b>${index + 1}</b>. ${item.title} (<b>${
          item.count
        }x</b>) - <i>${item.pricePer} ${item.priceTitle}</i>\n`;
      });
    }
    price ? (message += `\n<b>ВСЬОГО:</b> ₴${price}`) : (message += '');
    comment
      ? (message += `\n<b>Ваш коментар:</b> <i>${comment}</i>`)
      : (message += '');
  } else {
    message = '🗣 <b>Ваш перелік товарів порожній!</b>';
  }
  bot.sendMessage(id, message, { parse_mode: 'HTML' });
});

module.exports = bot;
