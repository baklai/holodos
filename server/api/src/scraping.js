const puppeteer = require('puppeteer');
const axios = require('axios');
const sharp = require('sharp');

const Category = require('../../services/category.service');
const Product = require('../../services/product.service');

const browserOptions = {
  headless: true,
  args: ['--no-sandbox']
};

const atb = async () => {
  const url = 'https://zakaz.atbmarket.com';
  const browser = await puppeteer.launch(browserOptions);
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1300, height: 10000 });
    await page.goto(url, {
      waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2']
    });

    const { menu } = await page.evaluate((url) => {
      const menu = [];
      const items = document.querySelectorAll(
        'ul.category-menu > li.category-menu__item'
      );
      for (const item of items) {
        const icon =
          item.querySelector('span.category-menu__icon') !== null
            ? url +
              item
                .querySelector('span.category-menu__icon')
                .getAttribute('style')
                .replace(/.*\s?url\([\'\"]?/, '')
                .replace(/[\'\"]?\).*/, '')
            : null;

        const href =
          item.querySelector('a.category-menu__link') !== null
            ? url +
              item
                .querySelector('a.category-menu__link')
                .getAttribute('href')
                .trim()
            : null;

        if (icon && href) {
          menu.push({ icon, href });
        }
      }
      return { menu };
    }, url);

    const result = [];

    for (const el of menu) {
      await page.goto(el.href, {
        waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2']
      });

      try {
        await page.waitForSelector('div.catalog-list');
      } catch (err) {
        continue;
      }

      await page.waitForTimeout(3000);

      const category = {
        icon: el.icon,
        title: await page.$eval('h1.page-title', (e) => e.innerText)
      };

      const { products } = await page.evaluate(() => {
        const products = [];
        const items = document.querySelectorAll(
          'div.catalog-list > article.catalog-item'
        );
        for (const item of items) {
          const img =
            item.querySelector(
              'div.catalog-item__photo > a > picture > img'
            ) !== null
              ? item
                  .querySelector('div.catalog-item__photo > a > picture > img')
                  .getAttribute('src')
              : null;
          const title =
            item.querySelector(
              'div.catalog-item__info > div.catalog-item__title > a'
            ) !== null
              ? item
                  .querySelector(
                    'div.catalog-item__info > div.catalog-item__title > a'
                  )
                  .innerText.trim()
              : null;
          const pricePer =
            item.querySelector(
              'div.catalog-item__bottom > div.catalog-item__product-price > data'
            ) !== null
              ? item
                  .querySelector(
                    'div.catalog-item__bottom > div.catalog-item__product-price > data'
                  )
                  .getAttribute('value')
              : null;
          const priceTitle =
            item.querySelector(
              'div.catalog-item__bottom > div.catalog-item__product-price > data > abbr'
            ) !== null
              ? item
                  .querySelector(
                    'div.catalog-item__bottom > div.catalog-item__product-price > data > abbr'
                  )
                  .innerText.replace(' ', '')
                  .trim()
              : null;

          if (img && title && pricePer && priceTitle) {
            products.push({
              img,
              title,
              pricePer,
              priceTitle
            });
          }
        }
        return { products };
      });

      result.push({ category, products });
    }

    return result;
  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
};

const silpo = async () => {
  const url = 'https://shop.silpo.ua';
  const browser = await puppeteer.launch(browserOptions);
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1300, height: 10000 });
    await page.goto(url, {
      waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2']
    });
    await page.click('div.all-product_btn');

    const { menu } = await page.evaluate((url) => {
      const menu = [];
      const items = document.querySelectorAll('ul.main-menu-levels > li');
      for (const item of items) {
        const href = url + item.querySelector('a').getAttribute('href').trim();
        const arr = href.split('-');
        const icon = `https://content.silpo.ua/ecom/categoryclassifier/iconsforsite/${
          arr[arr.length - 1]
        }.svg`;

        if (icon && href) {
          menu.push({ icon, href });
        }
      }
      return { menu };
    }, url);

    const result = [];

    for (const el of menu) {
      await page.goto(el.href, {
        waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2']
      });

      try {
        await page.waitForSelector('div.category-page-heading');
      } catch (err) {
        continue;
      }

      await page.waitForTimeout(3000);

      const category = {
        icon: el.icon,
        title: await page.$eval('div.category-page-heading', (e) => e.innerText)
      };

      const { products } = await page.evaluate(() => {
        const products = [];
        const items = document.querySelectorAll(
          'ul.product-list > div.lazyload-wrapper > li'
        );
        for (const item of items) {
          const img =
            item.querySelector('li.product-list-item-wrapper img') !== null
              ? item
                  .querySelector('li.product-list-item-wrapper img')
                  .getAttribute('src')
              : null;
          const title =
            item.querySelector('li.product-list-item-wrapper img') !== null
              ? item
                  .querySelector('li.product-list-item-wrapper img')
                  .getAttribute('alt')
              : null;
          const pricePer =
            item.querySelector('div.current-integer') !== null
              ? item.querySelector('div.current-integer').innerText.trim()
              : null;
          const priceTitle =
            item.querySelector('span.price-currency') !== null &&
            item.querySelector('div.product-weight') !== null
              ? item.querySelector('span.price-currency').innerText.trim() +
                '/' +
                item.querySelector('div.product-weight').innerText.trim()
              : null;

          if (img && title && pricePer && priceTitle) {
            products.push({
              img,
              title,
              pricePer,
              priceTitle
            });
          }
        }
        return { products };
      });

      result.push({ category, products });
    }
    return result;
  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
};

const toDatabase = async (items, catalog) => {
  const categories = await Category.findAll(catalog);
  for (const item of categories) {
    await Category.removeOne(item.id);
  }

  for (const item of items) {
    const { data: svg } = await axios.get(item.category.icon, {
      responseType: 'arraybuffer'
    });
    const category = await Category.createOne({
      icon: Buffer.from(svg).toString('base64'),
      title: item.category.title,
      catalog: catalog
    });
    item.products.forEach(async (item) => {
      const { data: img } = await axios.get(item.img, {
        responseType: 'arraybuffer'
      });
      const product = {
        img: await sharp(img).resize(256).webp().toBuffer(),
        title: item.title,
        pricePer: parseFloat(item.pricePer),
        priceTitle: item.priceTitle,
        category: category.id
      };
      await Product.createOne({ ...product });
    });
  }
};

module.exports = async () => {
  await toDatabase(await atb(), 'atb-market');
  await toDatabase(await silpo(), 'silpo-market');
};
