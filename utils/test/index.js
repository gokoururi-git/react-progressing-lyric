const parseXlrc = require('../xlrcParser');
const { readFileSync, writeFileSync } = require('fs');
const {resolve} = require('path');

writeFileSync('./test/assets/test.json', JSON.stringify(parseXlrc(readFileSync(resolve(process.argv[2])).toString())));
