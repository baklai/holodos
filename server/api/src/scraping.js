const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const axios = require('axios');
const sharp = require('sharp');

const Category = require('../../services/category.service');
const Product = require('../../services/product.service');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const atb = async () => {
  const url = 'https://zakaz.atbmarket.com';
  const browser = await puppeteer.launch();
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1300, height: 10000 });
    await page.goto(url, {
      waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2']
    });
    const html = await page.evaluate(() => {
      return document.documentElement.innerHTML;
    });
    const $ = cheerio.load(html);
    const menu = [];
    $('ul.category-menu > li.category-menu__item', html).each(function () {
      const icon =
        url +
        $(this)
          .find('span')
          .attr('style')
          .replace(/.*\s?url\([\'\"]?/, '')
          .replace(/[\'\"]?\).*/, '');
      const href = url + $(this).find('a').attr('href').trim();
      menu.push({ icon, href });
    });
    const result = [];
    for (const el of menu) {
      await page.goto(el.href, {
        waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2']
      });
      const html = await page.evaluate(() => {
        return document.documentElement.innerHTML;
      });
      const $ = cheerio.load(html);
      const products = [];
      const category = {
        icon: el.icon,
        title: $('h1.page-title').text().trim()
      };
      $('div.catalog-list > article.catalog-item', html).each(function () {
        const img = $(this)
          .find('div.catalog-item__photo > a > picture > img')
          .attr('src');
        const title = $(this)
          .find('div.catalog-item__info > div.catalog-item__title > a')
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
        if (img && title && pricePer && priceTitle) {
          products.push({
            img,
            title,
            pricePer,
            priceTitle
          });
        }
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
  const browser = await puppeteer.launch();
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1300, height: 10000 });
    await page.goto(url, {
      waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2']
    });
    await page.click('div.all-product_btn');
    const html = await page.evaluate(() => {
      return document.documentElement.innerHTML;
    });
    const $ = cheerio.load(html);
    const menu = [];
    $('ul.main-menu-levels > li', html).each(function () {
      const href = url + $(this).find('a').attr('href').trim();
      const arr = href.split('-');
      const icon = `https://content.silpo.ua/ecom/categoryclassifier/iconsforsite/${
        arr[arr.length - 1]
      }.svg`;
      menu.push({ icon, href });
    });
    const result = [];
    for (const el of menu) {
      await page.goto(el.href, {
        waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2']
      });
      const html = await page.evaluate(() => {
        return document.documentElement.innerHTML;
      });
      const $ = cheerio.load(html);
      const products = [];
      const category = {
        icon: el.icon,
        title: $('div.category-page-heading').text().trim()
      };
      $('ul.product-list > div.lazyload-wrapper > li', html).each(function () {
        const img = $(this)
          .find('li.product-list-item-wrapper > img')
          .attr('src');
        const title = $(this)
          .find('li.product-list-item-wrapper > img')
          .attr('alt');
        const pricePer = $(this).find('div.current-integer').text().trim();
        const priceTitle =
          $(this).find('span.price-currency').text().trim() +
          '/' +
          $(this).find('div.product-weight').text().trim();
        if (img && title && pricePer && priceTitle) {
          products.push({
            img,
            title,
            pricePer,
            priceTitle
          });
        }
      });
      if (
        category.icon.length > 0 &&
        category.title.length > 0 &&
        products.length > 0
      ) {
        result.push({ category, products });
      }
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
