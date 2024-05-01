const axios = require('axios');
const fs = require('fs');
const path = require('path');

const cacheDirectory = `${__dirname}/cache/`;

module.exports = {
    jea: {
        name: 'cdp',
        description: 'Get a couple display picture (DP).',
        author: 'Lance Ajiro',
        usage: [],
        category: 'image'
    },
    execute: async function ({ bot, chatId, args }) {
        try {
            const response = await axios.get('https://deku-rest-api.replit.app/cdp');
            const { one, two } = response.data.result;

            const maleImg = await axios.get(one, { responseType: 'arraybuffer' });
            fs.writeFileSync(path.join(cacheDirectory, 'img1.png'), Buffer.from(maleImg.data, 'utf-8'));
            const femaleImg = await axios.get(two, { responseType: 'arraybuffer' });
            fs.writeFileSync(path.join(cacheDirectory, 'img2.png'), Buffer.from(femaleImg.data, 'utf-8'));

            const allImages = [
                {
                    source: path.join(cacheDirectory, 'img1.png'),
                    filename: 'img1.png'
                },
                {
                    source: path.join(cacheDirectory, 'img2.png'),
                    filename: 'img2.png'
                }
            ];

            await bot.sendPhoto(chatId, allImages[0].source);
            await bot.sendPhoto(chatId, allImages[1].source);
        } catch (error) {
            console.error(error);
        }
    }
};
