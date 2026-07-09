import type { MetadataRoute } from 'next'

/**
 * PWA web app manifest. Static and single-language, so copy is in Romanian
 * (the default locale). Icon PNGs live in `public/icons/` — regular ones are
 * the crest on transparency, `maskable` ones sit inside the 80% safe zone on
 * the brand's cream background so launchers can crop them into any shape.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    lang: 'ro',
    name: 'Palazzo Aesthetics',
    short_name: 'Palazzo',
    description:
      'Clinică de fitoestetică și fitoterapie în Chișinău — îngrijire pentru corp și minte.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F2F1EE',
    theme_color: '#51623D',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/icon-maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
