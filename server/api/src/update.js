const axios = require('axios');
const sharp = require('sharp');
const cheerio = require('cheerio');

const User = require('../../services/user.service');
const Category = require('../../services/category.service');
const Product = require('../../services/product.service');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

module.exports = {
  async ['/update'](ctx) {
    let message = this.t(ctx.lang, 'bot:oops');
    try {
      const user = await User.findOne(ctx.user.userID);
      if (user?.isAdmin) {
        const url = 'https://zakaz.atbmarket.com/catalog/287-ovochi-ta-frukti';

        let title = '';
        const items = [];

        axios(url, {
          headers: {
            Accept: '*/*'
          }
        })
          .then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);

            title = $('div.catalog-page__content > h1.page-title')
              .text()
              .trim();

            $('div.catalog-list > article.catalog-item', html).each(
              function () {
                try {
                  const img = $(this)
                    .find('div.catalog-item__photo > a > picture > img')
                    .attr('src');

                  const title = $(this)
                    .find(
                      'div.catalog-item__info > div.catalog-item__title > a'
                    )
                    .text();

                  const pricePer = $(this)
                    .find(
                      'div.catalog-item__bottom > div.catalog-item__product-price > data'
                    )
                    .attr('value');

                  const priceTitle = $(this)
                    .find(
                      'div.catalog-item__bottom > div.catalog-item__product-price > data > abbr'
                    )
                    .first()
                    .text()
                    .replace(/\s+/g, '')
                    .trim();

                  items.push({ img, title, pricePer, priceTitle });
                } catch (err) {
                  console.error(`Bad item: ${index}`);
                }
              }
            );
          })
          .catch((err) => {
            console.log(err);
          });

        const category = await Category.createOne({ title: title });
        items.forEach(async (item) => {
          const { data } = await axios.get(item.img, {
            responseType: 'arraybuffer'
          });
          const img = await sharp(data).resize(256).webp().toBuffer();
          const product = {
            img: img,
            title: item.title,
            pricePer: item.pricePer,
            priceTitle: item.priceTitle,
            category: category.id
          };
          await Product.createOne({ ...product });
        });

        message =
          `${this.t(ctx.lang, 'bot:hi %s', ctx.user.firstName)}\n\n` +
          `${this.t(ctx.lang, 'update')}\n\n` +
          this.t(ctx.lang, 'bot:help');
      } else {
        message =
          `${this.t(ctx.lang, 'bot:hi %s', ctx.user.firstName)}\n\n` +
          `${this.t(ctx.lang, 'bot:notadmin')}\n\n` +
          this.t(ctx.lang, 'bot:help');
      }
    } catch (err) {
      message = this.t(ctx.lang, 'bot:error %s', err.message);
    } finally {
      this.deleteAction(ctx.chatID);
      this.bot.sendMessage(ctx.chatID, message, { parse_mode: 'HTML' });
    }
  }
};
