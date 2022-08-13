const axios = require('axios');
// const sharp = require('sharp');

const User = require('../services/user.service');
const Category = require('../services/category.service');
const Product = require('../services/product.service');

const { TOKEN } = process.env;

class Action {
  constructor(bot) {
    this.bot = bot;
    this.actions = [];
  }
  getAction(id) {
    return this.actions.find((item) => item.id === id);
  }
  setAction(id, type) {
    if (this.getAction(id)) this.delAction(id);
    this.actions.push({ id, type, obj: {} });
  }
  setActionType(id, type) {
    const action = this.getAction(id);
    if (action) {
      action.type = type;
    }
  }
  delAction(id) {
    const index = this.actions.findIndex((item) => {
      return item.id === id;
    });
    if (index >= 0) this.actions.splice(index, 1);
    return true;
  }
}

class API extends Action {
  constructor(bot) {
    super(bot);
  }

  isBot(msg) {
    return msg.entities
      ? msg.entities.find((item) => item.type === 'bot_command')
      : undefined;
  }

  cancelAction(msg) {
    const { id } = msg.chat;
    const action = this.getAction(id);
    let message = '💢 <b>Упс!</b> Щось пішло не так!';
    if (action) {
      this.delAction(id);
      message = `👌 Добре, команда була скасована.\n\n⁉️ <i>Що я ще можу зробити для вас?</i>\n\nНадішліть /help для отримання списку команд.`;
    } else {
      message =
        '🤔 🥱 Немає активної команди для скасування. Я все одно нічого не робив...';
    }
    this.bot.sendMessage(id, message, { parse_mode: 'HTML' });
  }

  async getCategory(msg) {
    const { id } = msg.chat;
    let message = `💢 <b>Упс!</b> Список категорій товарів порожній!`;
    try {
      const category = await Category.findAll();
      if (category.length) {
        message = `👌 Добре, давайте подивимося список категорій товарів:\n\n`;
        category.forEach((item, index) => {
          message += `<b>${index + 1}.</b> <i>${item.title}</i>\n`;
        });
        message += `\n<i>Ви можете керувати ботом, відправивши команди зі списку /help</i>`;
      }
    } catch (err) {
      message = `💢 <b>Упс!</b> Щось пішло не так!. Виникла помилка: <i>${err.message}</i>`;
    } finally {
      this.delAction(id);
      this.bot.sendMessage(id, message, { parse_mode: 'HTML' });
    }
  }

  newCategory(msg) {
    const { id } = msg.chat;
    let message = `👌 Добре, давайте додамо <b><i>нову категорію товарів</i></b>.\n\n<i>⁉️Як ми збираємось назвати її?</i>\n\n👉 Будь ласка, введіть назву <b><i>нової категорії товарів</i></b> або натисніть /cancel, щоб скасувати поточну операцію:`;
    this.setAction(id, 'input-category-title');
    const action = this.getAction(id);
    action.obj.title = msg.text;
    this.bot.sendMessage(id, message, { parse_mode: 'HTML' });
  }

  async ['input-category-title'](msg) {
    const { id } = msg.chat;
    let message = '💢 <b>Упс!</b> Щось пішло не так!';
    try {
      const action = this.getAction(id);
      action.obj.title = msg.text;
      message = `👌 Нова категорія товарів "<b>${msg.text}</b>" успішно додана.`;
      await Category.createOne({ ...action.obj });
    } catch (err) {
      message = `💢 <b>Упс!</b> Щось пішло не так!. Виникла помилка: <i>${err.message}</i>`;
    } finally {
      this.delAction(id);
      this.bot.sendMessage(id, message, { parse_mode: 'HTML' });
    }
  }

