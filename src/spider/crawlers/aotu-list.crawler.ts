/// <reference types="jquery" />

import {
  openPage,
  evaluateInfiniteScrollPage,
  stopProcessIfNeededWithData,
} from './puppeteer.utils';

const url = 'https://aotu.io';

export async function aotuListCrawler() {
  const [page, browser] = await openPage(url);

  const articles = await evaluateInfiniteScrollPage(
    page,
    (baseUrl: string) => {
      function padWithHttp(
        source: string,
        str: string = baseUrl.split('//')[0] || 'https:',
      ) {
        if (/^\/\//.test(source)) {
          return str + source;
        }
        return source;
      }
      const items: HTMLElement[] = [].slice.call($('.mod-post'));
      return items.map((article: HTMLElement) => {
        const $article = $(article);
        return {
          title: $article.find('.mod-post-tit').text(),
          description: $article.find('.mod-post-desc').text(),
          cover: padWithHttp($article.find('img').attr('src')),
          link:
            baseUrl +
            $article
              .find('a')
              .eq(0)
              .attr('href'),
          platform: 'aotu',
        };
      });
    },
    { args: [url] },
  );

  await browser.close();

  return stopProcessIfNeededWithData(articles);
}
