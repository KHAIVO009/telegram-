// chat.js

const axios = require('axios');

module.exports = {
    jea: {
        name: 'chat',
        description: 'Simulate a chatbot response based on the given message.',
        author: 'Shinepi',
        usage: '[message]',
        category: 'Fun'
    },
    execute({ bot, chatId, args }) {
        const message = args.join('+');
        const owner = encodeURIComponent('Lance Ajiro'); // Encode owner name
        const botname = encodeURIComponent('Jea'); // Encode bot name

        if (!message) {
            bot.sendMessage(chatId, 'Please provide a message for the chatbot.');
            return;
        }

        const apiUrl = `https://api.popcat.xyz/chatbot?msg=${message}&owner=${owner}&botname=${botname}`;

        // Fetch response from the chatbot API
        axios.get(apiUrl)
            .then(response => {
                const botResponse = response.data.response;
                bot.sendMessage(chatId, botResponse);
            })
            .catch(error => {
                console.error('Error fetching chatbot response:', error);
                bot.sendMessage(chatId, 'An error occurred while fetching the chatbot response.');
            });
    }
};
