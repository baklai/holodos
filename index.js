/*
 * Holodos Telegram Bot
 * Copyright(c) 2022 Dmitrii Baklai
 * MIT Licensed
 */
process.env.NTBA_FIX_319 = 1;

const path = require('path');
const dotenv = require('dotenv');
const TelegramBot = require('node-telegram-bot-api');

dotenv.config({ path: path.join(__dirname, '.env') });

if (dotenv.error) {
  console.error(dotenv.error);
  process.exit(1);
}

const { TELEGRAM_TOKEN, PROXY_SERVER, WEB_APP_URL } = process.env;

const bot = new TelegramBot(TELEGRAM_TOKEN, {
  filepath: false,
  polling: {
    interval: 300,
    autoStart: true,
    params: { timeout: 10 }
  },
  request: {
    proxy: PROXY_SERVER ? PROXY_SERVER : null
  }
});

bot.on('polling_error', function (err) {
  console.error(err.code);
});

const form = {
  menu_button: JSON.stringify({
    type: 'web_app',
    text: '👉 Открыть холодос',
    web_app: { url: WEB_APP_URL }
  })
};

bot
  .setChatMenuButton(form)
  .then(function (msg) {
    msg ? console.log('Telegram Bot is running...') : process.exit(1);
  })
  .catch(function (err) {
    console.error(err);
  });

bot.onText(/\/start/, function (msg) {
  const { id } = msg.chat;
  const html = `<b>Привет <i>${msg.from.first_name}</i></b>!\n\n<i>Я помогу сдулать процесс похода в магазин проще, быстрее, и что самое главное, эффективнее.</i>\n\n👇 Открой холодос, чтобы начать...`;
  bot
    .sendMessage(id, html, {
      parse_mode: 'HTML'
    })
    .catch((err) => {
      console.error(err.code);
      console.error(err.response.body);
    });
});

bot.on('web_app_data', function (msg) {
  console.log(msg);

  const data = JSON.parse(msg.web_app_data.data);
  if (data.length > 0) {
    let html = '<b>Список продуктов:</b>\n';
    data.forEach((el, index) => {
      html += `<b>${index + 1}</b>. ${el}\n`;
    });
    bot.sendMessage(msg.chat.id, html, { parse_mode: 'HTML' }).catch((err) => {
      console.error(err.code);
      console.error(err.response.body);
    });
  } else {
    let html = '<b>Список продуктов пуст!</b>';
    bot.sendMessage(msg.chat.id, html, { parse_mode: 'HTML' }).catch((err) => {
      console.error(err.code);
      console.error(err.response.body);
    });
  }
});

// bot.on('1100', (query) => {
//   console.log(query);
// });

// bot.answerWebAppQuery('1100', result).then(function (msg) {
//   console.log(msg);
// });