  async editCategory(msg) {
    const { id } = msg.chat;
    let message = '💢 <b>Упс!</b> Щось пішло не так!';
    let reply_markup = null;
    try {
      const category = await Category.findAll();
      if (category.length) {
        this.setAction(id, 'select-edit-category');
        message = `👌 Добре, давайте змінимо <b><i>категорію товарів</i></b>.\n\n<i>⁉️ Яку категорію товарів хочемо змінити?</i>\n\n👉 Будь ласка, виберіть зі списку <b><i>категорію товарів</i></b> або натисніть /cancel, щоб скасувати поточну операцію:`;
        reply_markup = {
          inline_keyboard: category.map((item) => [
            { text: item.title, callback_data: item.id }
          ])
        };
      } else {
        message = `💢 <b>Упс!</b> Список категорій товарів порожній!`;
      }
    } catch (err) {
      this.delAction(id);
      message = `💢 <b>Упс!</b> Щось пішло не так!. Виникла помилка: <i>${err.message}</i>`;
    } finally {
      this.bot.sendMessage(id, message, { parse_mode: 'HTML', reply_markup });
    }
  }

  async ['select-edit-category'](query) {
    const { message_id } = query.message || {};
    const { id } = query.message?.chat || {};
    const action = this.getAction(id);
    let message = '💢 <b>Упс!</b> Щось пішло не так!';
    try {
      const category = await Category.findOne(query.data);
      action.obj.id = category.id;
      action.obj.title = category.title;
      message = `👌 Добре, вибрано категорію товарів "<b><i>${category.title}</i></b>".\n\n⁉️ Яку нову назву для категорії товарів ми хочемо поставити?\n\nВведіть нову назву для категорії товарів "<b><i>${category.title}</i></b>" або натисніть /cancel, щоб скасувати поточну операцію:`;
      this.setActionType(id, 'input-edit-category-title');
    } catch (err) {
      this.delAction(id);
      message = `💢 <b>Упс!</b> Щось пішло не так!. Виникла помилка: <i>${err.message}</i>`;
    } finally {
      this.bot.editMessageText(message, {
        chat_id: id,
        message_id: message_id,
        parse_mode: 'HTML'
      });
    }
  }

  async ['input-edit-category-title'](msg) {
    const { id } = msg.chat;
    let message = '💢 <b>Упс!</b> Щось пішло не так!';
    try {
      const action = this.getAction(id);
      message = `👌 Добре, категорія товарів "<i>${action.obj.title}</i>" успішно оновлена на "<b>${msg.text}</b>".`;
      action.obj.title = msg.text;
      await Category.updateOne(action.obj.id, {
        ...action.obj
      });
    } catch (err) {
      message = `💢 <b>Упс!</b> Щось пішло не так!. Виникла помилка: <i>${err.message}</i>`;
    } finally {
      this.delAction(id);
      this.bot.sendMessage(id, message, { parse_mode: 'HTML' });
    }
  }

  async deleteCategory(msg) {
    const { id } = msg.chat;
    let message = '💢 <b>Упс!</b> Щось пішло не так!';
    let reply_markup = null;
    try {
      const category = await Category.findAll();
      if (category.length) {
        this.setAction(id, 'select-delete-category');
        message = `👌 Добре, давайте видалимо <b><i>категорію товарів</i></b>.\n\n<i>⁉️ Яку категорію товарів хочемо видалити?</i>\n\n👉 Будь ласка, виберіть зі списку <b><i>категорію товарів</i></b> або натисніть /cancel, щоб скасувати поточну операцію:`;
        reply_markup = {
          inline_keyboard: category.map((item) => [
            { text: item.title, callback_data: item.id }
          ])
        };
      } else {
        message = `💢 <b>Упс!</b> Список категорій товарів порожній!`;
      }
    } catch (err) {
      message = `💢 <b>Упс!</b> Щось пішло не так!. Виникла помилка: <i>${err.message}</i>`;
    } finally {
      this.bot.sendMessage(id, message, { parse_mode: 'HTML', reply_markup });
    }
  }

