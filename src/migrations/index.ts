import * as migration_20250929_111647 from './20250929_111647';
import * as migration_20260702_153721_add_news from './20260702_153721_add_news';
import * as migration_20260702_155710_alt_optional from './20260702_155710_alt_optional';
import * as migration_20260702_165413_media_card_size from './20260702_165413_media_card_size';

export const migrations = [
  {
    up: migration_20250929_111647.up,
    down: migration_20250929_111647.down,
    name: '20250929_111647',
  },
  {
    up: migration_20260702_153721_add_news.up,
    down: migration_20260702_153721_add_news.down,
    name: '20260702_153721_add_news',
  },
  {
    up: migration_20260702_155710_alt_optional.up,
    down: migration_20260702_155710_alt_optional.down,
    name: '20260702_155710_alt_optional',
  },
  {
    up: migration_20260702_165413_media_card_size.up,
    down: migration_20260702_165413_media_card_size.down,
    name: '20260702_165413_media_card_size'
  },
];
