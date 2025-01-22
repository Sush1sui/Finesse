import { Message } from "discord.js";

// timer = 15s
export let timer = 15000;

export const changeTimer = (val: number) => {
  timer = val * 1000;
};

const commands = ["$kak claim", "$kc", "$tc", "$trash claim"];

const channelId = "1310429477548982363";

const timeoutMap = new Map<string, NodeJS.Timeout>();
const intervalMap = new Map<string, NodeJS.Timeout>();

export default {
  name: "messageCreate",
  async execute(message: Message): Promise<void> {
    if (
      commands.includes(message.content.toLowerCase()) &&
      message.channelId === channelId
    ) {
      const userId = message.author.id;

      if (timeoutMap.has(userId)) {
        clearTimeout(timeoutMap.get(userId) as NodeJS.Timeout);
        clearInterval(intervalMap.get(userId) as NodeJS.Timeout);
        timeoutMap.delete(userId);
        intervalMap.delete(userId);
      }

      // convert to 15s from 15000ms
      let remainingTime = timer / 1000;

      const replyMessage = await message.reply(
        `**You can kak/trash claim now <@${userId}> in ${remainingTime} seconds!**`
      );

      const intervalId = setInterval(async () => {
        remainingTime--;
        if (remainingTime >= 0) {
          try {
            await replyMessage.edit(
              `**You can kak/trash claim now <@${userId}> in ${remainingTime} seconds!**`
            );
          } catch (error) {
            console.log("Error updating countdown message: ", error);
          }
        }
      });

      const timeoutId = setTimeout(async () => {
        clearInterval(intervalId);
        try {
          await replyMessage.delete();
          await message.reply(`**You can kak/trash claim now <@${userId}>!**`);
        } catch (error) {
          console.error("Error sending claim message:", error);
        } finally {
          timeoutMap.delete(userId);
          intervalMap.delete(userId);
        }
      }, timer);

      timeoutMap.set(userId, timeoutId);
      intervalMap.set(userId, intervalId);
    }
  },
};
