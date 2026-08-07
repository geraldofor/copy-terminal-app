import { useEffect, useState } from "react";

interface TypewriterOptions {
  speed?: number; // ms per step
  startDelay?: number; // ms before typing begins
  loop?: boolean; // type, pause, erase and retype
  pause?: number; // ms to hold the full text when looping
}

/**
 * Reveal `text` progressively like a terminal typing it out.
 * When `loop` is enabled the text is erased and retyped forever.
 */
export function useTypewriter(
  text: string,
  { speed = 14, startDelay = 350, loop = false, pause = 2200 }: TypewriterOptions = {},
) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let i = 0;
    let direction: 1 | -1 = 1;
    let interval: number | undefined;
    let timeout: number | undefined;

    const stop = () => {
      if (interval !== undefined) window.clearInterval(interval);
      if (timeout !== undefined) window.clearTimeout(timeout);
    };

    const step = () => {
      interval = window.setInterval(() => {
        i += direction * (direction === 1 ? 1 + Math.floor(Math.random() * 2) : 2);
        if (i >= text.length) {
          stop();
          setCount(text.length);
          if (loop) {
            timeout = window.setTimeout(() => {
              direction = -1;
              step();
            }, pause);
          }
        } else if (i <= 0) {
          stop();
          setCount(0);
          direction = 1;
          timeout = window.setTimeout(step, 500);
        } else {
          setCount(i);
        }
      }, speed);
    };

    timeout = window.setTimeout(step, startDelay);
    return stop;
  }, [text, speed, startDelay, loop, pause]);

  return text.slice(0, count);
}
