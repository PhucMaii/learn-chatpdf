import {integer, pgEnum, pgTable, serial, text, timestamp, varchar} from 'drizzle-orm/pg-core';

export const userSystemEnums = pgEnum('user_system_enum', ['system', 'user']);
export const userStatusEnums = pgEnum('user_status_enum', ['pro', 'trial', 'free']);

export const users = pgTable('users', {
    id: varchar('id', {length: 256}).primaryKey(),
    email: varchar('email', {length: 256}).notNull().unique(),
    firstName: varchar('first_name', {length: 256}).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    status: userStatusEnums('status').notNull(),
    trialEnd: timestamp('trial_end').notNull(), 
});
export type DrizzleUser = typeof users.$inferSelect;

export const chats = pgTable('chats', {
    id: serial('id').primaryKey(),
    pdfName: text('pdf_name').notNull(),
    pdfUrl: text('pdf_url').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    userId: varchar('user_id', {length: 256}).notNull(),
    fileKey: text('file_key').notNull(),
    lastOpenedAt: timestamp('last_opened_at').defaultNow(),
});

export type DrizzleChat = typeof chats.$inferSelect;


export const messages = pgTable('messages', {
    id: serial('id').primaryKey(),
    chatId: integer('chat_id').references(() => chats.id).notNull(),
    content: text('text').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    role: userSystemEnums('role').notNull(),
});

export const userSubscriptions = pgTable('user_subscriptions', {
    id: serial('id').primaryKey(),
    userId: varchar('user_id', {length: 256}).notNull().unique(),
    stripeCustomerId: varchar('stripe_customer_id', {length: 256}).notNull().unique(),
    stripeSubscriptionId: varchar('stripe_subscription_id', {length: 256}).unique(),
    stripePriceId: varchar('stripe_price_id', {length: 256}).notNull(),
    stripeCurrentPeriodEnd: timestamp('stripe_current_period_end'),
});