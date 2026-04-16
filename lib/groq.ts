import type { GenerateRequest, GenerateResponse } from './types'

export function buildStoryPrompt({ name, traits }: GenerateRequest): string {
  return `You are a dark comedy narrator specializing in villain origin stories.

Generate an origin story for a villain named "${name}" with these personality traits: ${traits.join(', ')}.

Rules:
- Dark comedy tone: dramatic but self-aware, slightly absurd
- 1 to 4 scenes (you decide based on what makes the story compelling)
- Each scene: 2-4 sentences of vivid narrative text + a detailed visual image prompt
- The image prompt should describe a cinematic scene suitable for an AI image generator

Return ONLY valid JSON with this exact structure (no markdown, no explanation):
{
  "title": "The [Adjective] Rise of [Name]",
  "scenes": [
    {
      "text": "narrative text here",
      "imagePrompt": "detailed visual description for image generation"
    }
  ]
}`
}

export function parseGroqResponse(raw: string): GenerateResponse {
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new Error(`Invalid JSON from Groq: ${raw.slice(0, 100)}`)
  }

  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    !('title' in parsed) ||
    !('scenes' in parsed) ||
    !Array.isArray((parsed as { scenes: unknown }).scenes)
  ) {
    throw new Error('Groq response missing required fields')
  }

  return parsed as GenerateResponse
}
