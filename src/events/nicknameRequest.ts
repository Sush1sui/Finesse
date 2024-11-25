import { EmbedBuilder, Message, TextChannel, User } from "discord.js";
import { nicknameRequest_CREATE } from "../modules/NicknameRequestModule";

const checkEmoji = "Check_White_FNS:1310274014102687854"; // Change this emoji to your preference
const denyEmoji = "No:1310633209519669290";

export default {
  name: "messageCreate",
  once: false,
  async execute(message: Message) {
    try {
      if (message.author.bot) return;

      if (
        message.channel.id === "1292414576541040674" &&
        message.content.toLowerCase().startsWith("!rqsnick")
      ) {
        // Parse everything after the command
        const nicknameRequest = message.content.slice("!rqsnick".length).trim();

        const embed = new EmbedBuilder()
          .setTitle(`Nickname Request`)
          .setDescription(
            `**<@${message.author.id}>** has requested the nickname: **${nicknameRequest}**.\n\nMods, please approve or decline.`
          )
          .setColor("White");

        const sentMessage = await (message.channel as TextChannel).send({
          embeds: [embed],
          allowedMentions: { parse: ["users"] },
        });

        await sentMessage.react(checkEmoji);
        await sentMessage.react(denyEmoji);

        // Set up the reaction collector
        const filter = async (reaction: any, user: User) => {
          // Allow only staff members (you can use roles or any other check)
          if (user.bot) return false; // Ignore bot reactions

          // Fetch the member object to access roles
          const member = await message.guild?.members.fetch(user.id);
          if (!member) return false; // If member not found, return false

          // Only allow reactions from users with the specified staff role
          const hasStaffRole = member.roles.cache.has("1310186525606154340");

          // Check if the reaction is from the bot's reactions (Check or Deny) and staff
          return (
            (reaction.emoji.name === checkEmoji ||
              reaction.emoji.name === denyEmoji) &&
            hasStaffRole
          );
        };

        const collector = sentMessage.createReactionCollector({
          filter,
          dispose: true, // Make sure the reaction is removed when disposed
        });

        await nicknameRequest_CREATE(
          nicknameRequest,
          message.author.id,
          message.id
        );

        console.log(
          `Successfully created a nickname request from user: ${message.author.username}`
        );

        collector.on("collect", async (reaction, user) => {
          // Handle the reaction (approve/deny)
          if (reaction.emoji.name === checkEmoji) {
            // Approve the nickname request
            await message.guild?.members
              .fetch(message.author.id)
              .then((member) => {
                member.setNickname(nicknameRequest).catch(console.error);
              });
            const successEmbed = new EmbedBuilder()
              .setTitle("Nickname Request Approved")
              .setDescription(
                `**<@${message.author.id}>**'s nickname has been changed to **${nicknameRequest}**.`
              )
              .setColor("Green");

            await (message.channel as TextChannel).send({
              embeds: [successEmbed],
              allowedMentions: { parse: ["users"] },
            });
            console.log(
              `Nickname request approved for ${message.author.username}`
            );
          } else if (reaction.emoji.name === denyEmoji) {
            // Deny the nickname request
            const denyEmbed = new EmbedBuilder()
              .setTitle("Nickname Request Denied")
              .setDescription(
                `**<@${message.author.id}>**'s nickname change request has been denied.`
              )
              .setColor("Red");

            await (message.channel as TextChannel).send({
              embeds: [denyEmbed],
              allowedMentions: { parse: ["users"] },
            });
            console.log(
              `Nickname request denied for ${message.author.username}`
            );
          }

          // Remove reactions after approval/denial
          await reaction.users.remove(user);
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
};
