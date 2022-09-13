commands = {
  main: {
    description: 'Основні команди',
    commands: [
      { command: 'help', description: 'довідка по роботі з ботом' },
      { command: 'about', description: 'про бот і його можливості' },
      { command: 'donate', description: 'допомога на розвиток бота' }
    ]
  },
  category: {
    description: 'Категорії товарів',
    commands: [
      { command: 'categories', description: 'показати категорії товарів' },
      { command: 'newcategory', description: 'додати категорію товарів' },
      { command: 'editcategory', description: 'змінити категорію товарів' },
      { command: 'deletecategory', description: 'видалити категорію товарів' }
    ]
  },
  product: {
    description: 'Товари у категоріях',
    commands: [
      { command: 'products', description: 'показати категорії товарів' },
      { command: 'newproduct', description: 'додати товар до категорії' },
      // { command: 'editproduct', description: 'змінити товар у категорії' },
      { command: 'deleteproduct', description: 'видалити товар із категорії' }
    ]
  },
  operation: {
    description: 'Операційні команди',
    commands: [
      { command: 'statistic', description: 'статистика бота' },
      { command: 'cancel', description: 'скасувати операцію' },
      { command: 'quit', description: 'відписатися від бота' }
    ]
  },
  administration: {
    description: 'Системні команди',
    commands: [
      { command: 'admin', description: 'права адміністратора' },
      { command: 'update', description: 'оновити список товарів' },
      { command: 'notification', description: 'відправити повідомлення' }
    ]
  }
};

module.exports = {
  commands: [...commands.main.commands, ...commands.operation.commands],
  helper: { ...commands }
};
