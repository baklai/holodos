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
      { command: 'products', description: 'показати товари в категорії' },
      { command: 'newproduct', description: 'додати товар до категорії' },
      { command: 'editproduct', description: 'змінити товар у категорії' },
      { command: 'deleteproduct', description: 'видалити товар із категорії' }
    ]
  },
  operation: {
    description: 'Операційні команди',
    commands: [
      { command: 'cancel', description: 'скасувати операцію' },
      { command: 'statistic', description: 'статистика бота' }
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
  // helper: (isAdmin) => {
  //   // `
  //   // ${commands.main.commands
  //   //   .map((item) => `/${item.command} - ${item.description}`)
  //   //   .join('\n')}

  //   // <b><i>${commands.category.description}</i></b>
  //   // ${commands.category.commands
  //   //   .map((item) => `/${item.command} - ${item.description}`)
  //   //   .join('\n')}

  //   // <b><i>${commands.product.description}</i></b>
  //   // ${commands.product.commands
  //   //   .map((item) => `/${item.command} - ${item.description}`)
  //   //   .join('\n')}

  //   // <b><i>${commands.operation.description}</i></b>
  //   // ${commands.operation.commands
  //   //   .map((item) => `/${item.command} - ${item.description}`)
  //   //   .join('\n')}`

  //   // `<b><i>${commands.administration.description}</i></b>
  //   // ${commands.administration.commands
  //   //   .map((item) => `/${item.command} - ${item.description}`)
  //   //   .join('\n')}
  //   //     `
  // }
};
