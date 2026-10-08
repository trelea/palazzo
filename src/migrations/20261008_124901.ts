import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`product_types\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label_ro\` text NOT NULL,
  	\`label_ru\` text NOT NULL,
  	\`label_en\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`product_types_updated_at_idx\` ON \`product_types\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`product_types_created_at_idx\` ON \`product_types\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`product_tags\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label_ro\` text NOT NULL,
  	\`label_ru\` text NOT NULL,
  	\`label_en\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`product_tags_updated_at_idx\` ON \`product_tags\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`product_tags_created_at_idx\` ON \`product_tags\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`products_product_images\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_product_images_order_idx\` ON \`products_product_images\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_product_images_parent_id_idx\` ON \`products_product_images\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`products_product_images_image_idx\` ON \`products_product_images\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`products\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`slug\` text NOT NULL,
  	\`product_type_id\` integer NOT NULL,
  	\`product_name_en\` text NOT NULL,
  	\`product_name_ro\` text NOT NULL,
  	\`product_name_ru\` text NOT NULL,
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
  await db.run(sql`CREATE UNIQUE INDEX \`products_slug_idx\` ON \`products\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`products_product_type_idx\` ON \`products\` (\`product_type_id\`);`)
  await db.run(sql`CREATE INDEX \`products_updated_at_idx\` ON \`products\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`products_created_at_idx\` ON \`products\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`products_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`product_tags_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`product_tags_id\`) REFERENCES \`product_tags\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_rels_order_idx\` ON \`products_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`products_rels_parent_idx\` ON \`products_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`products_rels_path_idx\` ON \`products_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`products_rels_product_tags_id_idx\` ON \`products_rels\` (\`product_tags_id\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`product_types_id\` integer REFERENCES product_types(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`product_tags_id\` integer REFERENCES product_tags(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`products_id\` integer REFERENCES products(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_product_types_id_idx\` ON \`payload_locked_documents_rels\` (\`product_types_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_product_tags_id_idx\` ON \`payload_locked_documents_rels\` (\`product_tags_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_products_id_idx\` ON \`payload_locked_documents_rels\` (\`products_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`product_types\`;`)
  await db.run(sql`DROP TABLE \`product_tags\`;`)
  await db.run(sql`DROP TABLE \`products_product_images\`;`)
  await db.run(sql`DROP TABLE \`products\`;`)
  await db.run(sql`DROP TABLE \`products_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	\`news_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`news_id\`) REFERENCES \`news\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "media_id", "news_id") SELECT "id", "order", "parent_id", "path", "users_id", "media_id", "news_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_news_id_idx\` ON \`payload_locked_documents_rels\` (\`news_id\`);`)
}
