/**
 * Scrape one or more EN product pages (WooCommerce + Elementor) into
 * seed-ready JSON files.
 *
 * Usage:
 *   npx tsx src/scripts/scrape-product.ts --face <url> [<url> ...]
 *   npx tsx src/scripts/scrape-product.ts --body <url> [<url> ...]
 *
 * Rules:
 * - exactly one of --face / --body is required (decides the output folder
 *   and the `product_type` key in the JSON)
 * - URLs are normalized to the EN version: `/en` is inserted after the
 *   domain, or an existing locale segment (`/ro`, `/ru`) is swapped to it
 * - text content only; images are skipped (added manually later)
 * - EN fields are filled; RO/RU fields are left empty for a later pass
 *
 * Output: products/face/<slug>/<slug>.json or
 * products/body/<slug>/<slug>.json, shaped like the `products` collection
 * (long descriptions as Lexical JSON).
 *
 * Browser: Playwright's bundled Chromium by default. If it isn't installed
 * (`yarn playwright install`), the script falls back to a system
 * Chrome/Chromium binary automatically. CHROMIUM_PATH forces a specific one:
 *   CHROMIUM_PATH=/usr/bin/chromium npx tsx src/scripts/scrape-product.ts ...
 */
import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { chromium } from '@playwright/test'

import { slugify } from '../lib/slug'

const TITLE_SELECTOR = 'h1.product_title.entry-title'
const SHORT_DESC_PARAGRAPHS_SELECTOR =
  'div.woocommerce-product-details__short-description > p'
// Face pages use `product-post`, body pages use `wp-post` — same inner
// structure. Explicit allowlist (not "any elementor div") so Elementor-built
// header/footer blocks can never leak into product text.
const LONG_DESC_CONTAINERS = [
  'div[data-elementor-type="product-post"]',
  'div[data-elementor-type="wp-post"]',
]
const LONG_DESC_BLOCKS_SELECTOR = LONG_DESC_CONTAINERS.map((c) => `${c} h4, ${c} p`).join(
  ', ',
)

type InlineSegment = { text: string; bold: boolean; italic: boolean; underline: boolean }
type Block = { kind: 'heading' | 'paragraph'; segments: InlineSegment[] }

type LexicalNode = Record<string, unknown>

/** Lexical text format flags: bold = 1, italic = 2, underline = 8. */
function segmentFormat(seg: InlineSegment): number {
  return (seg.bold ? 1 : 0) | (seg.italic ? 2 : 0) | (seg.underline ? 8 : 0)
}

function textNode(text: string, format: number): LexicalNode {
  return {
    detail: 0,
    format,
    mode: 'normal',
    style: '',
    text,
    type: 'text',
    version: 1,
  }
}

/** Lexical editor-state document from ordered heading/paragraph blocks. */
function toLexical(blocks: Block[]): Record<string, unknown> {
  const children: LexicalNode[] = blocks
    .map((block): LexicalNode | null => {
      const nodes: LexicalNode[] = []
      for (const seg of block.segments) {
        if (!seg.text) continue
        nodes.push(textNode(seg.text, segmentFormat(seg)))
      }
      if (nodes.length === 0) return null
      const base: LexicalNode = { format: '', indent: 0, version: 1, children: nodes, direction: null }
      return block.kind === 'heading'
        ? { ...base, type: 'heading', tag: 'h4' }
        : { ...base, type: 'paragraph' }
    })
    .filter((node): node is LexicalNode => node !== null)
  return {
    root: { type: 'root', format: '', indent: 0, version: 1, children, direction: null },
  }
}

function emptyLexical(): Record<string, unknown> {
  return {
    root: { type: 'root', format: '', indent: 0, version: 1, children: [], direction: null },
  }
}

/** First path segments that mean "a locale version of this page". */
const KNOWN_LOCALES = new Set(['ro', 'ru', 'en'])

/**
 * Normalize any product URL to its EN version: `/en` is inserted after the
 * domain, or an existing locale segment is swapped to `en` (otherwise a
 * pasted `/ru/…` link would become a broken `/en/ru/…` URL).
 * Query strings and hashes are preserved.
 */
