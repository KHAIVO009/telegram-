const axios = require('axios');
const fs = require('fs');

let path = __dirname + "/cache/spotify.mp3";

module.exports = {
    jea: {
        name: 'spotify',
        description: 'Listen on Spotify using bot',
        author: 'Deku',
        usage: ['[song title]'],
        category: 'media'
    },
    execute: async function ({ bot, chatId, args }) {
        try {
            let q = args.join(" ");
            if (!q) return bot.sendMessage(chatId, "[ ❗ ] - Missing title of the song");
            bot.sendMessage(chatId, "[ 🔍 ] Searching for “" + q + "” ...");
            const results = (await axios.get("https://deku-rest-api.replit.app/spotify?q=" + encodeURIComponent(q))).data;
          let url = results.result;

            const dl = (await axios.get(url, { responseType: "arraybuffer" })).data;
            fs.writeFileSync(path, Buffer.from(dl, "utf-8"));

            // Send the audio using TelegramBot.sendAudio
            bot.sendAudio(chatId, path, {
                contentType: 'audio/mpeg'
            })
            .then(() => {
                console.log("Audio sent successfully!");
                fs.unlinkSync(path); // Delete the temporary file after sending
            })
            .catch((error) => {
                console.error("Error sending audio:", error);
                fs.unlinkSync(path); // Delete the temporary file even on error
            });
        } catch (error) {
            console.error(error);
            bot.sendMessage(chatId, error.message);
        }
    }
};
