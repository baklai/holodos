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

const commands = [
  { command: 'start', description: 'запуск бота' },
  { command: 'info', description: 'информация о боте' }
];

bot
  .setMyCommands([...commands], {})
  .then(function (msg) {
    msg ? console.log('Telegram Bot is running...') : process.exit(1);
  })
  .catch((err) => {
    console.error(err.code);
    console.error(err.response);
    process.exit(1);
  });

bot.onText(/\/start/, function (msg) {
  const { id } = msg.chat;
  const html = `
    <b>Привет <i>${msg.from.first_name}</i></b>!\n
    <i>Я помогу сдулать процесс похода в магазин
    проще, быстрее, и что самое главное, эффективнее.</i>\n
    <b>Список быстрых ссылок:</b>
    <b>&#187;</b> /start - запуск бота
    <b>&#187;</b> /info  - информация о боте\n
    `;
  bot
    .sendMessage(id, html, {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Открыть холодильник',
              web_app: { url: WEB_APP_URL }
              // callback_data: '1100'
            }
          ]
        ]
      }
    })
    .catch((err) => {
      console.error(err.code);
      console.error(err.response.body);
    });
});

bot.onText(/\/info/, function (msg) {
  const { id } = msg.chat;
  const html = `<b>Привет <i>${msg.from.first_name}</i></b>!\n\n<b>Холодос</b> – это бот-приложение, делающее процесс похода в магазин проще, быстрее, и что самое главное, эффективнее. Благодаря боту Вы сможете быстро создавать и управлять списками покупок, делать их доступными знакомым. Все изменения сохраняются в чате, и у Вас в любое время есть к ним доступ как с телефона, так и через веб-сайт.`;

  bot.sendMessage(id, html, { parse_mode: 'HTML' }).catch((err) => {
    console.error(err.code);
    console.error(err.response.body);
  });
});

// bot.on('callback_query', query => {
//     bot.sendMessage(chatId, 'Клавиатура', {
//     reply_markup: {
//       keyboard: [
//         [
//           {
//             text: 'Открыть холодильник',
//             web_app: { url: 'https://baklai.github.io/holodos/' }
//           }
//         ]
//       ]
//     }
//   });
// })

// bot.on('message', (msg) => {
//   const chatId = msg.chat.id;

//   bot.sendMessage(chatId, 'Клавиатура', {
//     reply_markup: {
//       keyboard: [
//         [
//           {
//             text: 'Открыть холодильник',
//             web_app: { url: 'https://baklai.github.io/holodos/' }
//           }
//         ]
//       ]
//     }
//   });
// });

bot.on('web_app_data', function (msg) {
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
