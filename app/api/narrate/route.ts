import { buildNarrationText } from "@/lib/elevenlabs";
import { saveStory } from "@/lib/storage";
import type { NarrateRequest, NarrateResponse } from "@/lib/types";
import { put } from "@vercel/blob";
import { ElevenLabsClient } from "elevenlabs";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

export async function POST(
  req: Request,
): Promise<NextResponse<NarrateResponse | { error: string }>> {
  const body = (await req.json()) as NarrateRequest;
  const { title, name, scenes } = body;
  const id = nanoid(10);

  const narrationText = buildNarrationText(title, name, scenes);

  let audioBuffer: ArrayBuffer;
  try {
    const voiceId = process.env.ELEVENLABS_VOICE_ID ?? "onyx";
    const stream = await elevenlabs.textToSpeech.convert(voiceId, {
      text: narrationText,
      model_id: "eleven_monolingual_v1",
      voice_settings: { stability: 0.5, similarity_boost: 0.75 },
    });

    const chunks: Uint8Array[] = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    const totalLength = chunks.reduce((sum, c) => sum + c.length, 0);
    const combined = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      combined.set(chunk, offset);
      offset += chunk.length;
    }
    audioBuffer = combined.buffer;
  } catch (err) {
    console.error("ElevenLabs error:", err);
    return NextResponse.json({ error: "Narration failed" }, { status: 502 });
  }

  let audioUrl: string;
  try {
    const blob = await put(`stories/${id}/narration.mp3`, audioBuffer, {
      access: "public",
      contentType: "audio/mpeg",
    });
    audioUrl = blob.url;
  } catch (err) {
    console.error("Blob upload error:", err);
    return NextResponse.json({ error: "Audio upload failed" }, { status: 500 });
  }

  const story = {
    id,
    title,
    name,
    scenes,
    audioUrl,
    createdAt: new Date().toISOString(),
  };

  try {
    await saveStory(story);
  } catch (err) {
    console.error("KV save error:", err);
    return NextResponse.json({ error: "Story save failed" }, { status: 500 });
  }

  return NextResponse.json({ id, audioUrl });
}
