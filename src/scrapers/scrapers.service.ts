import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { Model } from 'mongoose';
import puppeteer from 'puppeteer';

import { Product } from 'src/schemas/product.schema';

@Injectable()
export class ScrapersService {
  constructor(
    @Inject('BROWSER_OPTIONS') private readonly browserOptions: Record<string, any>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>
  ) {}

  @Cron('0 0 * * *', { name: 'scrape-products', timeZone: 'UTC' })
  async handleTaskScrape() {
    await this.atbMarket(this.browserOptions, 'atb');
    await this.silpoMarket(this.browserOptions, 'silpo');
    await this.novusMarket(this.browserOptions, 'novus');
  }

  async handleAtbMarketScrape() {
    await this.atbMarket(this.browserOptions, 'atb');
  }

  async handleSilpoMarketScrape() {
    await this.silpoMarket(this.browserOptions, 'silpo');
  }

  async handleNovusMarketScrape() {
    await this.novusMarket(this.browserOptions, 'novus');
  }

  private sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async atbMarket(browserOptions: Record<string, any>, market: string) {
    const url = 'https://www.atbmarket.com';
    const browser = await puppeteer.launch(browserOptions);

    await this.productModel.deleteMany({ market: market });

    try {
      const page = await browser.newPage();

      await page.setViewport({ width: 1300, height: 900 });

      const cookies = [
        { name: 'birthday', value: 'true', domain: '.www.atbmarket.com', path: '/' },
        { name: 'lang', value: 'uk', domain: '.www.atbmarket.com', path: '/' }
      ];

      await page.setCookie(...cookies);

      await page.goto(url, { waitUntil: ['load', 'domcontentloaded'] });

      const categories = await page.evaluate(url => {
        const links = document.querySelectorAll('ul.category-menu > li > a');

        return Array.from(links)
          .slice(1)
          .map((element: any) => {
            const page = element.href;

            const icon =
              url +
              element
                .querySelector('.category-menu__icon')
                .dataset.style.replace(/background-image: url\((.*?)\)/, '$1');
            const name = element.querySelector('span.category-menu__link').textContent.trim();
            return { page, icon, name };
          });
      }, url);

      for (const category of categories) {
        await this.sleep(5000);

        await page.goto(category.page, {
          waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2']
        });

        // let paginationMore = false;
        // do {
        //   try {
        //     await page.waitForSelector('button.product-pagination__more', { timeout: 10000 });
        //     await page.click('button.product-pagination__more');
        //     paginationMore = true;
        //   } catch (err) {
        //     paginationMore = false;
        //   } finally {
        //     await this.sleep(30000);
        //   }
        // } while (paginationMore);

        const data = await page.evaluate(
          ({ market, category }) => {
            const items = document.querySelectorAll('div.catalog-list > article.catalog-item');

            const data = [];

            for (const item of items) {
              const img =
                item
                  .querySelector('div.catalog-item__photo > a > picture > img')
                  ?.getAttribute('src') || null;

              const title =
                item.querySelector('div.catalog-item__info > div.catalog-item__title > a')
                  ?.textContent || null;

              const pricePer =
                item
                  .querySelector(
                    'div.catalog-item__bottom > div.catalog-item__product-price > data'
                  )
                  ?.getAttribute('value') || null;

              const priceTitle =
                item
                  .querySelector(
                    'div.catalog-item__bottom > div.catalog-item__product-price > data > abbr'
                  )
                  ?.textContent?.replaceAll(' ', '')
                  ?.trim() || null;

              if (img && title && pricePer && priceTitle) {
                data.push({
                  img,
                  title,
                  pricePer,
                  priceTitle,
                  market: market,
                  categoryIcon: category.icon,
                  categoryName: category.name
                });
              }
            }

            return data;
          },
          { market, category }
        );

        await this.productModel.insertMany([...data]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      await browser.close();
    }
  }

  private async silpoMarket(browserOptions: Record<string, any>, market: string) {
    const url = 'https://shop.silpo.ua';
    const browser = await puppeteer.launch(browserOptions);

    await this.productModel.deleteMany({ market: market });

    const category = {
      icon: null,
      name: null
    };

    const updateProducts = async (items: any) => {
      const data = [];

      for (const item of items) {
        const img = `https://images.silpo.ua/products/300x300/webp/${item?.icon}`;
        const title = item?.title || null;
        const pricePer = item?.price || null;
        const priceTitle = `грн/${item?.displayRatio}`;

        if (img && title && pricePer && priceTitle && category.icon && category.name) {
          data.push({
            img,
            title,
            pricePer,
            priceTitle,
            market: market,
            categoryIcon: category.icon,
            categoryName: category.name
          });
        }
      }

      await this.productModel.insertMany([...data]);
    };

    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1300, height: 900 });

      page.on('response', async response => {
        const url = response.url();
        if (url.includes('sf-ecom-api.silpo.ua/v1') && url.includes('/products')) {
          const data = await response.json();

          await updateProducts(data.items);
        }
      });

      await page.goto(url, {
        waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2']
      });

      await page.click('button.category-menu-button');

      await this.sleep(60000);

      const categories = await page.evaluate(url => {
        const links = document.querySelectorAll('ul.menu-categories > li');

        return Array.from(links)
          .slice(1)
          .map((element: any) => {
            const name = element.querySelector('img').getAttribute('title')?.trim();
            const icon = element.querySelector('img').getAttribute('src');
            const page = element.querySelector('a').href;
            return { page, icon, name };
          });
      }, url);

      for (const item of categories) {
        category.icon = item.icon;
        category.name = item.name;

        await page.goto(item.page, {
          waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2']
        });

        await this.sleep(60000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      await browser.close();
    }
  }

  private async novusMarket(browserOptions: Record<string, any>, market: string) {
    // url: 'https://novus.ua/';

    return null;
  }
}
