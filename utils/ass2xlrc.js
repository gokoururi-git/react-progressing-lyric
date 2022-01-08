const { readFileSync, writeFileSync } = require('fs');
const { resolve } = require('path');

const sourcePath = resolve(process.argv[2]);
const pathArr = sourcePath.split('/');
const sourceDirname = pathArr.slice(0, pathArr.length - 1).join('/');
const sourceFilename = pathArr[pathArr.length - 1].split('.')[0];

const ass = readFileSync(sourcePath).toString();
const assLines = ass.split('\n');

let isFoundEvents = false;
let eventsIndex = -1;

const headers =
  assLines
    .find((item, index) => {
      if (!isFoundEvents) {
        if (/\[events\]/i.test(item)) {
          isFoundEvents = true;
          eventsIndex = index;
        }
        return false;
      }
      return /^format:/i.test(item);
    })
    ?.replace(/^format:\s(.*)/i, (match, content) => content)
    .replace(/\s/g, '')
    .split(',') || [];

const startIndex = headers.findIndex(s => /start/i.test(s));
const endIndex = headers.findIndex(s => /end/i.test(s));
const lyricIndex = headers.findIndex(s => /text/i.test(s));

const lyrics =
  assLines
    .slice(eventsIndex + 2)
    .filter(item => item !== '')
    .map(s => {
      const arr =
        s
          .replace(/dialogue:\s(.*)/i, (match, content) => content)
          .replace(' ', '')
          .split(',');
      return `[${arr[startIndex]},${arr[endIndex]}]${arr[lyricIndex]}`
    });

writeFileSync(resolve(sourceDirname, sourceFilename + '.xlrc'), lyrics.join('\n'));