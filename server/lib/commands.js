/**
 * Telegram Bot
 * List of the bot's commands
 */

commands = {
  main: {
    description: 'Основні команди',
    commands: [
      { command: 'help', description: 'довідка по роботі з ботом' },
      { command: 'about', description: 'про бот і його можливості' }
    ]
  },
  catalog: {
    description: 'Категорії товарів',
    commands: [
      { command: 'categories', description: 'показати категорії товарів' },
      { command: 'newcategory', description: 'додати категорію товарів' },
      { command: 'editcategory', description: 'змінити категорію товарів' }
      // { command: 'deletecategory', description: 'видалити категорію товарів' }
    ]
  },
  product: {
    description: 'Товари у категоріях',
    commands: [
      { command: 'products', description: 'показати товари в категорії' }
      // { command: 'newproduct', description: 'додати товар до категорії' }
      // { command: 'editproduct', description: 'змінити товар у категорії' },
      // { command: 'deleteproduct', description: 'видалити товар із категорії' }
    ]
  },
  operation: {
    description: 'Операційні команди',
    commands: [
      { command: 'cancel', description: 'скасувати операцію' },
      { command: 'statistic', description: 'показати статистику' }
    ]
  }
};

module.exports = {
  commands: [
    ...commands.main.commands,
    ...commands.catalog.commands,
    ...commands.product.commands,
    ...commands.operation.commands
  ],
  helper: `
${commands.main.commands
  .map((item) => `/${item.command} - ${item.description}`)
  .join('\n')}

<b><i>${commands.catalog.description}</i></b>
${commands.catalog.commands
  .map((item) => `/${item.command} - ${item.description}`)
  .join('\n')}

<b><i>${commands.product.description}</i></b>
${commands.product.commands
  .map((item) => `/${item.command} - ${item.description}`)
  .join('\n')}

<b><i>${commands.operation.description}</i></b>
${commands.operation.commands
  .map((item) => `/${item.command} - ${item.description}`)
  .join('\n')}
    `
};
