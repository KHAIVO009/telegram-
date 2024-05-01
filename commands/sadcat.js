// sadcat.js

const axios = require('axios');
const fs = require('fs');
const { join } = require('path');

module.exports = {
    jea: {
        name: 'sadcat',
        description: 'Generate a sad cat image with the provided text.',
        author: 'Shinpei',
        usage: '[text]',
        category: 'Fun'
    },
    execute({ bot, chatId, args }) {
        const text = args.join('+');

        if (!text) {
            bot.sendMessage(chatId, 'Please provide text to generate the sad cat image.');
            return;
        }

        const apiUrl = `https://api.popcat.xyz/sadcat?text=${text}`;

        // Define cache folder path
        const cacheFolder = join(__dirname, 'cache');
        if (!fs.existsSync(cacheFolder)) {
            fs.mkdirSync(cacheFolder);
        }

        // Define image file path
        const imagePath = join(cacheFolder, 'sadcat.jpg');

        // Download the sad cat image from the API
        axios({
            url: apiUrl,
            method: 'GET',
            responseType: 'stream'
        })
            .then(response => {
                // Save the image to cache
                response.data.pipe(fs.createWriteStream(imagePath))
                    .on('finish', () => {
                        // Send the sad cat image to the chat
                        bot.sendPhoto(chatId, fs.createReadStream(imagePath))
                            .then(() => {
                                // Delete the cached image after sending
                                fs.unlinkSync(imagePath);
                            })
                            .catch(error => {
                                console.error('Error sending photo:', error);
                                bot.sendMessage(chatId, 'An error occurred while sending the sad cat image.');
                            });
                    })
                    .on('error', error => {
                        console.error('Error downloading sad cat image:', error);
                        bot.sendMessage(chatId, 'An error occurred while downloading the sad cat image.');
                    });
            })
            .catch(error => {
                console.error('Error fetching sad cat image:', error);
                bot.sendMessage(chatId, 'An error occurred while fetching the sad cat image.');
            });
    }
};
