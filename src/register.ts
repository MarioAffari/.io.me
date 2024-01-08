import TelegramBot from 'node-telegram-bot-api';
import User from './models/User';
import { Database } from './db';
import { StateHandler, stateHandler } from './StateHandler';

const passwordMap: Map<number, string> = new Map();

const states: { [key: string]: StateHandler } = {
    AWAITING_PASSWORD: (msg, bot, chatStates, db) => {
        const chatId = msg.chat.id;
        const password = msg.text as string; // Type assertion to treat password as string
        passwordMap.set(chatId, password); // Store the original password in the passwordMap
        stateHandler(msg, bot, chatStates, db, 'CONFIRMING_PASSWORD', 'Please confirm your password.');
    },
    CONFIRMING_PASSWORD: async (msg, bot, chatStates, db) => {
        const chatId = msg.chat.id;
        const confirmedPassword = msg.text; // Assuming the confirmed password is the text of the message

        // Get the original password from the passwordMap
        const originalPassword = passwordMap.get(chatId);

        if (originalPassword !== confirmedPassword) {
            bot.sendMessage(chatId, 'The passwords do not match. Please try again.');
            chatStates.set(chatId, 'AWAITING_PASSWORD');
        } else {
            const username = msg.chat.username;
            const user = new User({ chatId, password: confirmedPassword, username });

            // Save the user using the db class
            await db.saveUser(user);
            bot.sendMessage(chatId, 'You have been registered successfully!');
            chatStates.delete(chatId);
            passwordMap.delete(chatId);
        }
    }
};

export default (bot: TelegramBot, chatStates: Map<number, string>, db: Database) => {

    // Register command
    bot.onText(/\/register/, (msg: TelegramBot.Message) => {
        const chatId = msg.chat.id;
        bot.sendMessage(chatId, 'Please enter a password.');
        chatStates.set(chatId, 'AWAITING_PASSWORD');
    });
    // Message handler
    bot.on('message', (msg: TelegramBot.Message) => {
        const chatId = msg.chat.id;
        const state = chatStates.get(chatId);
        if (state !== undefined) {
            const stateHandler = states[state];
            if (stateHandler) {
                stateHandler(msg, bot, chatStates, db, '', ''); // Pass the additional arguments to the stateHandler function
            }
        }
    });
};