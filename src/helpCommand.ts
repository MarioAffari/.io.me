// startCommand.ts
import TelegramBot from 'node-telegram-bot-api';
import { Database } from './db';
import { Commands } from './Costants';

export default (bot: TelegramBot, chatStates: Map<number, string>, db: Database) => {
    // Start command. checks if the user is registered or not then sends the most appropriate message
    bot.onText(/\/help/, async (msg: TelegramBot.Message) => {
        //querry the database for the user
        const user = await db.getUser(msg.chat.id);
        if (!user) {
            bot.sendMessage(msg.chat.id, `please /start first`);
            return;
        }
        //send the commands



        const userCommands = Object.keys(Commands)
            .filter(command => Commands[command].includes(user.role))
            .join(', ');

        bot.sendMessage(msg.chat.id, `${userCommands} to see the list of commands`);

    });
};