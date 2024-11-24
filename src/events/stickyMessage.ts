import { EmbedBuilder, GuildMember, Message, TextChannel } from "discord.js";
import {
  getAllStickyMessageChannelID,
  getStickyMessage_MID,
  setStickyMessage_MID,
  stickyMessageString,
} from "../modules/stickyMessageModule";

export default {
  name: "messageCreate",
  once: false,
  async execute(message: Message): Promise<void> {
    try {
      if (message.author.bot && message.channel.id !== "1292455344055910491")
        return;

      if (!(message.member as GuildMember)) return;

      const STICKY_CHANNELS = await getAllStickyMessageChannelID();

      // Check if the message was sent in a sticky channel
      if (STICKY_CHANNELS.includes(message.channel.id)) {
        // Check if the channel is a TextChannel
        if (message.channel instanceof TextChannel) {
          const existingStickyMessageId = await getStickyMessage_MID(
            message.channel.id
          );

          // If there is an existing sticky message, delete it
          if (existingStickyMessageId) {
            try {
              const existingMessage = await message.channel.messages.fetch(
                existingStickyMessageId
              );
              if (existingMessage) {
                await existingMessage.delete();
                console.log(
                  `Deleted existing sticky message with ID: ${existingStickyMessageId}`
                );
              }
            } catch (error) {
              console.warn(
                `Failed to fetch or delete message with ID ${existingStickyMessageId}. It may have already been deleted.`
              );
            }
          }

          // Fetch the last message sent in the channel (if any)
          const messages = await message.channel.messages.fetch({
            limit: 2,
          });
          const recentMessage = messages.last();

          let recentMessageId: string | null = null;
          if (recentMessage && recentMessage.id !== message.id) {
            recentMessageId = recentMessage.id;
          }

          const customNotEmpty = stickyMessageString.length !== 0;

          const embed = new EmbedBuilder()
            .setTitle("Stickied Message")
            .setDescription(
              message.channel.id === "1292455344055910491"
                ? "If you guys want to reply to the confession, just **create a thread**."
                : customNotEmpty
                ? stickyMessageString
                : "Kindly avoid chatting or flood replies. Just use the **Thread** to avoid spamming or you will be **Timed out**"
            )
            .setColor("White");

          // Send the new sticky message and store its ID in the database
          const newStickyMessage = await (message.channel as TextChannel).send({
            content: "",
            embeds: [embed],
          });

          await setStickyMessage_MID(
            message.channel.id,
            recentMessageId,
            newStickyMessage.id
          );

          console.log(`Sent new sticky message: ${newStickyMessage.id}`);
        } else {
          console.log("The message was not sent in a text channel.");
        }
      }
    } catch (error) {
      console.error(
        `Failed to send embed message: ${(error as Error).message}`,
        error
      );
    }
  },
};
