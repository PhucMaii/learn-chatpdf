import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  index,
} from 'drizzle-orm/pg-core';

export const userSystemEnums = pgEnum('user_system_enum', ['system', 'user']);
export const userStatusEnums = pgEnum("user_status_enum", ['pro', 'trial', 'free', 'Pro', 'Trial', 'Free', 'Guest', 'Elite', 'Starter'])
// export const mediaTypeEnums = pgEnum('media_type_enum', [
//   'text',
//   'pdf',
//   'doc',
//   'ppt',
//   'url',
// ]);

export const project = pgTable(
  'project',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    userId: varchar('user_id', { length: 256 }),
    guestId: varchar('guest_id', { length: 256 }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    lastOpenedAt: timestamp('last_opened_at').notNull().defaultNow(),
    isDeleted: integer('is_deleted').default(0),
  },
  (table) => ({
    userIdIdx: index('project_user_id_idx').on(table.userId),
    guestIdIdx: index('project_guest_id_idx').on(table.guestId),
    isDeletedIdx: index('project_is_deleted_idx').on(table.isDeleted),
    createdAtIdx: index('project_created_at_idx').on(table.createdAt),
  }),
);

export const studyGuide = pgTable(
  'study_guide',
  {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    content: text('content').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    userId: varchar('user_id', { length: 256 }),
    guestId: varchar('guest_id', { length: 256 }),
    projectId: integer('project_id')
      .references(() => project.id, { onDelete: 'cascade' })
      .notNull(),
  },
  (table) => ({
    userIdIdx: index('study_guide_user_id_idx').on(table.userId),
    guestIdIdx: index('study_guide_guest_id_idx').on(table.guestId),
    projectIdIdx: index('study_guide_project_id_idx').on(table.projectId),
    createdAtIdx: index('study_guide_created_at_idx').on(table.createdAt),
  }),
);

export const medias = pgTable(
  'medias',
  {
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
  },
  (table) => ({
    userIdIdx: index('medias_user_id_idx').on(table.userId),
    guestIdIdx: index('medias_guest_id_idx').on(table.guestId),
    projectIdIdx: index('medias_project_id_idx').on(table.projectId),
    typeIdx: index('medias_type_idx').on(table.type),
    createdAtIdx: index('medias_created_at_idx').on(table.createdAt),
  }),
);

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
export const chats = pgTable(
  'chats',
  {
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
    projectId: integer('project_id').references(() => project.id, {
      onDelete: 'cascade',
    }),
  },
  (table) => ({
    userIdIdx: index('chats_user_id_idx').on(table.userId),
    guestIdIdx: index('chats_guest_id_idx').on(table.guestId),
    projectIdIdx: index('chats_project_id_idx').on(table.projectId),
    fileTypeIdx: index('chats_file_type_idx').on(table.fileType),
    createdAtIdx: index('chats_created_at_idx').on(table.createdAt),
    lastOpenedAtIdx: index('chats_last_opened_at_idx').on(table.lastOpenedAt),
  }),
);

export const essays = pgTable(
  'essays',
  {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    content: text('content').notNull(),
    aiCheckScore: integer('ai_check_score').default(0),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    userId: varchar('user_id', { length: 256 }),
    guestId: varchar('guest_id', { length: 256 }),
    projectId: integer('project_id').references(() => project.id, {
      onDelete: 'cascade',
    }),
  },
  (table) => ({
    userIdIdx: index('essays_user_id_idx').on(table.userId),
    guestIdIdx: index('essays_guest_id_idx').on(table.guestId),
    projectIdIdx: index('essays_project_id_idx').on(table.projectId),
    aiCheckScoreIdx: index('essays_ai_check_score_idx').on(table.aiCheckScore),
    createdAtIdx: index('essays_created_at_idx').on(table.createdAt),
  }),
);

export type DrizzleChat = typeof chats.$inferSelect;

