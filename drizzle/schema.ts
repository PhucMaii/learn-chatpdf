import { pgTable, foreignKey, serial, text, timestamp, varchar, integer, unique, pgEnum } from "drizzle-orm/pg-core"

export const mediaTypeEnum = pgEnum("media_type_enum", ['text', 'pdf', 'doc', 'ppt', 'url'])
export const userStatusEnum = pgEnum("user_status_enum", ['pro', 'trial', 'free', 'Pro', 'Trial', 'Free', 'Guest', 'Elite', 'Starter'])
export const userSystemEnum = pgEnum("user_system_enum", ['system', 'user'])



export const chats = pgTable("chats", {
	id: serial("id").primaryKey().notNull(),
	pdfName: text("pdf_name"),
	pdfUrl: text("pdf_url"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	userId: varchar("user_id", { length: 256 }),
	fileKey: text("file_key"),
	lastOpenedAt: timestamp("last_opened_at", { mode: 'string' }).defaultNow(),
	title: text("title"),
	webUrl: text("web_url"),
	fileType: text("file_type"),
	guestId: varchar("guest_id", { length: 256 }),
	projectId: integer("project_id"),
},
(table) => {
	return {
		chatsProjectIdProjectIdFk: foreignKey({
			columns: [table.projectId],
			foreignColumns: [project.id],
			name: "chats_project_id_project_id_fk"
		}).onDelete("cascade"),
	}
});

export const messages = pgTable("messages", {
	id: serial("id").primaryKey().notNull(),
	chatId: integer("chat_id").notNull(),
	text: text("text").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	role: userSystemEnum("role").notNull(),
},
(table) => {
	return {
		messagesChatIdChatsIdFk: foreignKey({
			columns: [table.chatId],
			foreignColumns: [chats.id],
			name: "messages_chat_id_chats_id_fk"
		}).onDelete("cascade"),
	}
});

export const userSubscriptions = pgTable("user_subscriptions", {
	id: serial("id").primaryKey().notNull(),
	userId: varchar("user_id", { length: 256 }).notNull(),
	stripeCustomerId: varchar("stripe_customer_id", { length: 256 }).notNull(),
	stripeSubscriptionId: varchar("stripe_subscription_id", { length: 256 }),
	stripePriceId: varchar("stripe_price_id", { length: 256 }).notNull(),
	stripeCurrentPeriodEnd: timestamp("stripe_current_period_end", { mode: 'string' }),
	stripePromotionCode: varchar("stripe_promotion_code", { length: 256 }),
},
(table) => {
	return {
		userSubscriptionsUserIdUnique: unique("user_subscriptions_user_id_unique").on(table.userId),
		userSubscriptionsStripeCustomerIdUnique: unique("user_subscriptions_stripe_customer_id_unique").on(table.stripeCustomerId),
		userSubscriptionsStripeSubscriptionIdUnique: unique("user_subscriptions_stripe_subscription_id_unique").on(table.stripeSubscriptionId),
	}
});

export const users = pgTable("users", {
	id: varchar("id", { length: 256 }).primaryKey().notNull(),
	email: varchar("email", { length: 256 }),
	firstName: varchar("first_name", { length: 256 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	status: userStatusEnum("status").notNull(),
	trialEnd: timestamp("trial_end", { mode: 'string' }),
	guestSessionId: varchar("guest_session_id", { length: 256 }),
	guestSessionSignature: varchar("guest_session_signature", { length: 256 }),
},
(table) => {
	return {
		usersEmailUnique: unique("users_email_unique").on(table.email),
	}
});

export const discountCodes = pgTable("discount_codes", {
	id: varchar("id", { length: 256 }).primaryKey().notNull(),
	code: varchar("code", { length: 256 }).notNull(),
	quantity: integer("quantity").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	type: varchar("type", { length: 256 }).notNull(),
	value: integer("value").notNull(),
},
(table) => {
	return {
		discountCodesCodeUnique: unique("discount_codes_code_unique").on(table.code),
	}
});

export const contacts = pgTable("contacts", {
	id: serial("id").primaryKey().notNull(),
	userId: varchar("user_id", { length: 256 }),
	name: varchar("name", { length: 256 }).notNull(),
	email: varchar("email", { length: 256 }).notNull(),
	message: varchar("message", { length: 256 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const project = pgTable("project", {
	id: serial("id").primaryKey().notNull(),
	name: text("name").notNull(),
	userId: varchar("user_id", { length: 256 }),
	guestId: varchar("guest_id", { length: 256 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	lastOpenedAt: timestamp("last_opened_at", { mode: 'string' }).defaultNow().notNull(),
	isDeleted: integer("is_deleted").default(0),
});

export const flashCard = pgTable("flash_card", {
	id: serial("id").primaryKey().notNull(),
	chatId: integer("chat_id"),
	userId: varchar("user_id", { length: 256 }),
	question: text("question").notNull(),
	answer: text("answer").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	flashCardSetId: integer("flash_card_set_id").notNull(),
	isKnown: integer("is_known").default(0),
	guestId: varchar("guest_id", { length: 256 }),
},
(table) => {
	return {
		flashCardChatIdChatsIdFk: foreignKey({
			columns: [table.chatId],
			foreignColumns: [chats.id],
			name: "flash_card_chat_id_chats_id_fk"
		}).onDelete("cascade"),
		flashCardFlashCardSetIdFlashCardSetIdFk: foreignKey({
			columns: [table.flashCardSetId],
			foreignColumns: [flashCardSet.id],
			name: "flash_card_flash_card_set_id_flash_card_set_id_fk"
		}).onDelete("cascade"),
	}
});

export const guests = pgTable("guests", {
	guestSessionId: varchar("guest_session_id", { length: 256 }),
	guestSessionSignature: varchar("guest_session_signature", { length: 256 }),
	id: varchar("id", { length: 256 }).primaryKey().notNull(),
});

export const flashCardSet = pgTable("flash_card_set", {
	id: serial("id").primaryKey().notNull(),
	chatId: integer("chat_id"),
	title: text("title").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	userId: varchar("user_id", { length: 256 }),
	guestId: varchar("guest_id", { length: 256 }),
	projectId: integer("project_id"),
},
(table) => {
	return {
		flashCardSetChatIdChatsIdFk: foreignKey({
			columns: [table.chatId],
			foreignColumns: [chats.id],
			name: "flash_card_set_chat_id_chats_id_fk"
		}).onDelete("cascade"),
		flashCardSetProjectIdProjectIdFk: foreignKey({
			columns: [table.projectId],
			foreignColumns: [project.id],
			name: "flash_card_set_project_id_project_id_fk"
		}).onDelete("cascade"),
	}
});

export const medias = pgTable("medias", {
	id: serial("id").primaryKey().notNull(),
	url: text("url"),
	fileKey: text("file_key"),
	fileName: text("file_name"),
	type: varchar("type", { length: 256 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	userId: varchar("user_id", { length: 256 }),
	guestId: varchar("guest_id", { length: 256 }),
	projectId: integer("project_id").notNull(),
},
(table) => {
	return {
		mediasProjectIdProjectIdFk: foreignKey({
			columns: [table.projectId],
			foreignColumns: [project.id],
			name: "medias_project_id_project_id_fk"
		}).onDelete("cascade"),
	}
});

export const studyGuide = pgTable("study_guide", {
	id: serial("id").primaryKey().notNull(),
	title: text("title").notNull(),
	content: text("content").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	userId: varchar("user_id", { length: 256 }),
	guestId: varchar("guest_id", { length: 256 }),
	projectId: integer("project_id").notNull(),
},
(table) => {
	return {
		studyGuideProjectIdProjectIdFk: foreignKey({
			columns: [table.projectId],
			foreignColumns: [project.id],
			name: "study_guide_project_id_project_id_fk"
		}).onDelete("cascade"),
	}
});

export const essays = pgTable("essays", {
	id: serial("id").primaryKey().notNull(),
	title: text("title").notNull(),
	content: text("content").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	userId: varchar("user_id", { length: 256 }),
	guestId: varchar("guest_id", { length: 256 }),
	projectId: integer("project_id"),
	aiCheckScore: integer("ai_check_score").default(0),
},
(table) => {
	return {
		essaysProjectIdProjectIdFk: foreignKey({
			columns: [table.projectId],
			foreignColumns: [project.id],
			name: "essays_project_id_project_id_fk"
		}).onDelete("cascade"),
	}
});