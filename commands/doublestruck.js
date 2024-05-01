const axios = require('axios');

module.exports = {
    jea: {
        name: 'doublestruck',
        description: 'Convert text to doublestruck style.',
        author: 'Shinpei',
        usage: '[text]',
        category: 'Text'
    },
    execute({ args, bot, chatId }) {
        const text = args.join(' ');

        if (!text) {
            bot.sendMessage(chatId, 'Please provide some text.');
            return;
        }

        const apiUrl = `https://api.popcat.xyz/doublestruck?text=${encodeURIComponent(text)}`;

        axios.get(apiUrl)
            .then(response => {
                const styledText = response.data.text;
                bot.sendMessage(chatId, styledText);
            })
            .catch(error => {
                console.error('Error fetching doublestruck text:', error);
                bot.sendMessage(chatId, 'An error occurred while converting text to doublestruck style.');
            });
    }
};