  async ['select-delete-category'](query) {
    const { message_id } = query.message || {};
    const { id } = query.message?.chat || {};
    const action = this.getAction(id);
    let message = '💢 <b>Упс!</b> Щось пішло не так!';
    let reply_markup = null;
    try {
      const category = await Category.findOne(query.data);
      message = `👌 Добре, вибрано категорію товарів "<b><i>${category.title}</i></b>".\n\n<i>Ви дійсно хочете видалити її?</i>\n\n‼️ Зверніть увагу, що при видаленні категорії товарів будуть видалені всі товари цієї категорії!`;
      action.obj.id = category.id;
      action.obj.title = category.title;
      this.setActionType(id, 'query-delete-category');
      reply_markup = {
        inline_keyboard: [
          [
            { text: 'Так 💯 видалити!', callback_data: 'delete' },
            { text: 'Ні, не видаляти!', callback_data: 'cancel' }
          ]
        ]
      };
    } catch (err) {
      this.delAction(id);
      message = `💢 <b>Упс!</b> Щось пішло не так!. Виникла помилка: <i>${err.message}</i>`;
    } finally {
      this.bot.editMessageText(message, {
        chat_id: id,
        message_id: message_id,
        parse_mode: 'HTML',
        reply_markup
      });
    }
  }

  async ['query-delete-category'](query) {
    const { message_id } = query.message || {};
    const { id } = query.message?.chat || {};
    const action = this.getAction(id);
    let message = '💢 <b>Упс!</b> Щось пішло не так!';
    try {
      if (query.data === 'delete') {
        await Category.removeOne(action.obj.id);
        message = `👌 Добре, категорія товарів "<i>${action.obj.title}</i>" була успішно <b>видалена</b>.`;
      } else if (query.data === 'cancel') {
        message = `👌 Добре, команда була скасована.\n\n<i>Що я ще можу зробити для вас? Надішліть /help для отримання списку команд.</i>`;
      }
    } catch (err) {
      message = `💢 <b>Упс!</b> Щось пішло не так!. Виникла помилка: <i>${err.message}</i>`;
    } finally {
      this.delAction(id);
      this.bot.editMessageText(message, {
        chat_id: id,
        message_id: message_id,
        parse_mode: 'HTML'
      });
    }
  }

  // ОСТАНОВИЛСЯ ТУТ

  async getProducts(msg) {
    const { id } = msg.chat;
    let message = '💢 <b>Упс!</b> Щось пішло не так!';
    let reply_markup = null;
    try {
      const category = await Category.findAll();
      if (category.length) {
        this.setAction(id, 'products-in-category');
        message = `👌 Добре, давайте подивимося <b><i>список товарів</i></b>.\n\n<i>⁉️ З якої категорії товарів ми хочемо переглянути список товарів?</i>\n\n👉 Будь ласка, виберіть зі списку <b><i>категорію товарів</i></b> або натисніть /cancel, щоб скасувати поточну операцію:`;
        reply_markup = {
          inline_keyboard: category.map((item) => [
            { text: item.title, callback_data: item.id }
          ])
        };
      } else {
        message = `💢 <b>Упс!</b> Список категорій товарів порожній!`;
      }
    } catch (err) {
      message = `💢 <b>Упс!</b> Щось пішло не так!. Виникла помилка: <i>${err.message}</i>`;
    } finally {
      this.bot.sendMessage(id, message, { parse_mode: 'HTML', reply_markup });
    }
  }

  // вернуться как появятся товары
  async ['products-in-category'](query) {
    const { message_id } = query.message || {};
    const { id } = query.message?.chat || {};
    let message = `💢 <b>Упс!</b> Список категорій товарів порожній!`;
    try {
      const category = await Category.findOne(query.data);
      const products = await Product.findAll(query.data);
      if (products.length) {
        message = `👌 Добре, вибрано категорію товарів "<b><i>${category.title}</i></b>". Давайте подивимося список товарів у категорії "<b><i>${category.title}</i></b>":\n\n`;
        products.forEach((item, index) => {
          message += `<b>${index + 1}.</b> <i>${item.title}</i>\n`;
        });
        message += `\n<i>Ви можете керувати ботом, відправивши команди зі списку /help</i>`;
      } else {
        message = `💢 <b>Упс!</b> Список товарів порожній!`;
      }
    } catch (err) {
      message = `💢 <b>Упс!</b> Щось пішло не так!. Виникла помилка: <i>${err.message}</i>`;
    } finally {
      this.delAction(id);
      this.bot.editMessageText(message, {
        chat_id: id,
        message_id: message_id,
        parse_mode: 'HTML'
      });
    }
  }

