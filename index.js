/*
 * Holodos Telegram Bot
 * Copyright(c) 2022 Dmitrii Baklai
 * MIT Licensed
 */
process.env.NTBA_FIX_319 = 1;

const path = require('path');
const dotenv = require('dotenv');
const TelegramBot = require('node-telegram-bot-api');

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.join(__dirname, '.env') });
  if (dotenv.error) {
    console.error(dotenv.error);
    process.exit(1);
  }
}

const { TELEGRAM_TOKEN, PROXY_SERVER, APP_URL, WEB_APP_URL } = process.env;

const optionsWebHook = {
  webHook: {
    port: process.env.PORT
  }
};

const optionsPolling = {
  filepath: false,
  polling: {
    interval: 300,
    autoStart: true,
    params: { timeout: 10 }
  },
  request: {
    proxy: PROXY_SERVER ? PROXY_SERVER : null
  }
};

const bot = new TelegramBot(
  TELEGRAM_TOKEN,
  process.env.NODE_ENV === 'production' ? optionsWebHook : optionsPolling
);

if (process.env.NODE_ENV === 'production') {
  bot.setWebHook(`${APP_URL}/bot${TELEGRAM_TOKEN}`);
} else {
  bot.on('polling_error', function (err) {
    console.error(err.code);
  });
}

const commands = [{ command: 'start', description: 'старт' }];

bot
  .setMyCommands([...commands], {})
  .then(function (msg) {
    msg ? console.log('Telegram Bot is running...') : process.exit(1);
  })
  .catch((err) => {
    console.log(err.code);
    console.log(err.response);
    process.exit(1);
  });

bot.onText(/\/start/, function (msg) {
  const { id } = msg.chat;
  const html = `<b>Привет <i>${msg.from.first_name}</i></b>!\n\n<i>Я помогу сдулать процесс похода в магазин проще, быстрее, и что самое главное, эффективнее.</i>\n\nОткрой холодос, чтобы начать 👇`;
  bot
    .sendMessage(id, html, {
      parse_mode: 'HTML',
      reply_markup: {
        keyboard: [
          [
            {
              text: '🍎🍉🥑 Открыть холодос 🍊🥩🍆',
              web_app: { url: WEB_APP_URL }
            }
          ]
        ],
        resize_keyboard: true
      }
    })
    .catch((err) => {
      console.error(err.code);
      console.error(err.response.body);
    });
});

bot.on('web_app_data', function (msg) {
  const data = JSON.parse(msg.web_app_data.data);
  if (data.length > 0) {
    let html = '🔖 <b>Ваш список продуктов:</b>\n\n';
    data.forEach((el, index) => {
      html += `<b>${index + 1}</b>. 👉  ${el}\n`;
    });
    bot
      .sendMessage(msg.chat.id, html, {
        parse_mode: 'HTML'
      })
      .catch((err) => {
        console.error(err.code);
        console.error(err.response.body);
      });
  } else {
    let html = '🗣 <b>Ваш список продуктов пуст!</b>';
    bot.sendMessage(msg.chat.id, html, { parse_mode: 'HTML' }).catch((err) => {
      console.error(err.code);
      console.error(err.response.body);
    });
  }
});
