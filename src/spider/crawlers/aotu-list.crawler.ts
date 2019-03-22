import { openPage, evaluateInfiniteScrollPage } from './puppeteer.utils';

const url = 'https://aotu.io';

export async function aotuListCrawler() {
  const [page, browser] = await openPage(url);

  const articles = await evaluateInfiniteScrollPage(
    page,
    (baseUrl: string) => {
      function padWithHttp(source: string, str: string = 'https:') {
        if (/^\/\//.test(source)) {
          return str + source;
        }
        return source;
      }
      const $: any = (window as any).$;
      const items: HTMLElement[] = [].slice.call($('.mod-post'));
      return items.map((article: HTMLElement) => {
        const $article: JQuery = $(article);
        return {
          title: $article.find('.mod-post-tit').text(),
          description: $article.find('.mod-post-desc').text(),
          cover: padWithHttp($article.find('img').attr('src')),
          author: 'aotu',
          content: '',
          originUrl:
            baseUrl +
            $article
              .find('a')
              .eq(0)
              .attr('href'),
        };
      });
    },
    { args: [url] },
  );

  await browser.close();

  if (process && process.send && process.exit) {
    process.send({ data: articles });
    process.exit(0);
  }

  return articles;
}

// aotuListCrawler();
