import { chats, flashCard, flashCardSet, users } from './schema';

export type DrizzleChat = typeof chats.$inferSelect;
export type DrizzleUser = typeof users.$inferSelect;
export type DrizzleFlashCardSet = typeof flashCardSet.$inferSelect;
export type DrizzleFlashCard = typeof flashCard.$inferSelect;
