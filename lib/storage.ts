import { kv } from '@vercel/kv'
import type { Story } from './types'

export async function saveStory(story: Story): Promise<void> {
  await kv.set(`story:${story.id}`, story)
}

export async function getStory(id: string): Promise<Story | null> {
  return kv.get<Story>(`story:${id}`)
}
