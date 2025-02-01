'use strict';

import express from './express.mjs';
import http from 'http';

let port = 80;
for (let i = 0; i < process.argv.length; i++) {
  if (
    process.argv[i] == '-p' &&
    process.argv.length > i + 1 &&
    process.argv[i + 1]
  ) {
    port = process.argv[i + 1];
    i++;
  }
}

http.createServer(express).listen(port, () => {
  console.log(`Server start on port ${port}`);
});