  async newProduct(msg) {
    const { id } = msg.chat;
    // let message = '💢 <b>Упс!</b> Щось пішло не так!';
    // let reply_markup = null;
    // try {
    //   const category = await Category.findAll();
    //   if (category.length) {
    //     this.setAction(id, 'select-category-new-product');
    //     message = `👌 Добре, давайте додамо <b><i>новий товар</i></b>.\n\n⁉️ <i>До якої категорії товарів ми хочемо додати новий товар?</i>\n\n👉 Будь ласка, виберіть зі списку <b>категорію товарів</b> або натисніть /cancel, щоб скасувати поточну операцію:`;
    //     reply_markup = {
    //       inline_keyboard: category.map((item) => [
    //         { text: item.title, callback_data: item.id }
    //       ])
    //     };
    //   } else {
    //     message = `💢 <b>Упс!</b> Список категорій товарів порожній!`;
    //   }
    // } catch (err) {
    //   message = `💢 <b>Упс!</b> Щось пішло не так!. Виникла помилка: <i>${err.message}</i>`;
    // } finally {
    //   this.bot.sendMessage(id, message, { parse_mode: 'HTML', reply_markup });
    // }
  }

  // async ['select-category-new-product'](query) {
  //   const { message_id } = query.message || {};
  //   const { id } = query.message?.chat || {};
  //   const action = this.getAction(id);
  //   let message = '💢 <b>Упс!</b> Щось пішло не так!';
  //   try {
  //     const category = await Category.findOne(query.data);
  //     action.obj.category = category.id;
  //     this.setActionType(id, 'input-new-product-title');
  //     message = `👌 Добре, вибрано категорію товарів "<b><i>${category.title}</i></b>".\n\n⁉️ Який новий товар хочемо додати?\n\nВведіть назву товару для категорії товарів "<b><i>${category.title}</i></b>" або натисніть /cancel, щоб скасувати поточну операцію:`;
  //   } catch (err) {
  //     this.delAction(id);
  //     message = `💢 <b>Упс!</b> Щось пішло не так!. Виникла помилка: <i>${err.message}</i>`;
  //   } finally {
  //     this.bot.editMessageText(message, {
  //       chat_id: id,
  //       message_id: message_id,
  //       parse_mode: 'HTML'
  //     });
  //   }
  // }

  // async ['input-new-product-title'](msg) {
  //   const { id } = msg.chat;
  //   let message = '💢 <b>Упс!</b> Щось пішло не так!';
  //   let reply_markup = null;
  //   const action = this.getAction(id);
  //   try {
  //     action.obj.title = msg.text;
  //     message = `👌 Добре, назва нового товару "<b>${msg.text}</b>" успішно прийнята.\n\nВиберіть розмірність нового товару або натисніть /cancel, щоб скасувати поточну операцію:`;
  //     reply_markup = {
  //       inline_keyboard: [
  //         [
  //           { text: 'грн/шт', callback_data: 'грн/шт' },
  //           { text: 'грн/кг', callback_data: 'грн/кг' },
  //           { text: 'грн/літр', callback_data: 'грн/літр' }
  //         ]
  //       ]
  //     };
  //     this.setActionType(id, 'input-new-product-price-title');
  //   } catch (err) {
  //     this.delAction(id);
  //     message = `💢 <b>Упс!</b> Щось пішло не так!. Виникла помилка: <i>${err.message}</i>`;
  //   } finally {
  //     this.bot.sendMessage(id, message, { parse_mode: 'HTML', reply_markup });
  //   }
  // }

