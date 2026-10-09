'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
gsap.registerPlugin(useGSAP);
const poses = {
  welcome: {
    row: 3,
    frames: 4,
  },
  idle: {
    row: 0,
    frames: 6,
  },
  next: {
    row: 4,
    frames: 5,
  },
  error: {
    row: 6,
    frames: 6,
  },
  processing: {
    row: 7,
    frames: 6,
  },
  success: {
    row: 4,
    frames: 5,
  },
  focus: {
    row: 9,
    frames: 1,
    column: 4,
  },
};
export function Mascot({ mood, paused }) {
  const scope = useRef(null),
    sprite = useRef(null);
  useGSAP(
    () => {
      const pose = poses[mood] || poses.idle;
      const setFrame = (frame) =>
        gsap.set(sprite.current, {
          x: -(pose.column ?? frame) * 192,
          y: -pose.row * 208,
        });
      setFrame(0);
      if (paused) return;
      const cursor = {
        frame: 0,
      };
      gsap.to(cursor, {
        frame: Math.max(0, pose.frames - 1),
        duration: pose.frames * 0.14,
        ease: 'none',
        repeat: ['idle', 'processing'].includes(mood) ? -1 : 0,
        onUpdate: () => setFrame(Math.floor(cursor.frame)),
        onComplete: () => {
          if (['welcome', 'next', 'success'].includes(mood))
            gsap.set(sprite.current, {
              x: 0,
              y: mood === 'success' ? -8 * 208 : 0,
            });
        },
      });
      gsap.fromTo(
        scope.current,
        {
          y: 4,
        },
        {
          y: 0,
          duration: 0.3,
          ease: 'power2.out',
        },
      );
    },
    {
      scope,
      dependencies: [mood, paused],
      revertOnUpdate: true,
    },
  );
  return (
    <div
      ref={scope}
      className="mascot-character"
      role="img"
      aria-label="Monkey D. Luck, mascote azul com chapéu de palha"
    >
      <div className="sprite-window" aria-hidden="true">
        <div ref={sprite} className="sprite-atlas" />
      </div>
    </div>
  );
}
