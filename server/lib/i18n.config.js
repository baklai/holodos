const { I18n } = require('i18n');
const path = require('path');

const i18n = new I18n({
  locales: ['en', 'uk', 'ru'],
  defaultLocale: 'uk',
  directory: path.join(__dirname, '..', 'locales')
});

module.exports = i18n;
