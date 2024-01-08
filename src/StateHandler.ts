// stateHandler.ts
import TelegramBot from 'node-telegram-bot-api';
import { Database } from './db'; // Make sure to import the Database type

export type StateHandler = (msg: TelegramBot.Message, bot: TelegramBot, chatStates: Map<number, string>, db: Database, nextState: string, message: string) => void;

export const stateHandler: StateHandler = (msg, bot, chatStates, db, nextState, message) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, message);
  if (nextState) {
    chatStates.set(chatId, nextState);
  }
};