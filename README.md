## Description

A blog crawler service, build with: NestJS, TypeScript, Puppeteer，MySQL.

## Preparation

1. Install MySQL, [tutorial](https://github.com/zh-rocco/fe-notes/issues/59).
2. Modify MySQL [configuration](https://github.com/zh-rocco/spider/blob/master/src/app.module.ts#L15-L16).

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

1. Post to http://localhost:3000/api/scrape/aotu
2. Post to http://localhost:3000/api/scrape/taobaofed
3. Wait a moment, open http://localhost:3000

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

MIT © [zh-rocco](https://github.com/zh-rocco)
