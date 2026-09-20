import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
export const rooms=sqliteTable('rooms',{code:text('code').primaryKey(),state:text('state').notNull(),revision:integer('revision').notNull().default(0),expiresAt:integer('expires_at').notNull()},t=>[index('idx_rooms_expires_at').on(t.expiresAt)]);
export const rateLimits=sqliteTable('rate_limits',{key:text('key').primaryKey(),count:integer('count').notNull(),expiresAt:integer('expires_at').notNull()},t=>[index('idx_rate_limits_expires_at').on(t.expiresAt)]);
export const arcadeProfiles=sqliteTable('arcade_profiles',{userId:text('user_id').primaryKey(),data:text('data').notNull(),updatedAt:integer('updated_at').notNull()});
