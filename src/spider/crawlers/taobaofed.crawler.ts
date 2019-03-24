/// <reference types="jquery" />

import { flatten } from 'lodash';
import {
  openPage,
  evaluatePaginationPage,
  stopProcessIfNeededWithData,
} from './puppeteer.utils';

const url = 'http://taobaofed.org';

async function crawler() {
  const [page, browser] = await openPage(url);

  const articles = await evaluatePaginationPage(
    page,
    (baseUrl: string) => {
      const coverUrlRegex = /^url\("(.*)"\)$/;
      const items: HTMLElement[] = [].slice.call($('.article-summary-inner'));
      return items.map((article: HTMLElement) => {
        const $article = $(article);
        return {
          title: $article
            .find('.title')
            .text()
            .trim(),
          description: $article
            .find('.article-excerpt')
            .text()
            .trim(),
          cover: $article
            .find('.thumbnail-image')
            .css('background-image')
            .match(coverUrlRegex)[1],
          link: baseUrl + $article.find('.thumbnail').attr('href'),
          platform: 'taobaofed',
        };
      });
    },
    { args: [url], nextClassName: '.extend.next' },
  );

  await browser.close();

  return stopProcessIfNeededWithData(flatten(articles));
}

crawler();
