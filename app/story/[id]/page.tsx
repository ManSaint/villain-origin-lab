import { NarrationPlayer } from "@/components/NarrationPlayer";
import { ShareButton } from "@/components/ShareButton";
import { StoryCarousel } from "@/components/StoryCarousel";
import { getStory } from "@/lib/storage";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const story = await getStory(id);
  if (!story) return { title: "Villain Not Found" };
  return {
    title: `${story.title} | Villain Origin Lab`,
    description: story.scenes[0]?.text,
  };
}

export default async function StoryPage({ params }: Props) {
  const { id } = await params;
  const story = await getStory(id);

  if (!story) notFound();

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 pt-16 pb-8 text-center">
        <p className="font-[family-name:var(--font-display)] text-xs text-[#8b1a1a] tracking-widest uppercase mb-4">
          Origin Story
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-5xl text-[#c9a84c] leading-tight mb-3">
          {story.title}
        </h1>
        <p className="font-[family-name:var(--font-body)] text-[#e8e0d0] opacity-50">
          The villain: <span className="opacity-100 italic">{story.name}</span>
        </p>
      </div>

      <StoryCarousel scenes={story.scenes} />

      <div className="sticky bottom-0 border-t border-[#2a2a2a] bg-[#0a0a0a]/95 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between gap-4 flex-wrap">
          <NarrationPlayer audioUrl={story.audioUrl} />
          <div className="flex items-center gap-4">
            <ShareButton />
            <Link
              href="/"
              className="font-[family-name:var(--font-display)] text-xs text-[#e8e0d0] opacity-50 hover:opacity-100 tracking-widest uppercase transition-opacity"
            >
              Create Yours →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
