import { Message } from "discord.js";

export default {
  name: "messageCreate", // Correct event for when a message is sent
  once: false,
  async execute(message: Message) {
    try {
      if (message.author.bot) return;

      if (message.content.toLowerCase().includes("hahaha")) {
        // React with custom animated emojis
        await message.react("😆");
      }
    } catch (error) {
      console.error(`Failed to add reaction: ${(error as Error).message}`);
    }
  },
};
