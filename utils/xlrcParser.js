/**
 * @param {string} assFormattedTime
 */
function getMillisecond(assFormattedTime) {
  const arr =
    assFormattedTime
      .replace(/(.*)\.(\d*)/, (match, prefix, mil) => {
        return prefix + mil.padEnd(3, '0');
      })
      .split(':');
  let res = Number(arr[2] || 0);
  res += Number(arr[1] || 0) * 60000;
  res += Number(arr[0] || 0) * 3600000;
  return res;
}

/**
 * @param {string} xlrc
 */
function parseXlrc(xlrc) {
  if (!xlrc) {
    return [];
  }
  return xlrc
    .split('\n')
    .filter(item => item !== '')
    .map(str => {
      const [time, lyric] = str.slice(1).split(']');
      const [start, end] = time.split(',');
      return {
        start: getMillisecond(start),
        end: getMillisecond(end),
        lyric,
      }
    });
}

module.exports = parseXlrc;