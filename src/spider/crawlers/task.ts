import { resolve } from 'path';
import { runScriptWithChildProcess } from './puppeteer.utils';
import { Article } from 'src/article/article.entity';

export async function aotuTask(): Promise<Article[]> {
  const [err, data] = await runScriptWithChildProcess(
    resolve(__dirname, './aotu.crawler'),
  );
  global.console.log('aotu:', [err, data.length]);
  if (err) {
    return [];
  } else {
    return data;
  }
}

export async function taobaofedTask(): Promise<Article[]> {
  const [err, data] = await runScriptWithChildProcess(
    resolve(__dirname, './taobaofed.crawler'),
  );
  global.console.log('taobaofed:', [err, data.length]);
  if (err) {
    return [];
  } else {
    return data;
  }
}
