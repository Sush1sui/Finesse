import { GuildMember, Message } from "discord.js";

const staff_id = "1310186525606154340";
const booster_id = "1292420325002448930";
const pioneer_id = "1303916681692839956";
const supporter_id = "1303924607555997776";

const CHANNEL_EXCEPTION = [
  "1292412679402815662",
  "1292421531753906279",
  "1292421689010946119",
  "1292421879617028167",
  "1292412946672128050",
  "1292412825293160469",
  "1310961229468143638",
];

// const CATEGORY_EXCEPTION = [];

export default {
  name: "messageCreate",
  once: false,
  async execute(message: Message): Promise<void> {
    try {
      // Ignore messages sent by bots or in exception channels
      if (
        message.author.bot ||
        CHANNEL_EXCEPTION.includes(message.channel.id)
      ) {
        return;
      }

      // Check if the message channel is a GuildText-based channel (not a DM or other channel type)
      // if (
      //   message.channel instanceof TextChannel
      //   && message.channel.parentId
      //   && CATEGORY_EXCEPTION.includes(message.channel.parentId)
      // ) {
      //   return;
      // }

      const member = message.member as GuildMember;
      if (!member) return;

      const hasAuthorizedRole =
        member.roles.cache.has(staff_id) ||
        member.roles.cache.has(booster_id) ||
        member.roles.cache.has(pioneer_id) ||
        member.roles.cache.has(supporter_id);

      if (hasAuthorizedRole) return;

      const hasAttachments = message.attachments.size > 0;

      const includesLinks =
        message.content.includes("http") ||
        message.content.includes("www.") ||
        message.content.includes("discord.gg/");

      if (hasAttachments || includesLinks) {
        await message.delete();
        console.log(
          `Deleted a message from ${message.author.tag} in ${message.channel}`
        );
      }
    } catch (error) {
      console.error(`Failed to delete message: ${(error as Error).message}`);
    }
  },
};
