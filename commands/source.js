const axios = require('axios');
const fs = require('fs');
const { join } = require('path');

module.exports = {
    jea: {
        name: 'source',
        description: 'Get the source code of a website.',
        author: 'Shinpei',
        usage: '[website URL]',
        category: 'Utility'
    },
    execute: function({ bot, chatId, args }) {
        const websiteURL = args[0];

        if (!websiteURL) {
            bot.sendMessage(chatId, 'Please provide a website URL.');
            return;
        }

        axios.get(websiteURL)
            .then(response => {
                const sourceCode = response.data;

                // Define cache folder path
                const cacheFolder = join(__dirname, 'cache');
                if (!fs.existsSync(cacheFolder)) {
                    fs.mkdirSync(cacheFolder);
                }

                // Define file path
                const filePath = join(cacheFolder, 'source_code.txt');

                // Save source code to file
                fs.writeFileSync(filePath, sourceCode);

                // Send the document
                bot.sendDocument(chatId, fs.createReadStream(filePath))
                    .then(() => {
                        // Delete the cached file after sending
                        fs.unlinkSync(filePath);
                    })
                    .catch(error => {
                        console.error('Error sending document:', error);
                        bot.sendMessage(chatId, 'An error occurred while sending the document.');
                    });
            })
            .catch(error => {
                console.error('Error fetching website source code:', error);
                bot.sendMessage(chatId, 'An error occurred while fetching website source code.');
            });
    }
};