function normalizeToEn(raw: string): string {
  let url: URL
  try {
    url = new URL(raw)
  } catch {
    throw new Error(`not a valid URL: ${raw}`)
  }
  const segs = url.pathname.split('/')
  if (segs[1] === 'en') return url.toString()
  if (segs[1] && KNOWN_LOCALES.has(segs[1].toLowerCase())) {
    segs[1] = 'en'
  } else {
    segs.splice(1, 0, 'en')
  }
  url.pathname = segs.join('/')
  return url.toString()
}

function parseArgs(argv: string[]): {
  type: 'face' | 'body'
  urls: { input: string; url: string }[]
} {
  const args = argv.slice(2)
  const hasFace = args.includes('--face')
  const hasBody = args.includes('--body')
  if (hasFace === hasBody) {
    throw new Error('pass exactly one of --face or --body')
  }
  const rawUrls = args.filter((arg) => !arg.startsWith('--'))
  if (rawUrls.length === 0) throw new Error('pass at least one product URL')
  return { type: hasFace ? 'face' : 'body', urls: rawUrls.map((input) => ({ input, url: normalizeToEn(input) })) }
}

async function scrapeOne(
  browser: import('@playwright/test').Browser,
  url: string,
  outDir: string,
): Promise<{ name: string; json: string }> {
  const page = await browser.newPage()
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })
    // Elementor widgets render late — the h1 gate ensures the whole
    // product DOM (including the long-desc sections) is present.
    await page.waitForLoadState('networkidle', { timeout: 60000 }).catch(() => {})
    await page.waitForSelector(TITLE_SELECTOR, { timeout: 30000 })

    // NOTE: the extractor runs as a *string* in the page, not as a closure:
    // tsx compiles with function-name helpers (`__name`) that don't exist in
    // the browser context, so passing a function reference breaks.
    const extracted = (await page.evaluate(
      `(() => {
        const titleSel = ${JSON.stringify(TITLE_SELECTOR)};
        const shortSel = ${JSON.stringify(SHORT_DESC_PARAGRAPHS_SELECTOR)};
        const longSel = ${JSON.stringify(LONG_DESC_BLOCKS_SELECTOR)};
        const text = (el) => (el?.textContent ?? '').trim();

        const titleEl = document.querySelector(titleSel);
        const title = text(titleEl);

        // Drop the first <p> (e.g. the Klarna installments line).
        const shortParas = Array.from(document.querySelectorAll(shortSel))
          .slice(1)
          .map((p) => text(p))
          .filter(Boolean);

        const collect = (root) => {
          const segs = [];
          const walk = (node, bold, italic, underline) => {
            if (node.nodeType === Node.TEXT_NODE) {
              segs.push({ text: node.textContent ?? '', bold, italic, underline });
            } else if (node.nodeType === Node.ELEMENT_NODE) {
              if (node.tagName === 'BR') {
                segs.push({ text: '\\n', bold: false, italic: false, underline: false });
                return;
              }
              const tag = node.tagName;
              const style = node.getAttribute ? (node.getAttribute('style') ?? '') : '';
              node.childNodes.forEach((child) =>
                walk(
                  child,
                  bold || tag === 'STRONG' || tag === 'B',
                  italic || tag === 'EM' || tag === 'I',
                  underline || tag === 'U' || style.includes('underline'),
                ),
              );
            }
          };
          walk(root, false, false, false);
          // Collapse whitespace but keep intentional newlines from <br>.
          return segs
            .map((s) => ({ ...s, text: s.text.replace(/[ \\t\\r\\f\\v]+/g, ' ') }))
            .filter((s) => s.text.trim() !== '' || s.text.includes('\\n'));
        };

        // Site chrome lives inside the same container: nav lines, the video-
        // consultation CTA, and everything from "Other products…" to the end
        // (address, hours, footer links). None of it is product content.
        const CHROME_EXACT = new Set(['Face Line', 'Body line', 'Health line']);
        const blocks = [];
        for (const el of document.querySelectorAll(longSel)) {
          const txt = (el.textContent ?? '').trim();
          if (el.tagName === 'H4' && /^other products and treatments$/i.test(txt)) break;
          if (el.tagName === 'P' && (CHROME_EXACT.has(txt) || /video consultation/i.test(txt))) continue;
          blocks.push({
            kind: el.tagName === 'H4' ? 'heading' : 'paragraph',
            segments: collect(el),
          });
        }

        return { title, shortParas, blocks };
      })()`,
    )) as { title: string; shortParas: string[]; blocks: Block[] }

    if (!extracted.title) throw new Error(`no product title found (${TITLE_SELECTOR})`)
    if (extracted.shortParas.length === 0) {
      throw new Error(`no short-description paragraphs found (${SHORT_DESC_PARAGRAPHS_SELECTOR})`)
    }
    if (extracted.blocks.length === 0) {
      throw new Error(`no long-description blocks found (${LONG_DESC_BLOCKS_SELECTOR})`)
    }

    return {
      name: extracted.title,
      json: JSON.stringify(
        {
          product_type: path.basename(outDir),
          product_name_en: extracted.title,
          product_name_ro: '',
          product_name_ru: '',
          product_short_desc_en: extracted.shortParas.join('\n\n'),
          product_short_desc_ro: '',
          product_short_desc_ru: '',
          product_long_desc_en: toLexical(extracted.blocks),
          product_long_desc_ro: emptyLexical(),
          product_long_desc_ru: emptyLexical(),
          source_url: url,
        },
        null,
        2,
      ),
    }
  } finally {
    await page.close()
  }
}

