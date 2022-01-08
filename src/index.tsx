import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { ErrorIndex, getLyricIndex, Lyrics } from './utils/index';
import { PlayStatus } from './constants/index';
import cls from 'classnames';
import styles from './index.scss';

interface KaraokeProps {
  lyrics: Lyrics;
  musicURL: string;
  containerClassName?: string;
  lyricClassName?: string;
  progressedLyricClassName?: string;
  toBeProgressedLyricClassName?: string;
}

export function Karaoke({
  lyrics,
  musicURL,
  containerClassName,
  lyricClassName,
  progressedLyricClassName,
  toBeProgressedLyricClassName
}: KaraokeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isNotBetweenTwoRef = useRef(true);
  const initTimeRef = useRef(new Date().getTime());
  const listContainerRef = useRef(null);
  const listRef = useRef(null);
  const itemRef = useRef(null);
  const timerRef = useRef(null);
  const [palyState, setPlayState] = useState(PlayStatus.PREPARED);

  const audio = new Audio(musicURL);

  useEffect(() => {
    const containerStyle = getComputedStyle(listContainerRef.current);
    listRef.current.style.top = (Number(containerStyle.height.split('px')[0]) / 2) + 'px';
    return () => {
      clearInterval(timerRef.current);
    }
  }, []);

  function palyMusic() {
    setPlayState(PlayStatus.PLAYING);
    const itemHeight = Number(getComputedStyle(itemRef.current).height.split('px')[0]);

    function moveNLine(n: number) {
      console.log(`move ${n} line!`);
      listRef.current.style.top = (Number(listRef.current.style.top.split('px')[0]) - itemHeight * n) + 'px';
    }

    function intoBetweenAndGiveNextIndex(preIndex: number) {
      let res = preIndex;
      if (isNotBetweenTwoRef.current) {
        isNotBetweenTwoRef.current = false;
        moveNLine(0.5);
        res++;
      }
      return res;
    }

    function dealBetweenAndApplyNextLine() {
      if (!isNotBetweenTwoRef.current) {
        moveNLine(0.5);
        isNotBetweenTwoRef.current = true;
        return;
      }
      moveNLine(1);
    }

    timerRef.current = setInterval(() => {
      setCurrentIndex(pre => {
        const nextIndex = getLyricIndex(new Date().getTime() - initTimeRef.current, lyrics, pre);
        if (pre === nextIndex) {
          return pre;
        }
        if (nextIndex === ErrorIndex.FINISH) {
          clearInterval(timerRef.current);
          return pre;
        }
        if (nextIndex === ErrorIndex.BETWEEN_TWO_LYRICS) {
          return intoBetweenAndGiveNextIndex(pre);
        }
        dealBetweenAndApplyNextLine();
        return nextIndex;
      });
    }, 100);
  }

  useEffect(() => {
    if (palyState === PlayStatus.PLAYING) {
      audio.play();
      return;
    }
    if (palyState === PlayStatus.PAUSE) {
      audio.pause();
      return;
    }
  }, [palyState]);

  return (
    <div className={`${styles['default-container']} ${containerClassName || ''}`}>
      <button onClick={palyMusic}>播放</button>
      <div className={styles['list-container']} ref={listContainerRef}>
        <div className={styles['list']} ref={listRef}>
          {lyrics.map((item, index) =>
            <div
              ref={itemRef}
              key={index}
              className={cls({
                [lyricClassName || '']: true,
                [styles['active']]: (currentIndex === index && isNotBetweenTwoRef.current)
              })}
            >{item.lyric}</div>)}
        </div>
      </div>
    </div>
  );
}

export default Karaoke;
