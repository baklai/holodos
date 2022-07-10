/*
 * Holodos Telegram Bot
 * Copyright(c) 2022 Dmitrii Baklai
 * MIT Licensed
 */

const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });

if (dotenv.error) {
  console.error(dotenv.error);
  process.exit(1);
}

// Application config
const { TELEGRAM_TOKEN, PROXY_SERVER, WEB_APP_URL } = process.env;

// Permanent fix : 319
process.env.NTBA_FIX_319 = 1;

// Telegram Modules
const TelegramBot = require('node-telegram-bot-api');

// Create a bot that uses 'polling' to fetch new updates
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

const commands = [
  { command: 'start', description: 'старт' },
  { command: 'about', description: 'о боте' },
  { command: 'help', description: 'справка' }
];

// Create the list of the bot commands
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

// Polling error
bot.on('polling_error', function (err) {
  console.log(err.code);
});

bot.onText(/\/start/, function (msg) {
  const { id } = msg.chat;
  const html = `
    <b>Привет <i>${msg.from.first_name}</i></b>!
    <i>Я могу помочь тебе в использовании <b></b>.</i>\n
    <b>Список быстрых ссылок:</b>
    <b>&#187;</b> /help - справка по коммандам
    <b>&#187;</b> /status - статус устройства\n
    <b>Мой GitHub профиль:</b>
    https://github.com/baklai
    `;
  bot
    .sendMessage(id, html, {
      parse_mode: 'HTML',
      disable_web_page_preview: true
    })
    .catch((err) => {
      console.log(err.code);
      console.log(err.response.body);
    });
});

bot.onText(/\/help/, function (msg) {
  const { id } = msg.chat;
  const html = `<b>Привет <i>${msg.from.first_name}</i></b>!`;
  let command = `\nТы можешь управлять мной, <b>отправляя эти команды</b>:\n`;
  command += `\n<b>${cmd.main.description}:</b>`;
  cmd.main.commands.forEach(function (item) {
    command += `\n/${item.command} - ${item.description}`;
  });
  command += `\n\n<b>${cmd.method.description}:</b>`;
  cmd.method.commands.forEach(function (item) {
    command += `\n/${item.command} - ${item.description}`;
  });
  bot.sendMessage(id, html + command, { parse_mode: 'HTML' }).catch((err) => {
    console.log(err.code);
    console.log(err.response.body);
  });
});

bot.onText(/\/status/, function (msg) {
  const html = `
      <b>Привет <i>${msg.from.first_name}</i></b>!\n
      <b>Статус утсройства:</b>`;
  bot
    .sendMessage(msg.chat.id, html, {
      parse_mode: 'HTML',
      disable_web_page_preview: true
    })
    .catch((err) => {
      console.log(err.code);
      console.log(err.response.body);
    });
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, 'Клавиатура', {
    reply_markup: {
      keyboard: [
        [
          {
            text: 'Открыть холодильник',
            web_app: { url: 'https://baklai.github.io/holodos/' }
          }
        ]
      ]
    }
  });
});

bot.on('web_app_data', (msg) => {
  console.log(msg);
});

// bot.onWebAppData('web_app_data', (msg) => {
//   console.log(msg);
// });
