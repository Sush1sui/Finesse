import { EmbedBuilder, GuildMember, TextChannel } from "discord.js";

const boostChannelId = "1292544143318454302";

export default {
  name: "guildMemberUpdate",
  async execute(oldMember: GuildMember, newMember: GuildMember): Promise<void> {
    try {
      const boostChannel = newMember.guild.channels.cache.get(
        boostChannelId
      ) as TextChannel;

      if (!boostChannel) {
        throw new Error("Boost channel not found, speak with your dev");
      }

      const oldBoostStatus = oldMember.premiumSince;
      const newBoostStatus = newMember.premiumSince;

      // Detect if the member is boosting (or has boosted again)
      if (
        newBoostStatus &&
        (!oldBoostStatus || oldBoostStatus < newBoostStatus)
      ) {
        const boostEmbed = new EmbedBuilder()
          .setTitle("Thank you for the server boost!")
          .setColor(0xff73fa) // Customize the embed color
          .setDescription(
            `${newMember} We truly appreciate your support and all you do to help make this community even better! Sending you all our love and gratitude!\n\n` +
              "> **Perks**\n" +
              "- Receive <@&1292420325002448930> role\n" +
              "- Custom Onigiri Color Role <@%1303919788342382615>" +
              "- Nickname perms\n" +
              "- Soundboard\n" +
              "- Attach Files\n" +
              "- Embed Links\n" +
              "- External Emoji & Sticker\n" +
              "- +2.0x Level Boost"
          )
          .setImage(
            "https://cdn.discordapp.com/attachments/1303917209101406230/1310235247341867028/tyfdboost.gif?ex=67447b29&is=674329a9&hm=9a9a997a62dc63ea9db4071304ab3489d56149113fa7d5f0479d42aea1c3f1ed&"
          )
          .setTimestamp();

        try {
          // Send the embed message to the boost channel
          await boostChannel.send({
            content: `✨ **Thank you for the server boost ${newMember}!**`, // Ping the booster
            embeds: [boostEmbed],
            allowedMentions: { parse: ["users"] },
          });
        } catch (error) {
          console.error("Error sending boost notification:", error);
        }
      }
    } catch (error) {
      console.error("Error handling boost notification:", error);
    }
  },
};
