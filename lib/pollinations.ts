export function buildImageUrl(prompt: string): string {
  const encoded = encodeURIComponent(prompt);
  return `https://image.pollinations.ai/prompt/${encoded}?model=flux&width=1024&height=576&nologo=true`;
}
