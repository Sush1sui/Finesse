import {
  ButtonInteraction,
  TextChannel,
  EmbedBuilder,
  GuildMember,
} from "discord.js";
import { Request, Response } from "express";
import crypto from "crypto";

export async function sendWelcomeAfterVerification(
  buttonInteraction: ButtonInteraction<"cached">,
  member: GuildMember
) {
  const generalChannel = buttonInteraction.guild.channels.cache.get(
    "1292411347220435006"
  ) as TextChannel;

  if (generalChannel) {
    const embed = new EmbedBuilder()
      .setTitle(`Hello ${member.displayName}! Welcome to **Finesse**.`)
      .setDescription(
        "Please make sure you head to <#1292414576541040671> before chatting.\n" +
          "On top of that, please go to <#1292714443351785502> to set up your roles.\n\n"
      )
      .setFooter({ text: "└─── we hope you enjoy your stay in here!──➤" })
      .setColor("Orange")
      .setThumbnail(member.user.displayAvatarURL({ size: 512 }));

    await generalChannel.send({
      content: `# **Welcome ${member.user}!**`,
      allowedMentions: { parse: ["users"] },
      embeds: [embed],
    });
  } else {
    console.error("General channel not found.");
  }
}

export function verifyGitHubSignature(
  req: Request,
  _res: Response,
  buf: Buffer,
  GITHUB_SECRET: string
) {
  const signature = req.headers["x-hub-signature-256"];

  if (!signature) {
    throw new Error("Missing GitHub signature!"); // Throwing an error instead of sending a response
  }

  const hmac = crypto.createHmac("sha256", GITHUB_SECRET);
  hmac.update(buf);
  const expectedSignature = `sha256=${hmac.digest("hex")}`;

  if (signature !== expectedSignature) {
    throw new Error("Invalid GitHub signature!"); // Throwing an error instead of sending a response
  }
}
