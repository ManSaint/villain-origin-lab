"use client";

import type { GenerateResponse, NarrateResponse } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LOADING_COPY = [
  "Unearthing your origin…",
  "Consulting the ancient scrolls of villainy…",
  "Summoning your inner darkness…",
  "Forging your tragic backstory…",
  "The laboratory grows ominous…",
];

export function VillainForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [traits, setTraits] = useState<[string, string, string]>(["", "", ""]);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState(LOADING_COPY[0] ?? "");
  const [error, setError] = useState<string | null>(null);

  function updateTrait(index: 0 | 1 | 2, value: string) {
    setTraits((prev) => {
      const next = [...prev] as [string, string, string];
      next[index] = value;
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || traits.some((t) => !t.trim())) return;

    setLoading(true);
    setError(null);

    let copyIndex = 0;
    const copyInterval = setInterval(() => {
      copyIndex = (copyIndex + 1) % LOADING_COPY.length;
      setLoadingText(LOADING_COPY[copyIndex] ?? "");
    }, 2500);

    try {
      const genRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), traits }),
      });
      if (!genRes.ok) throw new Error("Story generation failed");
      const story = (await genRes.json()) as GenerateResponse;

      const narRes = await fetch("/api/narrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: story.title,
          name: name.trim(),
          scenes: story.scenes,
        }),
      });
      if (!narRes.ok) throw new Error("Narration failed");
      const { id } = (await narRes.json()) as NarrateResponse;

      router.push(`/story/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    } finally {
      clearInterval(copyInterval);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4">
        <div className="w-16 h-16 border-2 border-[#8b1a1a] border-t-transparent rounded-full animate-spin" />
        <p className="font-[family-name:var(--font-display)] text-xl text-[#c9a84c] text-center animate-pulse">
          {loadingText}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-16">
      <div className="w-full max-w-lg">
        <div className="text-center mb-12">
          <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl text-[#c9a84c] mb-3 tracking-widest uppercase">
            Villain Origin Lab
          </h1>
          <p className="font-[family-name:var(--font-body)] text-lg text-[#e8e0d0] opacity-70">
            Every villain has an origin. What&apos;s yours?
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="villain-name"
              className="block font-[family-name:var(--font-display)] text-xs text-[#c9a84c] tracking-widest uppercase mb-2"
            >
              Villain Name
            </label>
            <input
              id="villain-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Doctor Mortifex"
              maxLength={60}
              required
              className="w-full bg-[#111111] border border-[#2a2a2a] text-[#e8e0d0] font-[family-name:var(--font-body)] text-lg px-4 py-3 rounded focus:outline-none focus:border-[#8b1a1a] transition-colors placeholder:opacity-30"
            />
          </div>

          <div>
            <label
              htmlFor="trait-0"
              className="block font-[family-name:var(--font-display)] text-xs text-[#c9a84c] tracking-widest uppercase mb-2"
            >
              Personality Traits
            </label>
            <div className="space-y-3">
              {(["obsessive", "brilliant", "betrayed"] as const).map(
                (placeholder, i) => (
                  <input
                    key={placeholder}
                    id={`trait-${i}`}
                    type="text"
                    value={traits[i as 0 | 1 | 2]}
                    onChange={(e) =>
                      updateTrait(i as 0 | 1 | 2, e.target.value)
                    }
                    placeholder={`e.g. ${placeholder}`}
                    maxLength={30}
                    required
                    className="w-full bg-[#111111] border border-[#2a2a2a] text-[#e8e0d0] font-[family-name:var(--font-body)] text-base px-4 py-3 rounded focus:outline-none focus:border-[#8b1a1a] transition-colors placeholder:opacity-30"
                  />
                ),
              )}
            </div>
          </div>

          {error && (
            <p className="text-[#c0392b] font-[family-name:var(--font-body)] text-sm text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-[#8b1a1a] hover:bg-[#c0392b] text-[#e8e0d0] font-[family-name:var(--font-display)] text-sm tracking-widest uppercase py-4 rounded transition-colors cursor-pointer"
          >
            Reveal My Origin
          </button>
        </form>
      </div>
    </div>
  );
}
