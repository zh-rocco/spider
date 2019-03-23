import * as puppeteer from 'puppeteer';
import launchOptions from './puppeteer.config';

/**
 * 设置 page 的默认参数
 *
 * @export
 * @param {Page} page
 */
export async function setDefaultOptions(page: puppeteer.Page): Promise<void> {
  page.setDefaultNavigationTimeout(50 * 1000);
  page.setViewport({ width: 1200, height: 600 });
}

/**
 * 爬取滚动加载的页面
 *
 * reference: https://intoli.com/blog/scrape-infinite-scroll/
 *
 * @export
 * @param {Page} page
 * @param {() => any} evaluator
 * @param {number} [scrollDelay=300]
 * @returns {any}
 */
export async function evaluateInfiniteScrollPage(
  page: puppeteer.Page,
  evaluator: puppeteer.EvaluateFn,
  options: { delay?: number; args?: any[] } = {},
): Promise<any> {
  const { delay = 300, args = [] } = options;
  try {
    const heights = [-Infinity, Infinity];
    while (heights[0] !== heights[1]) {
      global.console.log('Infinite scroll heights:', heights);
      heights.shift();
      heights.push(await page.evaluate('document.body.scrollHeight'));
      await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
      await page.waitFor(delay);
      await page.waitForFunction(`document.body.scrollHeight >= ${heights[1]}`);
    }
    global.console.log('Infinite scroll heights:', heights);
    return await page.evaluate(evaluator, ...args);
  } catch (e) {} // tslint:disable-line:no-empty
}

/**
 * 开启无图模式
 *
 * @export
 * @param {Page} page
 * @param {string[]} [suffixes=['png', 'jpg']]
 */
export async function enableNoPictureMode(
  page: puppeteer.Page,
  suffixes: string[] = ['png', 'jpg'],
): Promise<void> {
  await page.setRequestInterception(true);
  page.on('request', interceptedRequest => {
    const url = interceptedRequest.url();
    if (suffixes.some(suffix => url.endsWith(suffix))) {
      interceptedRequest.abort();
    } else {
      interceptedRequest.continue();
    }
  });
}

/**
 * 关闭无图模式
 *
 * @export
 * @param {Page} page
 */
export async function disableNoPictureMode(
  page: puppeteer.Page,
): Promise<void> {
  await page.setRequestInterception(true);
  page.on('request', interceptedRequest => {
    interceptedRequest.continue();
  });
}

export async function openPage(
  url: string,
  options: puppeteer.DirectNavigationOptions = {
    waitUntil: 'domcontentloaded',
  },
  extraOptions: { noPicture?: boolean } = {},
): Promise<[puppeteer.Page, puppeteer.Browser]> {
  const { noPicture = true } = extraOptions;
  const browser = await puppeteer.launch(launchOptions);
  const page = await browser.newPage();

  await setDefaultOptions(page);

  if (noPicture) {
    await enableNoPictureMode(page);
  }

  await page.goto(url, options);
  await page.addScriptTag({
    url: 'https://code.jquery.com/jquery-3.3.1.min.js',
  });

  return [page, browser];
}