  // async ['input-new-product-price-title'](query) {
  //   const { message_id } = query.message || {};
  //   const { id } = query.message?.chat || {};
  //   const action = this.getAction(id);
  //   let message = '💢 <b>Упс!</b> Щось пішло не так!';
  //   try {
  //     action.obj.priceTitle = query.data;
  //     message = `👌 Добре, вибрано розмірність нового товару "<b><i>${action.obj.priceTitle}</i></b>".\n\nВведіть вартість нового товару "<b><i>${action.obj.title}</i></b>" або натисніть /cancel, щоб скасувати поточну операцію:`;
  //     this.setActionType(id, 'input-new-product-price');
  //   } catch (err) {
  //     this.delAction(id);
  //     message = `💢 <b>Упс!</b> Щось пішло не так!. Виникла помилка: <i>${err.message}</i>`;
  //   } finally {
  //     this.bot.editMessageText(message, {
  //       chat_id: id,
  //       message_id: message_id,
  //       parse_mode: 'HTML'
  //     });
  //   }
  // }

  // async ['input-new-product-price'](msg) {
  //   const { id } = msg.chat;
  //   let message = '💢 <b>Упс!</b> Щось пішло не так!';
  //   let reply_markup = null;
  //   const action = this.getAction(id);
  //   try {
  //     action.obj.pricePer = msg.text;
  //     message = `👌 Добре, вартість нового товару "<b>${msg.text}</b>" успішно прийнято.\n\n<i>Надішліть фото нового товару або натисніть /cancel, щоб скасувати поточну операцію:</i>`;
  //     this.setActionType(id, 'input-new-product-img');
  //   } catch (err) {
  //     this.delAction(id);
  //     message = `💢 <b>Упс!</b> Щось пішло не так!. Виникла помилка: <i>${err.message}</i>`;
  //   } finally {
  //     this.bot.sendMessage(id, message, { parse_mode: 'HTML', reply_markup });
  //   }
  // }

  // async ['input-new-product-img'](msg) {
  //   const { id } = msg.chat;
  //   let fileID = null;
  //   if (msg.photo) {
  //     fileID = msg.photo[msg.photo.length - 1].file_id;
  //   } else if (msg.document) {
  //     fileID = msg.document.file_id;
  //   }
  //   let message = '💢 <b>Упс!</b> Щось пішло не так!';
  //   const action = this.getAction(id);
  //   try {
  //     let url = `https://api.telegram.org/bot${TOKEN}/getFile?file_id=${fileID}`;
  //     const { data } = await axios.get(url);
  //     url = `https://api.telegram.org/file/bot${TOKEN}/${data.result.file_path}`;
  //     message = `👌 Фото нового товару успішно прийнято.`;
  //     const img = await axios.get(url, {
  //       responseType: 'arraybuffer'
  //     });
  //     action.obj.img = await sharp(img.data).resize(256).webp().toBuffer();
  //     const product = await Product.createOne({ ...action.obj });
  //     const category = await Category.findOne(product.category);
  //     this.bot.sendPhoto(
  //       id,
  //       Buffer.from(product.img, 'base64'),
  //       {
  //         parse_mode: 'HTML',
  //         caption: `<b>Категорія товарів</b>: ${category.title}\n<b>Назва товару</b>: ${product.title}\n<b>Ціна товару</b>: ${product.pricePer} ${product.priceTitle}`
  //       },
  //       {
  //         filename: undefined,
  //         contentType: undefined
  //       }
  //     );
  //   } catch (err) {
  //     message = `💢 <b>Упс!</b> Щось пішло не так!. Виникла помилка: <i>${err.message}</i>`;
  //   } finally {
  //     this.delAction(id);
  //     this.bot.sendMessage(id, message, { parse_mode: 'HTML' });
  //   }
  // }
}

module.exports = API;
