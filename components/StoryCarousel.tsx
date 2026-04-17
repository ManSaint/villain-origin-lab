"use client";

import { buildImageUrl } from "@/lib/pollinations";
import type { Scene } from "@/lib/types";
import { useState } from "react";

type Props = {
  scenes: Scene[];
};

export function StoryCarousel({ scenes }: Props) {
  const [index, setIndex] = useState(0);

  const scene = scenes[index];
  if (!scene) return null;

  const total = scenes.length;
  const canPrev = index > 0;
  const canNext = index < total - 1;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
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
            onClick={() => setIndex((i) => i - 1)}
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
            onClick={() => setIndex((i) => i + 1)}
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
            onClick={() => setIndex(i)}
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

      {/* Text nav */}
      <div className="flex justify-between mt-10">
        <button
          type="button"
          onClick={() => setIndex((i) => i - 1)}
          disabled={!canPrev}
          className="font-[family-name:var(--font-display)] text-xs text-[#e8e0d0] tracking-widest uppercase opacity-40 hover:opacity-100 disabled:pointer-events-none transition-opacity cursor-pointer"
        >
          ← Previous
        </button>
        <button
          type="button"
          onClick={() => setIndex((i) => i + 1)}
          disabled={!canNext}
          className="font-[family-name:var(--font-display)] text-xs text-[#e8e0d0] tracking-widest uppercase opacity-40 hover:opacity-100 disabled:pointer-events-none transition-opacity cursor-pointer"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
