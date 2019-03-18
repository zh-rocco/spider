import { Injectable, NestMiddleware } from '@nestjs/common';

const sleep = time => new Promise(resolve => setTimeout(() => resolve(), time));

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  async use(req: any, res: any, next: () => void) {
    await sleep(1000);
    console.log('Logger: Request...', req.path);
    next();
  }
}

export function logger(req: any, res: any, next: () => void) {
  console.log(`Functional Logger: Request...`, req.path);
  next();
}
