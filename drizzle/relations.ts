import { relations } from "drizzle-orm/relations";
import { project, chats, messages, flashCard, flashCardSet, medias, studyGuide, essays } from "./schema";

export const chatsRelations = relations(chats, ({one, many}) => ({
	project: one(project, {
		fields: [chats.projectId],
		references: [project.id]
	}),
	messages: many(messages),
	flashCards: many(flashCard),
	flashCardSets: many(flashCardSet),
}));

export const projectRelations = relations(project, ({many}) => ({
	chats: many(chats),
	flashCardSets: many(flashCardSet),
	medias: many(medias),
	studyGuides: many(studyGuide),
	essays: many(essays),
}));

export const messagesRelations = relations(messages, ({one}) => ({
	chat: one(chats, {
		fields: [messages.chatId],
		references: [chats.id]
	}),
}));

export const flashCardRelations = relations(flashCard, ({one}) => ({
	chat: one(chats, {
		fields: [flashCard.chatId],
		references: [chats.id]
	}),
	flashCardSet: one(flashCardSet, {
		fields: [flashCard.flashCardSetId],
		references: [flashCardSet.id]
	}),
}));

export const flashCardSetRelations = relations(flashCardSet, ({one, many}) => ({
	flashCards: many(flashCard),
	chat: one(chats, {
		fields: [flashCardSet.chatId],
		references: [chats.id]
	}),
	project: one(project, {
		fields: [flashCardSet.projectId],
		references: [project.id]
	}),
}));

export const mediasRelations = relations(medias, ({one}) => ({
	project: one(project, {
		fields: [medias.projectId],
		references: [project.id]
	}),
}));

export const studyGuideRelations = relations(studyGuide, ({one}) => ({
	project: one(project, {
		fields: [studyGuide.projectId],
		references: [project.id]
	}),
}));

export const essaysRelations = relations(essays, ({one}) => ({
	project: one(project, {
		fields: [essays.projectId],
		references: [project.id]
	}),
}));