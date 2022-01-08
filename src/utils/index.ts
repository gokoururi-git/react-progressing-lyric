export const enum ErrorIndex {
  FINISH = -1,
  BETWEEN_TWO_LYRICS = -2,
}

interface LyricItem {
  start: number;
  end: number;
  lyric: string;
}

export type Lyrics = LyricItem[];

/**
 * 根据当前时间返回歌词下标
 * @param currentTime 当前时间
 * @param lyrics 歌词数组
 * @param startIndex 从哪个下标开始找
 * @returns 歌词下标
 */
export function getLyricIndex(currentTime: number, lyrics: Lyrics, startIndex = 0): number{
  if(startIndex < 0){
    throw Error(`getLyricIndex: expect not negative startIndex but received ${startIndex}`);
  }
  if(startIndex >= lyrics.length){
    console.log('done!!!');
    return ErrorIndex.FINISH;
  }
  if(lyrics[startIndex].start > currentTime){
    console.log('目前卡在两个歌词中间');
    return ErrorIndex.BETWEEN_TWO_LYRICS;
  }
  if(lyrics[startIndex].end > currentTime){
    console.log(`还在'${lyrics[startIndex].lyric}'中，还不能跳`);
    return startIndex;
  }
  console.log(`${lyrics[startIndex].lyric}歌词超时，进入下一句`);
  return getLyricIndex(currentTime, lyrics, startIndex + 1);
}