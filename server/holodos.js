/*
 * Holodos Telegram Bot
 * Copyright(c) 2022 Dmitrii Baklai
 * MIT Licensed
 */
process.env.NTBA_FIX_319 = 1;
process.env.NTBA_FIX_350 = 1;

const TelegramBot = require('node-telegram-bot-api');

const { TOKEN, PROXY, WEB_APP } = process.env;

const ActionsBot = require('./lib/actions');
const User = require('./services/user.service');
const Stat = require('./services/statistic.service');

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

const api = new ActionsBot(bot);

if (process.env.NODE_ENV === 'production') {
  bot.setWebHook(`${WEB_APP}/bot/v1/bot${TOKEN}`);
} else {
  bot.on('polling_error', (err) => {
    console.error(err);
    process.exit(1);
  });
}

const { commands, helper } = require('./lib/commands');

bot
  .setMyCommands(commands)
  .then((msg) => {
    console.info('Telegram Bot is running...');
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

bot.onText(/\/start/, async (msg) => {
  const { id } = msg.chat;
  let message = `👋 <b>Вітання <i>${msg.from.first_name}</i></b>!\n\n💪 Я допоможу зробити процес походу до магазину простіше, швидше та найголовніше, ефективніше.\n\n<i>👉 Ви можете керувати ботом, надіславши команди зі списку /help</i>\n\n<i><b>Відкрий холодос, щоб почати</b></i> 👇`;
  let reply_markup = {
    keyboard: [[{ text: 'Відкрити холодос', web_app: { url: WEB_APP } }]],
    resize_keyboard: true
  };
  bot.sendMessage(id, message, { parse_mode: 'HTML', reply_markup });
  await User.createOne(msg.chat);
});

bot.onText(/\/help/, async (msg) => {
  const { id } = msg.chat;
  let message = `👋 <b>Вітання <i>${msg.from.first_name}</i></b>!\n\nЯ можу допомогти Вам створити та керувати списком товарів. Ви можете керувати мною, надіславши наступні команди:\n${helper}`;
  let reply_markup = {
    keyboard: [[{ text: 'Відкрити холодос', web_app: { url: WEB_APP } }]],
    resize_keyboard: true
  };

  bot.sendMessage(id, message, { parse_mode: 'HTML', reply_markup });

  // временно
  await User.createOne(msg.chat);
});

bot.onText(/\/about/, (msg) => {
  const { id } = msg.chat;
  let message = `
  👋 <b>Вітання <i>${msg.from.first_name}</i></b>!\n
  <b><i>Холодос</i></b>  👉  це бот-додаток, що робить процес походу до магазину простіше, швидше, і найголовніше, ефективніше.\n
  🔸 <i>Завдяки боту Ви зможете швидко створювати та керувати списками покупок, робити їх доступними знайомим.</i>
  🔸 <i>Всі зміни зберігаються в чаті, і у Вас у будь-який час є до них доступ як із телефону, із додатку, так і через веб-сайт.</i>\n
  ☝️ Ви можете керувати ботом, надіславши команди зі списку /help


  Copyright © 2022 <a href="https://t.me/baklai">Baklai</a>. Created by Dmitrii Baklai.`;
  bot.sendMessage(id, message, { parse_mode: 'HTML' });
});

bot.onText(/\/statistic/, async (msg) => {
  const { id } = msg.chat;
  const stat = await Stat.statAll();
  let message = `👋 <b>Вітання <i>${msg.from.first_name}</i></b>!\n\n📊 <i>Статистика додатку:\n\n 🔹 Кількість користувачів: ${stat.users}\n 🔹 Кількість категорій товарів: ${stat.categories}\n 🔹 Кількість товарів у категоріях: ${stat.products}</i>\n\n👉 Ви можете керувати ботом, надіславши команди зі списку /help\n\nCopyright © 2022 <a href="https://t.me/baklai">Baklai</a>. Created by Dmitrii Baklai.`;
  bot.sendMessage(id, message, { parse_mode: 'HTML' });
});

bot.onText(/\/msg (.+)/, async (msg, match) => {
  const resp = match[1];
  const users = await User.findAll();
  users.forEach((user) => {
    let message = `👋 <b>Вітання <i>${user.firstName}</i></b>!\n\n<i>${resp}</i>\n\n👉 Ти можеш керувати ботом, надіславши команди зі списку /help`;
    bot.sendMessage(user.userID, message, { parse_mode: 'HTML' });
  });
});

bot.onText(/\/cancel/, (msg) => {
  api.cancelAction(msg);
});

bot.onText(/\/categories/, (msg) => {
  api.getCategory(msg);
});

bot.onText(/\/newcategory/, (msg) => {
  api.newCategory(msg);
});

bot.onText(/\/editcategory/, (msg) => {
  api.editCategory(msg);
});

bot.onText(/\/deletecategory/, (msg) => {
  api.deleteCategory(msg);
});

bot.onText(/\/products/, (msg) => {
  api.getProducts(msg);
});

bot.onText(/\/newproduct/, (msg) => {
  api.newProduct(msg);
});

bot.onText(/\/editproduct/, (msg) => {});

bot.onText(/\/deleteproduct/, (msg) => {});

bot.on('message', async (msg) => {
  const { id } = msg.chat;
  const isBot = api.isBot(msg);
  const action = api.getAction(id);
  if (action && !isBot) {
    try {
      api[action.type](msg);
    } catch (err) {
      api.delAction(id);
      bot.sendMessage(id, '💢 <b>Упс!</b> Щось пішло не так!', {
        parse_mode: 'HTML'
      });
    }
  } else if (!isBot && !msg.web_app_data) {
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
  if (action) {
    try {
      api[action.type](query);
    } catch (err) {
      api.delAction(id);
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

  // временно
  await User.createOne(msg.chat);
});

module.exports = bot;
