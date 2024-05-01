const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const { join } = require('path');
const cron = require('node-cron');
const ai = require('./jea/ai.js');

const botToken = '7133993574:AAFWOi4Zh2qnTZT67OaE55e7cNOGGEr_MDs';// Replace with your bot token 
const port = process.env.PORT || 8080;
const bot = new TelegramBot(botToken, { polling: true });


const commands = loadCommands('./commands');

cron.schedule('*/30 * * * * *', deleteCacheFiles);

bot.on('message', handleMessage);

function deleteCacheFiles() {
    const cacheFolder = './commands/cache/';

    fs.readdir(cacheFolder, (err, files) => {
        if (err) return console.error('Error reading cache directory:', err);

        files.forEach(file => {
            fs.unlink(join(cacheFolder, file), err => {
                if (err) console.error('Error deleting file:', err);
                else console.log('File deleted:', file);
            });
        });
    });
}

function loadCommands(commandsFolder) {
    const commandPath = join(__dirname, commandsFolder);
    const commands = {};

    fs.readdirSync(commandPath).forEach(file => {
        if (file.endsWith('.js')) {
            const script = require(join(commandPath, file));
            const jea = script.jea;

            if (!jea || !jea.name || !jea.description || !jea.author || !jea.category) {
                console.error(`Invalid command file: ${file}`);
                return;
            }

            commands[jea.name.toLowerCase()] = script;

            if (jea.aliases && Array.isArray(jea.aliases)) {
                jea.aliases.forEach(alias => {
                    commands[alias.toLowerCase()] = script;
                });
            }
        }
    });

    return commands;
}

async function handleMessage(msg) {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const messageText = msg.text;

    if (!messageText.startsWith('/')) {
        const aiResponse = await ai.getAIResponse(messageText);

        if (aiResponse) {
            bot.sendMessage(chatId, aiResponse);
        }
    } else {
        const [commandName, ...args] = messageText.slice(1).split(' ');

        const command = commands[commandName.toLowerCase()];

        if (command) {
            command.execute({ bot, chatId, userId, args, msg });
        } else {
            bot.sendMessage(chatId, 'Command not found.');
        }
    }
}
