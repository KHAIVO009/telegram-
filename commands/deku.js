module.exports = {
    jea: {
        name: 'deku',
        description: 'Talk to Deku AI',
        author: 'Deku',
        usage: ['[ask]'],
        category: 'Chat'
    },
    execute: async function ({ bot, chatId, args }) {
        const axios = require("axios");
        try {
            let prompt = args.join(" ");
            if (!prompt) return bot.sendMessage(chatId, "Missing prompt!");
            const res = (await axios.get("https://deku-rest-api.replit.app/deku?prompt=" + prompt)).data;
            return bot.sendMessage(chatId, res.data);
        } catch (error) {
            return bot.sendMessage(chatId, error.message);
        }
    }
};
