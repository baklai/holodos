export const MAIN_COMMANDS = {
  description: 'Основні команди',
  commands: [
    { command: 'help', description: 'довідка по роботі з ботом' },
    { command: 'about', description: 'про бот і його можливості' }
  ]
};

export const OPERATION_COMMANDS = {
  description: 'Операційні команди',
  commands: [
    { command: 'statistic', description: 'статистика бота' },
    { command: 'donate', description: 'донат на розвиток бота' },
    { command: 'quit', description: 'відписатися від бота' }
  ]
};

export const SYSTEM_COMMANDS = {
  description: 'Системні команди',
  commands: [
    { command: 'admin', description: 'права адміністратора' },
    { command: 'notice', description: 'відправити повідомлення' },
    { command: 'update', description: 'оновити список товарів' }
  ]
};
