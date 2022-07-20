/*
 * Holodos Telegram Bot
 * Copyright(c) 2022 Dmitrii Baklai
 * MIT Licensed
 */
process.env.NTBA_FIX_319 = 1;

const consola = require('consola');
const express = require('express');
const mongoose = require('mongoose');
const TelegramBot = require('node-telegram-bot-api');
const User = require('./services/user.service');
const Catalog = require('./services/catalog.service');

const { TELEGRAM_TOKEN, MONGO_URL, PROXY_SERVER, APP_URL } = process.env;

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    consola.info('Success MongoDB connected');
  })
  .catch((err) => {
    consola.error('Failed to connect to MongoDB', err);
    process.exit(0);
  });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
  process.env.NODE_ENV === 'production' ? {} : optionsPolling
);

if (process.env.NODE_ENV === 'production') {
  bot.setWebHook(`${APP_URL}/bot/v1/bot${TELEGRAM_TOKEN}`);
} else {
  bot.on('polling_error', function (err) {
    consola.error(err.code);
  });
}

const commands = [{ command: 'start', description: 'старт' }];

bot
  .setMyCommands([...commands], {})
  .then(function (msg) {
    msg ? consola.info('Telegram Bot is running...') : process.exit(1);
  })
  .catch((err) => {
    consola.error(err.code);
    consola.error(err.response);
    process.exit(1);
  });

bot.onText(/\/start/, async (msg) => {
  const { id } = msg.chat;
  const html = `<b>Вітання <i>${msg.from.first_name}</i></b>!\n\n<i>Я допоможу зробити процес походу в магазин простіше, швидше, і найголовніше, ефективніше.</i>\n\nВідкрий холодос, щоб почати 👇`;

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
      consola.error(err.code);
      consola.error(err.response.body);
    });

  await User.createOne(msg.chat);
});

bot.on('web_app_data', async (msg) => {
  const { products, price, comment } = JSON.parse(msg.web_app_data.data);

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
        consola.error(err.code);
        consola.error(err.response.body);
      });
  } else {
    let html = '🗣 <b>Ваш список продуктів порожній!</b>';
    bot.sendMessage(msg.chat.id, html, { parse_mode: 'HTML' }).catch((err) => {
      consola.error(err.code);
      consola.error(err.response.body);
    });
  }

  await User.createOne(msg.chat);
});

app.post(`/bot${TELEGRAM_TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

app.get('/catalog', async (req, res, next) => {
  try {
    const items = await Catalog.allСatalog();
    res.status(200).json(items);
  } catch (err) {
    next(err);
  }
});

app.get('/catalog/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const items = await Catalog.oneСatalog(id);
    res.status(200).json(items);
  } catch (err) {
    next(err);
  }
});

app.use((req, res, next) => {
  res.status(404).json({ message: 'Oops! Error 404 has occurred' });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: 'Oops! Internal server error' });
});

consola.info('Bot server success is running');

module.exports = app;
