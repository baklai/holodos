/*
 * Holodos Telegram Bot
 * Copyright(c) 2022 Dmitrii Baklai
 * MIT Licensed
 */
process.env.NTBA_FIX_319 = 1;

const mongoose = require('mongoose');
const TelegramBot = require('node-telegram-bot-api');
const User = require('./models/user.model');

export default function () {
  this.nuxt.hook('listen', (server, { host, port }) => {
    const { TELEGRAM_TOKEN, MONGO_URL, PROXY_SERVER, APP_URL } = process.env;

    mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const optionsWebHook = {
      webHook: {
        port: port //process.env.PORT
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
      const html = `<b>Вітання <i>${msg.from.first_name}</i></b>!\n\n<i>Я допоможу зробити процес походу в магазин простіше, швидше, і найголовніше, ефективніше.</i>\n\nВідкрий холодос, щоб почати 👇`;

      User.findOneAndUpdate(
        {
          chat_id: msg.chat.id
        },
        {
          $set: {
            chat_id: msg.chat.id,
            first_name: msg.chat.first_name,
            last_name: msg.chat.last_name,
            username: msg.chat.username
          }
        },
        {
          new: true,
          upsert: true
        },
        (err, doc) => {
          if (err) {
            console.error('Something wrong when updating data!');
          }
          bot
            .sendMessage(id, html, {
              parse_mode: 'HTML',
              reply_markup: {
                keyboard: [
                  [
                    {
                      text: '🍎🍉🥑 Відкрити холодос 🍊🥩🍆',
                      web_app: { url: APP_URL }
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
        }
      );
    });

    bot.on('web_app_data', function (msg) {
      const { products, price, comment } = JSON.parse(msg.web_app_data.data);

      User.findOneAndUpdate(
        {
          chat_id: msg.chat.id
        },
        {
          $set: {
            chat_id: msg.chat.id,
            first_name: msg.chat.first_name,
            last_name: msg.chat.last_name,
            username: msg.chat.username
          }
        },
        {
          new: true,
          upsert: true
        },
        (err, doc) => {
          if (err) {
            console.error('Something wrong when updating data!');
          }
        }
      );

      if (products.length > 0) {
        let html = '🔖 <b>Ваш список продуктів:</b>\n\n';
        products.forEach((el, index) => {
          html += `<b>${index + 1}</b>. ${el.title} (${el.counter}x) - <i>${
            el.price
          } ${el.priceTitle}</i>\n`;
        });

        price ? (html += `\n<b>ВСЬОГО:</b> ₴${price}`) : (html += '');

        comment
          ? (html += `\n<b>Ваш коментар:</b> <i>${comment}</i>`)
          : (html += '');

        bot
          .sendMessage(msg.chat.id, html, {
            parse_mode: 'HTML'
          })
          .catch((err) => {
            console.error(err.code);
            console.error(err.response.body);
          });
      } else {
        let html = '🗣 <b>Ваш список продуктів порожній!</b>';
        bot
          .sendMessage(msg.chat.id, html, { parse_mode: 'HTML' })
          .catch((err) => {
            console.error(err.code);
            console.error(err.response.body);
          });
      }
    });
  });
}
