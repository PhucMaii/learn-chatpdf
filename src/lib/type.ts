import { DrizzleFlashCard, DrizzleFlashCardSet } from './db/drizzleType';
import { DrizzleChat } from './db/schema';

export enum API_URL {
  USER = '/api/user',
  CHAT = '/api/chat',
  USER_CHATS = '/api/user/chats',
  USER_SUBSCRIPTIONS = '/api/user/subscriptions',
  STRIPE = '/api/stripe',
  DELETE_CHAT = '/api/remove-chat',
}

export type SubscriptionType = {
  isPro: boolean;
  isTrial: boolean;
  isAbleToAddMoreChats: boolean;
};

export enum SUBSCRIPTION_TYPE {
  PRO = 'Pro',
  TRIAL = 'Trial',
  FREE = 'Free',
}

export interface IFlashCardSet extends DrizzleFlashCardSet {
  flashCards: DrizzleFlashCard[];
  chat: DrizzleChat;
}
