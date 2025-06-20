import { chats, discountCodes, flashCard, flashCardSet, medias, studyGuide, users, essays, project, quizQuestion, quiz } from './schema';

export type DrizzleChat = typeof chats.$inferSelect;
export type DrizzleUser = typeof users.$inferSelect;
export type DrizzleFlashCardSet = typeof flashCardSet.$inferSelect;
export type DrizzleFlashCard = typeof flashCard.$inferSelect;
export type DrizzleDiscountCode = typeof discountCodes.$inferInsert;
export type DrizzleMedia = typeof medias.$inferInsert;
export type DrizzleSubscription = typeof users.$inferSelect;
export type DrizzleStudyGuide = typeof studyGuide.$inferSelect;
export type DrizzleEssay = typeof essays.$inferSelect;
export type DrizzleProject = typeof project.$inferSelect;
export type DrizzleQuizQuestion = typeof quizQuestion.$inferSelect;
export type DrizzleQuiz = typeof quiz.$inferSelect;