/** Locate a system Chrome/Chromium binary, if one is installed. */
function findSystemBrowser(): string | null {
  const candidates = [
    ...(process.env.CHROMIUM_PATH ? [process.env.CHROMIUM_PATH] : []),
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
  ]
  for (const bin of candidates) {
    try {
      fs.accessSync(bin, fs.constants.X_OK)
      return bin
    } catch {
      // not usable — try the next one
    }
  }
  for (const name of ['chromium', 'chromium-browser', 'google-chrome']) {
    try {
      const found = execSync(`command -v ${name}`, {
        stdio: ['ignore', 'pipe', 'ignore'],
      })
        .toString()
        .trim()
      if (found) return found
    } catch {
      // not on PATH — keep looking
    }
  }
  return null
}

async function launchBrowser(): Promise<import('@playwright/test').Browser> {
  try {
    return await chromium.launch()
  } catch (err) {
    if (!(err as Error).message.includes("Executable doesn't exist")) throw err
    const system = findSystemBrowser()
    if (!system) {
      throw new Error(
        `${(err as Error).message}\nNo system Chrome/Chromium found either — run \`yarn playwright install\` or set CHROMIUM_PATH.`,
      )
    }
    console.log(`bundled Chromium missing, using system browser at ${system}`)
    return await chromium.launch({ executablePath: system })
  }
}

async function main() {
  const { type, urls } = parseArgs(process.argv)
  const outDir = path.resolve(process.cwd(), 'products', type)
  fs.mkdirSync(outDir, { recursive: true })

  const browser = await launchBrowser()
  const failures: string[] = []
  try {
    for (const { input, url } of urls) {
      try {
        // Filename slug uses the same normalizer as the DB hook. One folder
        // per product, JSON inside keeps the slug name.
        const { name, json } = await scrapeOne(browser, url, outDir)
        const slug = slugify(name) || 'product'
        const dir = path.join(outDir, slug)
        fs.mkdirSync(dir, { recursive: true })
        const file = path.join(dir, `${slug}.json`)
        fs.writeFileSync(file, `${json}\n`)
        const via = input === url ? '' : ` (normalized from ${input})`
        console.log(`ok  ${url} -> ${path.relative(process.cwd(), file)}${via}`)
      } catch (err) {
        failures.push(`${url}: ${(err as Error).message}`)
        console.error(`fail  ${url}: ${(err as Error).message}`)
      }
    }
  } finally {
    await browser.close()
  }
  if (failures.length > 0) {
    throw new Error(`${failures.length} of ${urls.length} URLs failed`)
  }
}

main().catch((err) => {
  console.error((err as Error).message)
  process.exit(1)
})
