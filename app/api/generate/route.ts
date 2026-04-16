import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { buildStoryPrompt, parseGroqResponse } from '@/lib/groq'
import type { GenerateRequest, GenerateResponse } from '@/lib/types'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(
  req: Request,
): Promise<NextResponse<GenerateResponse | { error: string }>> {
  const body = (await req.json()) as GenerateRequest

  if (!body.name || !Array.isArray(body.traits) || body.traits.length !== 3) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  const prompt = buildStoryPrompt(body)

  let raw: string
  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.9,
      max_tokens: 1500,
    })
    raw = completion.choices[0]?.message?.content ?? ''
  } catch (err) {
    console.error('Groq error:', err)
    return NextResponse.json({ error: 'Story generation failed' }, { status: 502 })
  }

  try {
    const story = parseGroqResponse(raw)
    return NextResponse.json(story)
  } catch (err) {
    console.error('Parse error:', err)
    return NextResponse.json({ error: 'Failed to parse story' }, { status: 500 })
  }
}
