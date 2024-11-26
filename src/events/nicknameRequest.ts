import { ChannelType, EmbedBuilder, Message, TextChannel } from "discord.js";
import {
  nicknameRequest_CREATE,
  setupNicknameRequestCollector,
} from "../modules/NicknameRequestModule";

const approvedEmoji = "<:Check_White_FNS:1310274014102687854>"; // Change this emoji to your preference
const denyEmoji = "<:No:1310633209519669290>";

export default {
  name: "messageCreate",
  once: false,
  async execute(message: Message) {
    try {
      if (message.author.bot) return;

      if (
        message.channel.id === "1310583941287379116" &&
        message.content.toLowerCase().startsWith("!rn")
      ) {
        // Parse everything after the command
        const nicknameRequest = message.content.slice("!rn".length).trim();

        const embed = new EmbedBuilder()
          .setTitle(`Nickname Request`)
          .setDescription(
            `**<@${message.author.id}>** has requested the nickname: **${nicknameRequest}**.\n\nMods, please approve or decline.`
          )
          .setColor("White");

        // Fetch the approval channel
        const approvalChannelId = "1310273100583276544"; // Target channel for nickname approval
        const approvalChannel =
          message.guild?.channels.cache.get(approvalChannelId);

        if (
          !approvalChannel ||
          approvalChannel.type !== ChannelType.GuildText
        ) {
          console.error("Approval channel not found or is not a text channel.");
          await message.reply(
            "An error occurred while processing your request."
          );
          return;
        }

        // Send the embed message to the approval channel
        const sentMessage = await (approvalChannel as TextChannel).send({
          content: "<@&1310186525606154340>",
          embeds: [embed],
          allowedMentions: { parse: ["roles"] }, // Ensure only roles are mentioned
        });

        await sentMessage.react(approvedEmoji);
        await sentMessage.react(denyEmoji);

        await nicknameRequest_CREATE(
          nicknameRequest,
          message.author.id,
          sentMessage.channel.id,
          sentMessage.id
        );

        await setupNicknameRequestCollector(sentMessage, nicknameRequest);

        await (message.channel as TextChannel).send({
          content: `Successfully created a nickname request from user: <@${message.author.id}>`,
          allowedMentions: { parse: ["users"] },
        });
        console.log(
          `Successfully created a nickname request from user: ${message.author.username}`
        );
      }
    } catch (error) {
      console.log(error);
    }
  },
};
