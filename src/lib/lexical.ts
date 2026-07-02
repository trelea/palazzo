type LexicalNode = { type?: string; text?: string; children?: unknown[]; [k: string]: unknown }

/** Structural subset of the generated richText field type (News['desc_*'] is assignable). */
type LexicalRichText = { root: { children: unknown[] } } | null | undefined

const BLOCK_TYPES = new Set(['paragraph', 'heading', 'listitem', 'quote'])

export function lexicalToPlainText(data: LexicalRichText): string {
  if (!data?.root?.children) return ''
  const parts: string[] = []
  const walk = (nodes: unknown[]) => {
    for (const raw of nodes) {
      const node = raw as LexicalNode
      if (typeof node.text === 'string') parts.push(node.text)
      if (Array.isArray(node.children)) {
        walk(node.children)
        if (BLOCK_TYPES.has(node.type ?? '')) parts.push(' ')
      }
    }
  }
  walk(data.root.children)
  return parts.join('').replace(/\s+/g, ' ').trim()
}

export function lexicalExcerpt(data: LexicalRichText, maxLength = 160): string {
  const text = lexicalToPlainText(data)
  if (text.length <= maxLength) return text
  const cut = text.slice(0, maxLength + 1)
  const lastSpace = cut.lastIndexOf(' ')
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : maxLength).trimEnd()}…`
}
