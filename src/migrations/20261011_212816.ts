import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_products\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`slug\` text NOT NULL,
  	\`product_type_id\` integer NOT NULL,
  	\`product_name_en\` text NOT NULL,
  	\`product_name_ro\` text NOT NULL,
  	\`product_name_ru\` text NOT NULL,
  	\`product_price\` numeric DEFAULT 0 NOT NULL,
  	\`product_short_desc_en\` text NOT NULL,
  	\`product_short_desc_ro\` text NOT NULL,
  	\`product_short_desc_ru\` text NOT NULL,
  	\`product_long_desc_en\` text NOT NULL,
  	\`product_long_desc_ro\` text NOT NULL,
  	\`product_long_desc_ru\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`product_type_id\`) REFERENCES \`product_types\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_products\`("id", "slug", "product_type_id", "product_name_en", "product_name_ro", "product_name_ru", "product_price", "product_short_desc_en", "product_short_desc_ro", "product_short_desc_ru", "product_long_desc_en", "product_long_desc_ro", "product_long_desc_ru", "updated_at", "created_at") SELECT "id", "slug", "product_type_id", "product_name_en", "product_name_ro", "product_name_ru", COALESCE("product_price", 0), "product_short_desc_en", "product_short_desc_ro", "product_short_desc_ru", "product_long_desc_en", "product_long_desc_ro", "product_long_desc_ru", "updated_at", "created_at" FROM \`products\`;`)
  await db.run(sql`DROP TABLE \`products\`;`)
  await db.run(sql`ALTER TABLE \`__new_products\` RENAME TO \`products\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE UNIQUE INDEX \`products_slug_idx\` ON \`products\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`products_product_type_idx\` ON \`products\` (\`product_type_id\`);`)
  await db.run(sql`CREATE INDEX \`products_updated_at_idx\` ON \`products\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`products_created_at_idx\` ON \`products\` (\`created_at\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_products\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`slug\` text NOT NULL,
  	\`product_type_id\` integer NOT NULL,
  	\`product_name_en\` text NOT NULL,
  	\`product_name_ro\` text NOT NULL,
  	\`product_name_ru\` text NOT NULL,
  	\`product_price\` numeric,
  	\`product_short_desc_en\` text NOT NULL,
  	\`product_short_desc_ro\` text NOT NULL,
  	\`product_short_desc_ru\` text NOT NULL,
  	\`product_long_desc_en\` text NOT NULL,
  	\`product_long_desc_ro\` text NOT NULL,
  	\`product_long_desc_ru\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`product_type_id\`) REFERENCES \`product_types\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_products\`("id", "slug", "product_type_id", "product_name_en", "product_name_ro", "product_name_ru", "product_price", "product_short_desc_en", "product_short_desc_ro", "product_short_desc_ru", "product_long_desc_en", "product_long_desc_ro", "product_long_desc_ru", "updated_at", "created_at") SELECT "id", "slug", "product_type_id", "product_name_en", "product_name_ro", "product_name_ru", COALESCE("product_price", 0), "product_short_desc_en", "product_short_desc_ro", "product_short_desc_ru", "product_long_desc_en", "product_long_desc_ro", "product_long_desc_ru", "updated_at", "created_at" FROM \`products\`;`)
  await db.run(sql`DROP TABLE \`products\`;`)
  await db.run(sql`ALTER TABLE \`__new_products\` RENAME TO \`products\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE UNIQUE INDEX \`products_slug_idx\` ON \`products\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`products_product_type_idx\` ON \`products\` (\`product_type_id\`);`)
  await db.run(sql`CREATE INDEX \`products_updated_at_idx\` ON \`products\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`products_created_at_idx\` ON \`products\` (\`created_at\`);`)
}
