/// <reference types="jquery" />

import { openPage } from './puppeteer.utils';

export async function aotuContentCrawler(url: string) {
  const [page, browser] = await openPage(url);

  const article = await page.evaluate(() => {
    const html = $('.post-content').html() as string;
    const $meta = $('.post-meta');

    return {
      content: html
        .replace(/\s*class="[^"]*"/g, '')
        .replace(/\s*style="[^"]*"/g, ''),
      author: $meta.find('a').text(),
      authorLink: $meta.find('a').attr('href'),
      createTime: $meta.find('span').text(),
    };
  });

  await browser.close();

  if (process && process.send && process.exit) {
    process.send({ data: article });
    process.exit(0);
  }

  global.console.log(article);

  return article;
}

// 'https://aotu.io/notes/2017/08/28/getting-started-with-threejs/'
aotuContentCrawler(
  'https://aotu.io/notes/2017/08/28/getting-started-with-threejs/',
);
