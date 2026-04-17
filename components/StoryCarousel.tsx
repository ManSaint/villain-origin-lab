"use client";

import { buildImageUrl } from "@/lib/pollinations";
import type { Scene } from "@/lib/types";
import { useEffect, useRef, useState } from "react";

type Props = {
  scenes: Scene[];
  audioUrl: string;
  title: string;
  name: string;
};

/** Estimate seek time for a scene based on proportional character count. */
function sceneSeekTime(
  title: string,
  name: string,
  scenes: Scene[],
  sceneIndex: number,
  duration: number,
): number {
  // Matches buildNarrationText: "{title}. The origin of {name}. ... scene0 ... scene1 ..."
  const intro = `${title}. The origin of ${name}.`;
  const parts = [intro, ...scenes.map((s) => s.text)];
  const totalChars = parts.reduce((n, p) => n + p.length, 0);
  // scene i starts after intro + scenes[0..i-1], i.e. parts[0..i]
  const charsBefore = parts
    .slice(0, sceneIndex + 1)
    .reduce((n, p) => n + p.length, 0);
  return (charsBefore / totalChars) * duration;
}

export function StoryCarousel({ scenes, audioUrl, title, name }: Props) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const scene = scenes[index];
  if (!scene) return null;

  const total = scenes.length;
  const canPrev = index > 0;
  const canNext = index < total - 1;

  // When scene changes while audio is playing, seek to that scene's position.
  // biome-ignore lint/correctness/useExhaustiveDependencies: title/name are stable per story
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !playing || !audio.duration) return;
    audio.currentTime = sceneSeekTime(
      title,
      name,
      scenes,
      index,
      audio.duration,
    );
  }, [index, playing]);

  function navigate(next: number) {
    setIndex(next);
  }

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      // If audio hasn't seeked to current scene yet, do it now.
      if (audio.duration && audio.currentTime === 0) {
        audio.currentTime = sceneSeekTime(
          title,
          name,
          scenes,
          index,
          audio.duration,
        );
      }
      audio.play().catch(() => setAudioError(true));
      setPlaying(true);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* biome-ignore lint/a11y/useMediaCaption: AI-generated narration has no transcript */}
      <audio
        ref={audioRef}
        src={audioUrl}
        onEnded={() => setPlaying(false)}
        onError={() => setAudioError(true)}
      />

      {/* Image */}
      <div className="relative w-full aspect-video overflow-hidden rounded-lg bg-[#111111] group">
        <img
          key={index}
          src={buildImageUrl(scene.imagePrompt)}
          alt={`Scene ${index + 1}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />

        {/* Scene counter */}
        <div className="absolute top-4 left-4 font-[family-name:var(--font-display)] text-xs text-[#c9a84c] tracking-widest uppercase opacity-60">
          Scene {index + 1} / {total}
        </div>

        {/* Prev arrow */}
        {canPrev && (
          <button
            type="button"
            onClick={() => navigate(index - 1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-xl bg-[#0a0a0a]/70 hover:bg-[#8b1a1a]/80 text-[#e8e0d0] rounded-full transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
            aria-label="Previous scene"
          >
            ‹
          </button>
        )}

        {/* Next arrow */}
        {canNext && (
          <button
            type="button"
            onClick={() => navigate(index + 1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-xl bg-[#0a0a0a]/70 hover:bg-[#8b1a1a]/80 text-[#e8e0d0] rounded-full transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
            aria-label="Next scene"
          >
            ›
          </button>
        )}
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {scenes.map((_, i) => (
          <button
            // biome-ignore lint/suspicious/noArrayIndexKey: stable fixed-length array
            key={i}
            type="button"
            onClick={() => navigate(i)}
            aria-label={`Go to scene ${i + 1}`}
            className={`w-2 h-2 rounded-full transition-colors cursor-pointer ${
              i === index ? "bg-[#c9a84c]" : "bg-[#2a2a2a] hover:bg-[#8b1a1a]"
            }`}
          />
        ))}
      </div>

      {/* Scene text */}
      <div className="mt-8 px-2">
        <p className="font-[family-name:var(--font-body)] text-xl leading-relaxed text-[#e8e0d0]">
          {scene.text}
        </p>
      </div>

      {/* Text nav + narration */}
      <div className="flex items-center justify-between mt-10">
        <button
          type="button"
          onClick={() => navigate(index - 1)}
          disabled={!canPrev}
          className="font-[family-name:var(--font-display)] text-xs text-[#e8e0d0] tracking-widest uppercase opacity-40 hover:opacity-100 disabled:pointer-events-none transition-opacity cursor-pointer"
        >
          ← Previous
        </button>

        {!audioError && (
          <button
            type="button"
            onClick={togglePlay}
            className="flex items-center gap-2 bg-[#111111] hover:bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#8b1a1a] text-[#e8e0d0] font-[family-name:var(--font-display)] text-xs tracking-widest uppercase px-4 py-2 rounded transition-colors cursor-pointer"
          >
            <span className="text-[#8b1a1a]">{playing ? "⏸" : "▶"}</span>
            {playing ? "Pause" : "Narrate"}
          </button>
        )}

        <button
          type="button"
          onClick={() => navigate(index + 1)}
          disabled={!canNext}
          className="font-[family-name:var(--font-display)] text-xs text-[#e8e0d0] tracking-widest uppercase opacity-40 hover:opacity-100 disabled:pointer-events-none transition-opacity cursor-pointer"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
