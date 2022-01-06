function getMillisecond(assFormattedTime: string) {
  const arr =
    assFormattedTime
      .replace(/(.*)\.(\d*)/, (match, prefix, mil) => {
        return prefix + mil + '0';
      })
      .split(':');
  let res = Number(arr[2]);
  res += Number(arr[1]) * 60000;
  res += Number(arr[0]) * 3600000;
  return res;
}

export function parseAss(ass?: string) {
  if(!ass){
    return {
      isKaraokeLyric: false,
      lyrics: []
    }
  }
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
        return {
          start: getMillisecond(arr[startIndex]),
          end: getMillisecond(arr[endIndex]),
          lyric: arr[lyricIndex],
        }
      });

  const isKaraokeLyric = /.*\{\\k.*\}.*/ig.test(ass);

  console.log('==== lyrics', lyrics);

  return {
    isKaraokeLyric,
    lyrics
  }
}

export function getLyricIndex(currentTime: number, lyrics: ReturnType<typeof parseAss>['lyrics'], startIndex = 0){
  if(startIndex >= lyrics.length){
    return -2;
  }
  if(startIndex < 0){
    return startIndex;
  }
  for(let i = startIndex; i < lyrics.length; i++){
    if(lyrics[i].start <= currentTime){
      if(lyrics[i].end > currentTime){
        return i;
      }
      if(lyrics[i + 1]?.start >= currentTime){
        return -1;
      }
      if(lyrics[i + 1]?.end < currentTime){
        return i + 1;
      }
    }
  }
  return -3;
}