// index.ts
import TelegramBot, { InlineKeyboardButton } from 'node-telegram-bot-api';
import register from './register';
import { Database } from './db';
import startcommand from './startcommand';
import helpCommand from './helpCommand';

const token: string = '6428201769:AAHwzknSjbYJOgSvIr1-undE-PNkkEgFGTk';
const bot: TelegramBot = new TelegramBot(token, { polling: true });
const chatStates: Map<number, string> = new Map();

// Connect to MongoDB
const uri: string = 'mongodb://mongoadmin:bdung@localhost:27018/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false';
let db: Database = new Database(uri);

(async () => {
    await db.connect();
    if (!db.isConnected()) {
        console.error('Could not connect to database');
        return;
    }
    const registeredUsers = new Set();
    await startcommand(bot, chatStates, db);
    await helpCommand(bot, chatStates, db);
    await register(bot, chatStates,db);
})();

