import type { Scene } from './types'

export function buildNarrationText(title: string, name: string, scenes: Scene[]): string {
  const intro = `${title}. The origin of ${name}.`
  const sceneTexts = scenes.map((s) => s.text).join(' ... ')
  return `${intro} ... ${sceneTexts}`
}
