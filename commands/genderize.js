const axios = require('axios');

module.exports = {
  jea: { 
    name: 'genderize', 
    description: 'Get the gender of a given name',
    author: 'Shinpei/Deku',
    usage: ['[name]'],
    category: 'fun'
  },
  execute: async function ({ bot, chatId, args }) {
    try {
      const name = args.join(" ");
      if (!name) return bot.sendMessage(chatId, "Please specify a name to determine its gender.");

      const response = await axios.get(`https://deku-rest-api.replit.app/genderize?name=${encodeURIComponent(name)}`);

      const { name: queriedName, gender, probability } = response.data;

      if (!gender) {
        bot.sendMessage(chatId, `Unable to determine gender for the name: ${queriedName}`);
      } else {
        bot.sendMessage(chatId, `Name: ${queriedName}\nGender: ${gender}\nProbability: ${probability}%`);
      }
    } catch (error) {
      console.error("Error determining gender:", error);
      bot.sendMessage(chatId, "An error occurred while determining the gender.");
    }
  }
};
