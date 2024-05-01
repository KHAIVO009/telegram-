module.exports = {
    jea: {
        name: 'ai',
        description: 'Interact with an AI to get responses to your questions.',
        author: 'Lance Ajiro',
        category: 'AI',
        usage: ['[question]']
    },
    execute: async function ({ bot, chatId, args }) {
        const question = args.join(' ');

        if (!question) {
            bot.sendMessage(chatId, 'Please provide a question.');
            return; 
        }

        try {
            const axios = require('axios');
            const response = await axios.get(`https://openai-rest-api.vercel.app/hercai?ask=${encodeURIComponent(question)}`);
            const aiResponse = response.data.reply;
            bot.sendMessage(chatId, aiResponse);
        } catch (error) {
            console.error('Error fetching AI response:', error);
            bot.sendMessage(chatId, 'Failed to get AI response. Please try again later.');
        }
    }
}; 