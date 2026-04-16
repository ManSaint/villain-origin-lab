"use client";

import { useRef, useState } from "react";

type Props = {
  audioUrl: string;
};

export function NarrationPlayer({ audioUrl }: Props) {
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().catch(() => setError(true));
      setPlaying(true);
    }
  }

  if (error) {
    return (
      <span className="font-[family-name:var(--font-display)] text-xs text-[#2a2a2a] tracking-widest uppercase">
        Narration unavailable
      </span>
    );
  }

  return (
    <>
      {/* biome-ignore lint/a11y/useMediaCaption: AI-generated narration has no transcript */}
      <audio
        ref={audioRef}
        src={audioUrl}
        onEnded={() => setPlaying(false)}
        onError={() => setError(true)}
      />
      <button
        type="button"
        onClick={toggle}
        className="flex items-center gap-3 bg-[#111111] hover:bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#8b1a1a] text-[#e8e0d0] font-[family-name:var(--font-display)] text-xs tracking-widest uppercase px-6 py-3 rounded transition-colors cursor-pointer"
      >
        <span className="text-[#8b1a1a]">{playing ? "⏸" : "▶"}</span>
        {playing ? "Pause Narration" : "Play Narration"}
      </button>
    </>
  );
}
