import * as cp from 'child_process';
import { resolve } from 'path';

async function main() {
  const script = resolve(__dirname, './douban.crawler');
  const child = cp.fork(script, []);
  let invoked = false;

  child.on('error', err => {
    if (invoked) {
      return;
    }
    invoked = true;
    global.console.log(err);
  });

  child.on('exit', code => {
    if (invoked) {
      return;
    }
    invoked = false;
    const err = code === 0 ? null : new Error('exit code ' + code);
    global.console.log('exit:', err);
  });

  child.on('message', data => {
    const { result } = data;
    global.console.log('message:', result);
  });
}

main();
