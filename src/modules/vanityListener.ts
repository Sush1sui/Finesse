import { EmbedBuilder, Guild, TextChannel } from "discord.js";
import ColorTransition from "../models/ColorTransitionSchema"; // Assuming the model is saved here

const supporterRoleId = "1303924607555997776";
const supporterLink = "discord.gg/finesseph";
const supporterChannelId = "1310442561126535179";

// Define the color transition array
const colorTransition = [
  "#FFC0CB",
  "#FCA1D1",
  "#F982D7",
  "#F663DE",
  "#F344E4",
  "#E625E9",
  "#CF1BDF",
  "#B812D6",
  "#A00BCC",
  "#8804C3",
  "#7000B9",
  "#5800B0", // Midpoint (Purple)
  "#7000B9",
  "#8804C3",
  "#A00BCC",
  "#B812D6",
  "#CF1BDF",
  "#E625E9",
  "#F344E4",
  "#F663DE",
  "#F982D7",
  "#FCA1D1",
  "#FFC0CB",
];

export async function checkSupporterStatus(guild: Guild) {
  try {
    console.log("scanning for vanity links");

    // Fetch all members in the guild
    const members = await guild.members.fetch();

    // Get the role object from the role ID
    const supporterRole = guild.roles.cache.get(supporterRoleId);

    if (!supporterRole) {
      console.error(`Supporter role not found with ID: ${supporterRoleId}`);
      return;
    }

    // Fetch the current color index from the database
    let colorData = await ColorTransition.findOne();

    if (!colorData) {
      // If no color data exists, create it with default index
      colorData = new ColorTransition({ colorIndex: 0 });
      await colorData.save();
    }

    const currentColor = colorTransition[colorData.colorIndex];

    for (const member of members.values()) {
      // Skip bots
      if (member.user.bot) continue;

      // Get the custom status from the presence activities
      const customStatus = member.presence?.activities.find(
        (activity) => activity.state === supporterLink
      )?.state;

      // Check if the custom status contains the supporter link
      const includesSupporterLink = customStatus?.includes(supporterLink);

      // Check if the user already has the role
      const hasSupporterRole = member.roles.cache.has(supporterRoleId);

      // Add or remove the role based on the link
      if (includesSupporterLink && !hasSupporterRole) {
        await member.roles.add(supporterRoleId);
        console.log(`Added supporter role to ${member.user.tag}`);

        // Send the formatted message to the supporter channel
        const supporterChannel = (await guild.channels.fetch(
          supporterChannelId
        )) as TextChannel;
        if (supporterChannel) {
          const embed = new EmbedBuilder();

          embed
            .setTitle(`Thank you for supporting **Finesse!**`)
            .setDescription(
              `${member} updated their status with our vanity link \`discord.gg/finesseph\` and earned the ${supporterRole} role!\n
> Perks:
- Nickname Perms
- Image & Embed Link Perms
- 1.5x Level Boost
- Color Name <@%1310451488975224973>
            `
            )
            .setImage(
              "https://cdn.discordapp.com/attachments/1293239740404994109/1310449852349681704/image.png"
            )
            .setColor(parseInt(currentColor.replace("#", "0x"), 16))
            .setFooter({
              text: "*Note: Perks will be revoked if you remove the status.*",
            }); // Convert hex to number

          await supporterChannel.send({
            content: ``,
            embeds: [embed],
            allowedMentions: { parse: ["users", "roles"] },
          });

          // Update the color index in the database
          const nextColorIndex =
            (colorData.colorIndex + 1) % colorTransition.length;
          colorData.colorIndex = nextColorIndex;
          await colorData.save();
        }
      } else if (!includesSupporterLink && hasSupporterRole) {
        await member.roles.remove(supporterRoleId);
        console.log(`Removed supporter role from ${member.user.tag}`);
      }
    }
  } catch (error) {
    console.error(`Error checking supporter statuses: ${error}`);
  } finally {
    console.log("scanning for vanity links done");
  }
}
