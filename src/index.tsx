import React, { useMemo } from 'react';
import { useState, useRef, useEffect } from 'react';
import { getLyricIndex, parseAss } from './utils/assParser';

interface KaraokeProps {
  ass?: string;
  containerClassName?: string;
  lyricClassName?: string;
  progressedLyricClassName?: string;
  toBeProgressedLyricClassName?: string;
}

export function Karaoke({
  ass,
  containerClassName,
  lyricClassName,
  progressedLyricClassName,
  toBeProgressedLyricClassName
}: KaraokeProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const currentTimeRef = useRef(0);
  const initTimeRef = useRef(new Date().getTime());
  const preLyricIndexRef = useRef(0);
  useEffect(()=>{
    setInterval(()=>{
      setCurrentTime(new Date().getTime() - initTimeRef.current);
      currentTimeRef.current = new Date().getTime() - initTimeRef.current;
    }, 10)
  }, [setCurrentTime]);
  const { isKaraokeLyric, lyrics } = useMemo(() => parseAss(ass), [ass]) ;
  if (!ass) {
    return <div>异常</div>;
  }
  const currentLyricIndex = getLyricIndex(currentTimeRef.current, lyrics, preLyricIndexRef.current);
  preLyricIndexRef.current = currentLyricIndex;
  if(currentLyricIndex === -2){
    return <div>播放已结束</div>
  }
  if(currentLyricIndex === -3){
    return <div>异常</div>
  }
  return <div className={containerClassName}>
    {currentLyricIndex === -1 ? '中间':lyrics[currentLyricIndex].lyric}
  </div>
}

export default Karaoke;