export const flashCardSet = pgTable(
  'flash_card_set',
  {
    id: serial('id').primaryKey(),
    chatId: integer('chat_id').references(() => chats.id, {
      onDelete: 'cascade',
    }), // This should be removed soon
    title: text('title').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    userId: varchar('user_id', { length: 256 }),
    guestId: varchar('guest_id', { length: 256 }),
    projectId: integer('project_id').references(() => project.id, {
      onDelete: 'cascade',
    }),
  },
  (table) => ({
    userIdIdx: index('flash_card_set_user_id_idx').on(table.userId),
    guestIdIdx: index('flash_card_set_guest_id_idx').on(table.guestId),
    projectIdIdx: index('flash_card_set_project_id_idx').on(table.projectId),
    chatIdIdx: index('flash_card_set_chat_id_idx').on(table.chatId),
    createdAtIdx: index('flash_card_set_created_at_idx').on(table.createdAt),
  }),
);

export const flashCard = pgTable(
  'flash_card',
  {
    id: serial('id').primaryKey(),
    chatId: integer('chat_id').references(() => chats.id, {
      onDelete: 'cascade',
    }), // This should be removed soon
    userId: varchar('user_id', { length: 256 }),
    guestId: varchar('guest_id', { length: 256 }),
    question: text('question').notNull(),
    answer: text('answer').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    flashCardSetId: integer('flash_card_set_id')
      .references(() => flashCardSet.id, { onDelete: 'cascade' })
      .notNull(),
    isKnown: integer('is_known').default(0),
  },
  (table) => ({
    userIdIdx: index('flash_card_user_id_idx').on(table.userId),
    guestIdIdx: index('flash_card_guest_id_idx').on(table.guestId),
    chatIdIdx: index('flash_card_chat_id_idx').on(table.chatId),
    flashCardSetIdIdx: index('flash_card_set_id_idx').on(table.flashCardSetId),
    isKnownIdx: index('flash_card_is_known_idx').on(table.isKnown),
    createdAtIdx: index('flash_card_created_at_idx').on(table.createdAt),
  }),
);

export const messages = pgTable(
  'messages',
  {
    id: serial('id').primaryKey(),
    chatId: integer('chat_id')
      .references(() => chats.id, { onDelete: 'cascade' })
      .notNull(),
    content: text('text').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    role: userSystemEnums('role').notNull(),
  },
  (table) => ({
    chatIdIdx: index('messages_chat_id_idx').on(table.chatId),
    roleIdx: index('messages_role_idx').on(table.role),
    createdAtIdx: index('messages_created_at_idx').on(table.createdAt),
  }),
);

export const userSubscriptions = pgTable(
  'user_subscriptions',
  {
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
  },
  (table) => ({
    stripePriceIdIdx: index('user_subscriptions_stripe_price_id_idx').on(
      table.stripePriceId,
    ),
    stripeCurrentPeriodEndIdx: index(
      'user_subscriptions_stripe_current_period_end_idx',
    ).on(table.stripeCurrentPeriodEnd),
    userIdIdx: index('user_subscriptions_user_id_idx').on(table.userId),
  }),
);

export const contacts = pgTable(
  'contacts',
  {
    id: serial('id').primaryKey(),
    userId: varchar('user_id', { length: 256 }),
    name: varchar('name', { length: 256 }).notNull(),
    email: varchar('email', { length: 256 }).notNull(),
    message: varchar('message', { length: 256 }).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index('contacts_user_id_idx').on(table.userId),
    emailIdx: index('contacts_email_idx').on(table.email),
    createdAtIdx: index('contacts_created_at_idx').on(table.createdAt),
  }),
);

