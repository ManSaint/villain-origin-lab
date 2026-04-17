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
  const hasPrev = index > 0;
  const hasNext = index < total - 1;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="relative w-full aspect-video overflow-hidden rounded-lg bg-[#111111]">
        <img
          key={index}
          src={buildImageUrl(scene.imagePrompt)}
          alt={`Scene ${index + 1}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />

        <div className="absolute top-4 left-4 font-[family-name:var(--font-display)] text-xs text-[#c9a84c] tracking-widest uppercase opacity-60">
          Scene {index + 1} / {total}
        </div>

        {hasPrev && (
          <button
            type="button"
            onClick={() => setIndex(index - 1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-[#0a0a0a]/70 hover:bg-[#8b1a1a]/80 text-[#e8e0d0] rounded-full transition-colors cursor-pointer"
            aria-label="Previous scene"
          >
            ‹
          </button>
        )}

        {hasNext && (
          <button
            type="button"
            onClick={() => setIndex(index + 1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-[#0a0a0a]/70 hover:bg-[#8b1a1a]/80 text-[#e8e0d0] rounded-full transition-colors cursor-pointer"
            aria-label="Next scene"
          >
            ›
          </button>
        )}
      </div>

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

      <div className="mt-8 px-2">
        <p className="font-[family-name:var(--font-body)] text-xl leading-relaxed text-[#e8e0d0]">
          {scene.text}
        </p>
      </div>
    </div>
  );
}
