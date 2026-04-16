import { describe, it, expect } from 'vitest'
import { buildStoryPrompt, parseGroqResponse } from '../groq'

describe('buildStoryPrompt', () => {
  it('includes villain name and traits in prompt', () => {
    const prompt = buildStoryPrompt({ name: 'Doctor Null', traits: ['cold', 'precise', 'lonely'] })
    expect(prompt).toContain('Doctor Null')
    expect(prompt).toContain('cold')
    expect(prompt).toContain('precise')
    expect(prompt).toContain('lonely')
  })

  it('instructs model to return JSON', () => {
    const prompt = buildStoryPrompt({ name: 'X', traits: ['a', 'b', 'c'] })
    expect(prompt.toLowerCase()).toContain('json')
  })
})

describe('parseGroqResponse', () => {
  it('parses valid response', () => {
    const raw = JSON.stringify({
      title: 'The Rise of Doctor Null',
      scenes: [{ text: 'Once upon a dark time...', imagePrompt: 'a gloomy laboratory' }],
    })
    const result = parseGroqResponse(raw)
    expect(result.title).toBe('The Rise of Doctor Null')
    expect(result.scenes).toHaveLength(1)
    expect(result.scenes[0]?.text).toBe('Once upon a dark time...')
  })

  it('throws on invalid JSON', () => {
    expect(() => parseGroqResponse('not json')).toThrow()
  })

  it('throws when scenes array is missing', () => {
    expect(() => parseGroqResponse(JSON.stringify({ title: 'x' }))).toThrow()
  })
})
