import * as puppeteer from 'puppeteer';
import sleep from '../../common/util/sleep';
import config from './puppeteer.config';

const url = 'https://movie.douban.com/tag/#/?sort=S&range=6,10';

async function main() {
  const browser = await puppeteer.launch(config);
  const page = await browser.newPage();

  page.setDefaultNavigationTimeout(50 * 1000);

  await page.goto(url);

  await page.waitForSelector('.more');

  for (let i = 0; i < 3; i++) {
    await page.click('.more');
    await sleep(3000);
  }

  const result = await page.evaluate(() => {
    const $: any = (window as any).$;
    const items = [].slice.call($('.list-wp a'));
    const links = [];

    for (const item of items) {
      const $item = $(item);
      const id = $item.find('div').data('id');
      const title = $item.find('.title').text();
      const rate = Number($item.find('.rate').text());
      const poster = $item
        .find('img')
        .attr('src')
        .replace('s_ratio', 'l_ratio');

      links.push({
        id,
        title,
        rate,
        poster,
      });
    }

    return links;
  });

  browser.close();

  if (process && process.send && process.exit) {
    process.send({ result });
    process.exit(0);
  }

  return result;
}

main();
