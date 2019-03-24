import { fork } from 'child_process';
import * as puppeteer from 'puppeteer';
import launchOptions from './puppeteer.config';

/**
 * 设置 page 的默认参数
 *
 * @export
 * @param {puppeteer.Page} page
 * @returns {Promise<void>}
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
 * @param {puppeteer.Page} page
 * @param {puppeteer.EvaluateFn} evaluator
 * @param {{ delay?: number; args?: any[] }} [options={}]
 * @returns {Promise<any>}
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
 * 爬取分页加载的页面
 *
 * @export
 * @param {puppeteer.Page} page
 * @param {puppeteer.EvaluateFn} evaluator
 * @param {{ delay?: number; args?: any[]; nextClassName?: string }} [options={}]
 * @returns {Promise<any>}
 */
export async function evaluatePaginationPage(
  page: puppeteer.Page,
  evaluator: puppeteer.EvaluateFn,
  options: { delay?: number; args?: any[]; nextClassName?: string } = {},
): Promise<any> {
  let next = true;
  const result: any[] = [];
  const { delay = 300, args = [], nextClassName } = options;

  if (!nextClassName) {
    return;
  }

  while (next) {
    global.console.log('Pagination page:', result.length + 1);
    await page.waitFor(delay);

    const $nexBtn = await page.$(nextClassName);

    try {
      result.push(await page.evaluate(evaluator, ...args));
    } catch (e) {} // tslint:disable-line:no-empty

    if ($nexBtn) {
      page.click(nextClassName);
      await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
    } else {
      next = false;
    }
  }

  return result;
}

/**
 * 开启无图模式
 *
 * @export
 * @param {puppeteer.Page} page
 * @param {string[]} [suffixes=['png', 'jpg']]
 * @returns {Promise<void>}
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
 * @param {puppeteer.Page} page
 * @returns {Promise<void>}
 */
export async function disableNoPictureMode(
  page: puppeteer.Page,
): Promise<void> {
  await page.setRequestInterception(true);
  page.on('request', interceptedRequest => {
    interceptedRequest.continue();
  });
}

/**
 * 打开一个网页
 *
 * @export
 * @param {string} url
 * @param {puppeteer.DirectNavigationOptions} [options={
 *     waitUntil: 'domcontentloaded',
 *   }]
 * @param {{ noPicture?: boolean }} [extraOptions={}]
 * @returns {Promise<[puppeteer.Page, puppeteer.Browser]>}
 */
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

/**
 * 停止 node.js 子线程
 *
 * @export
 * @param {*} [data]
 * @returns
 */
export function stopProcessIfNeededWithData(data?: any) {
  if (process && process.send) {
    process.send({ data });
  } else {
    return { data };
  }
}

/**
 * 使用子线程执行脚本
 *
 * @export
 * @param {string} script
 * @returns {Promise<any[]>}
 */
export function runScriptWithChildProcess(script: string): Promise<any[]> {
  const child = fork(script, []);

  return new Promise(resolve => {
    child.on('error', err => {
      resolve([err]);
    });

    child.on('exit', code => {
      global.console.log(`stop child_process: "${script}" with ${code}`);
    });

    child.on('message', ({ data }) => {
      resolve([null, data]);
    });
  });
}
