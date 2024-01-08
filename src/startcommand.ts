// startCommand.ts
import TelegramBot from 'node-telegram-bot-api';
import User from './models/User';
import { Database } from './db';
import { StateHandler, stateHandler } from './StateHandler';

export default (bot: TelegramBot, chatStates: Map<number, string>, db: Database) => {
    // Start command. checks if the user is registered or not then sends the most appropriate message
    bot.onText(/\/start/, async (msg: TelegramBot.Message) => {
        //register the user if not registered
        const user = await db.getUser(msg.chat.id);
        if (!user) {
            db.saveUser(new User({ chatId: msg.chat.id, username: msg.chat.username }));
        } else {
            db.getUser(msg.chat.id).then((user) => {
                if (user) {
                    bot.sendMessage(msg.chat.id, `Welcome back ${user.username}`);
                }
            });
        }
    });
};