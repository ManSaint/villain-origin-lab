import { buildImageUrl } from "@/lib/pollinations";
import type { Scene } from "@/lib/types";

type Props = {
  scene: Scene;
  index: number;
};

export function StoryScene({ scene, index }: Props) {
  const imageUrl = buildImageUrl(scene.imagePrompt);

  return (
    <div className="w-full mb-16 last:mb-0">
      <div className="relative w-full aspect-video overflow-hidden rounded-lg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={`Scene ${index + 1}`}
          className="w-full h-full object-cover"
          loading={index === 0 ? "eager" : "lazy"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
        <div className="absolute top-4 left-4 font-[family-name:var(--font-display)] text-xs text-[#c9a84c] tracking-widest uppercase opacity-60">
          Scene {index + 1}
        </div>
      </div>
      <div className="mt-6 px-2">
        <p className="font-[family-name:var(--font-body)] text-xl leading-relaxed text-[#e8e0d0]">
          {scene.text}
        </p>
      </div>
    </div>
  );
}
