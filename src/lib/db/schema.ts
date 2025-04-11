import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const userSystemEnums = pgEnum('user_system_enum', ['system', 'user']);
export const userStatusEnums = pgEnum('user_status_enum', [
  'Pro',
  'Trial',
  'Free',
  'Guest',
]);

// export const mediaTypeEnums = pgEnum('media_type_enum', [
//   'text',
//   'pdf',
//   'doc',
//   'ppt',
//   'url',
// ]);

export const project = pgTable('project', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  userId: varchar('user_id', { length: 256 }),
  guestId: varchar('guest_id', { length: 256 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  lastOpenedAt: timestamp('last_opened_at').notNull().defaultNow(),
  isDeleted: integer('is_deleted').default(0),
});

export const medias = pgTable('medias', {
  id: serial('id').primaryKey(),
  url: text('url'), // Users can upload either url or file
  fileKey: text('file_key'),
  fileName: text('file_name'),
  type: varchar('type', { length: 256 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  userId: varchar('user_id', { length: 256 }),
  guestId: varchar('guest_id', { length: 256 }),
  projectId: integer('project_id')
    .references(() => project.id, { onDelete: 'cascade' })
    .notNull(),
})

export const guests = pgTable('guests', {
  id: varchar('id', { length: 256 }).primaryKey(),
  guestSessionId: varchar('guest_session_id', { length: 256 }),
  guestSessionSignature: varchar('guest_session_signature', {
    length: 256,
  }),
});

export const users = pgTable('users', {
  id: varchar('id', { length: 256 }).primaryKey(),
  email: varchar('email', { length: 256 }).unique(),
  firstName: varchar('first_name', { length: 256 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  status: userStatusEnums('status').notNull(),
  trialEnd: timestamp('trial_end'),
  guestSessionId: varchar('guest_session_id', { length: 256 }),
  guestSessionSignature: varchar('guest_session_signature', {
    length: 256,
  }),
});
export type DrizzleUser = typeof users.$inferSelect;

// All the fields related to file upload should be removed soon
export const chats = pgTable('chats', {
  id: serial('id').primaryKey(),
  pdfName: text('pdf_name'),
  pdfUrl: text('pdf_url'),
  webUrl: text('web_url'),
  fileType: text('file_type'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  userId: varchar('user_id', { length: 256 }),
  guestId: varchar('guest_id', { length: 256 }),
  fileKey: text('file_key'),
  title: text('title'),
  lastOpenedAt: timestamp('last_opened_at').defaultNow(),
  projectId: integer('project_id')
  .references(() => project.id, { onDelete: 'cascade' }),
});

export type DrizzleChat = typeof chats.$inferSelect;

export const flashCardSet = pgTable('flash_card_set', {
  id: serial('id').primaryKey(),
  chatId: integer('chat_id')
    .references(() => chats.id, { onDelete: 'cascade' }),  // This should be removed soon
  title: text('title').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  userId: varchar('user_id', { length: 256 }),
  guestId: varchar('guest_id', { length: 256 }),
  projectId: integer('project_id')
    .references(() => project.id, { onDelete: 'cascade' }),
});

export const flashCard = pgTable('flash_card', {
  id: serial('id').primaryKey(),
  chatId: integer('chat_id')
    .references(() => chats.id, { onDelete: 'cascade' }), // This should be removed soon
  userId: varchar('user_id', { length: 256 }),
  guestId: varchar('guest_id', { length: 256 }),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  flashCardSetId: integer('flash_card_set_id')
    .references(() => flashCardSet.id, { onDelete: 'cascade' })
    .notNull(),
  isKnown: integer('is_known').default(0),
});

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  chatId: integer('chat_id')
    .references(() => chats.id, { onDelete: 'cascade' })
    .notNull(),
  content: text('text').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  role: userSystemEnums('role').notNull(),
});

export const userSubscriptions = pgTable('user_subscriptions', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 256 }).notNull().unique(),
  stripeCustomerId: varchar('stripe_customer_id', { length: 256 })
    .notNull()
    .unique(),
  stripeSubscriptionId: varchar('stripe_subscription_id', {
    length: 256,
  }).unique(),
  stripePriceId: varchar('stripe_price_id', { length: 256 }).notNull(),
  stripeCurrentPeriodEnd: timestamp('stripe_current_period_end'),
  stripePromotionCode: varchar('stripe_promotion_code', { length: 256 }),
});

export const contacts = pgTable('contacts', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 256 }),
  name: varchar('name', { length: 256 }).notNull(),
  email: varchar('email', { length: 256 }).notNull(),
  message: varchar('message', { length: 256 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const discountCodes = pgTable('discount_codes', {
  id: varchar('id', { length: 256 }).primaryKey(),
  code: varchar('code', { length: 256 }).notNull().unique(),
  value: integer('value').notNull(),
  type: varchar('type', { length: 256 }).notNull(),
  quantity: integer('quantity').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
