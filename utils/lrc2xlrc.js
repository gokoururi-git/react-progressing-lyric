const { readFileSync, writeFileSync } = require('fs');
const { resolve } = require('path');

const sourcePath = resolve(process.argv[2]);
const pathArr = sourcePath.split('/');
const sourceDirname = pathArr.slice(0, pathArr.length - 1).join('/');
const sourceFilename = pathArr[pathArr.length - 1].split('.')[0];

const lrc = readFileSync(sourcePath).toString();
const lrcLines =
  lrc
    .split('\n')
    .filter(item => item !== '')
    .map(s => {
      const [time, content] = s.slice(1).split(']');
      const timeArr = time.split(':');
      while(timeArr.length <3){
        timeArr.unshift('0')
      }
      return {
        time: timeArr.join(':'),
        content
      }
    });

writeFileSync(
  resolve(sourceDirname, sourceFilename + '.xlrc'),
  lrcLines.map((item, index) =>{
    return index === lrcLines.length - 1
      ? ''
      : `[${
        item.time
      },${
        lrcLines[index + 1].time
      }]${
        item.content
      }`
  })
  .join('\n')
);