export const discountCodes = pgTable(
  'discount_codes',
  {
    id: varchar('id', { length: 256 }).primaryKey(),
    code: varchar('code', { length: 256 }).notNull().unique(),
    value: integer('value').notNull(),
    type: varchar('type', { length: 256 }).notNull(),
    quantity: integer('quantity').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => ({
    typeIdx: index('discount_codes_type_idx').on(table.type),
    valueIdx: index('discount_codes_value_idx').on(table.value),
    createdAtIdx: index('discount_codes_created_at_idx').on(table.createdAt),
  }),
);

export const quiz = pgTable(
  'quiz',
  {
    id: serial('id').primaryKey(),
    projectId: integer('project_id').references(() => project.id, { 
      onDelete: 'cascade',
    }),
    title: text('title').notNull(),
    attempts: integer('attempts').default(0),
    highestScore: integer('highest_score').default(0),
    userId: varchar('user_id', { length: 256 }),
    guestId: varchar('guest_id', { length: 256 }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index('quizzes_user_id_idx').on(table.userId),
    guestIdIdx: index('quizzes_guest_id_idx').on(table.guestId),
    projectIdIdx: index('quizzes_project_id_idx').on(table.projectId),
    createdAtIdx: index('quizzes_created_at_idx').on(table.createdAt),
  }),
);

export const quizQuestion = pgTable(
  'quiz_question',
  {
    id: serial('id').primaryKey(),
    quizId: integer('quiz_id').references(() => quiz.id, {
      onDelete: 'cascade',
    }),
    index: integer('index'),
    question: text('question').notNull(),
    optionA: text('option_a').notNull(),
    optionB: text('option_b').notNull(),
    optionC: text('option_c').notNull(),
    optionD: text('option_d').notNull(),
    correctAnswer: text('correct_answer').notNull(),
    explanation: text('explanation').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => ({
    quizIdIdx: index('quiz_question_quiz_id_idx').on(table.quizId),
    createdAtIdx: index('quiz_question_created_at_idx').on(table.createdAt),
  }),
);

export const quizAttemptQuestion = pgTable(
  'quiz_attempt_question',
  {
    id: serial('id').primaryKey(),
    quizAttemptId: integer('quiz_attempt_id').references(() => quizAttempt.id, {
      onDelete: 'cascade',
    }), 
    questionId: integer('question_id').references(() => quizQuestion.id, {
      onDelete: 'cascade',
    }),
    isCorrect: integer('is_correct').default(0),
    isSkipped: integer('is_skipped').default(0),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },  
  (table) => ({
    quizAttemptIdIdx: index('quiz_attempt_question_quiz_attempt_id_idx').on(table.quizAttemptId),
    questionIdIdx: index('quiz_attempt_question_question_id_idx').on(table.questionId),
  }),
);

export const quizAttempt = pgTable(
  'quiz_attempt',
  {
    id: serial('id').primaryKey(),
    quizId: integer('quiz_id').references(() => quiz.id, {
      onDelete: 'cascade',
    }),
    projectId: integer('project_id').references(() => project.id, {
      onDelete: 'cascade',
    }),
    userId: varchar('user_id', { length: 256 }),
    guestId: varchar('guest_id', { length: 256 }),
    startedAt: timestamp('started_at'),
    endedAt: timestamp('ended_at'),
    score: integer('score'),
    totalQuestions: integer('total_questions'),
    correctAnswers: integer('correct_answers'),
    incorrectAnswers: integer('incorrect_answers'),
    skippedQuestions: integer('skipped_questions'),
    totalTime: integer('total_time'),
    quizDuration: integer('quiz_duration'),
  },
  (table) => ({
    userIdIdx: index('quiz_attempt_user_id_idx').on(table.userId),
    guestIdIdx: index('quiz_attempt_guest_id_idx').on(table.guestId),
    projectIdIdx: index('quiz_attempt_project_id_idx').on(table.projectId),
  }),
);

export const summary = pgTable(
  'summary',
  {
    id: serial('id').primaryKey(),
    projectId: integer('project_id').references(() => project.id, {
      onDelete: 'cascade',
    }),
    title: text('title').notNull(),
    text: text('text').notNull(),
    userId: varchar('user_id', { length: 256 }),
    guestId: varchar('guest_id', { length: 256 }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => ({
    projectIdIdx: index('summary_project_id_idx').on(table.projectId),
  }),
);