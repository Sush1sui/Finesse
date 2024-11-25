import { Message } from "discord.js";

export default {
  name: "messageCreate", // Correct event for when a message is sent
  once: false,
  async execute(message: Message) {
    try {
      if (message.author.bot) return;

      if (
        message.channel.id === "1292412679402815662" &&
        message.attachments.size > 0
      ) {
        await message.react("Check_White_FNS:1310274014102687854");
        await message.react("pixelheart:1310424521421099113");
      }

      if (message.content.toLowerCase().includes("hahaha")) {
        // React with custom animated emojis
        await message.react("😆");
      }
    } catch (error) {
      console.error(`Failed to add reaction: ${(error as Error).message}`);
    }
  },
};
