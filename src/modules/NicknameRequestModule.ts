import {
  ChannelType,
  Client,
  Message,
  MessageReaction,
  TextChannel,
  User,
} from "discord.js";
import NicknameRequest from "../models/NicknameApproval.model";

// Set up the reaction collector for the message
const approveEmoji = "<:Check_White_FNS:1310274014102687854>";
const denyEmoji = "<:No:1310633209519669290>";

const staffId = "1310186525606154340";

export async function fetchAllNicknameRequests() {
  try {
    return await NicknameRequest.find();
  } catch (error) {
    console.log("Error fetching Nickname Request: ", error);
    return null;
  }
}

export async function nicknameRequest_CREATE(
  val: string,
  userId: string,
  userMessageId: string,
  channelId: string,
  messageId: string
) {
  try {
    await NicknameRequest.create({
      userId,
      userMessageId,
      messageId,
      channelId,
      nickname: val,
      reactions: [{ emoji: approveEmoji }, { emoji: denyEmoji }],
    });
  } catch (error) {
    console.log(error);
  }
}

export async function nicknameRequest_REMOVE(messageId: string) {
  try {
    await NicknameRequest.findOneAndDelete({ messageId });
  } catch (error) {
    console.log(error);
  }
}

export function isValidEmoji(inputEmoji: string): boolean {
  const customEmojiRegex = /^<a?:\w+:\d+>$/; // Custom emoji
  const unicodeEmojiRegex = /\p{Extended_Pictographic}/u; // Unicode emoji
  return (
    customEmojiRegex.test(inputEmoji) || unicodeEmojiRegex.test(inputEmoji)
  );
}

export function extractEmojiId(emojiString: string) {
  // Regular expression to match custom emoji format <a:emojiName:emojiId> or <:emojiName:emojiId>
  const regex = /<a?:(\w+):(\d+)>/; // Matches both animated and non-animated custom emojis
  const match = emojiString.match(regex);

  if (match) {
    return match[2]; // Return the emoji ID
  }
  return null; // Return null if no match is found
}

export async function setupNicknameRequestCollector(
  message: Message,
  nickname: string
) {
  console.log(
    `Setting up reaction collector for nickname request: ${nickname} on message: ${message.id}`
  );

  // Fetch the approval channel
  const nicknameRequestChannelId = "1310583941287379116"; // Target channel for nickname approval
  const nicknameRequestChannel = message.guild?.channels.cache.get(
    nicknameRequestChannelId
  );

  if (
    !nicknameRequestChannel ||
    nicknameRequestChannel.type !== ChannelType.GuildText
  ) {
    console.error(
      "Nickname request channel not found or is not a text channel."
    );
    await message.reply("An error occurred while processing your request.");
    return;
  }

  const approvedEmojiId = extractEmojiId(approveEmoji);
  const denyEmojiId = extractEmojiId(denyEmoji);

  if (!approvedEmojiId || !denyEmojiId)
    throw new Error("Error extracting emoji ID");

  const filter = async (reaction: MessageReaction, user: User) => {
    const guild = reaction.message.guild;
    if (!guild) return false; // Ensure the reaction is in a guild

    const member = await guild.members.fetch(user.id); // Fetch the member associated with the user
    const hasStaffRole = member.roles.cache.has(staffId);

    return (
      !user.bot &&
      hasStaffRole &&
      (reaction.emoji.id === approvedEmojiId ||
        reaction.emoji.id === denyEmojiId)
    );
  };

  const collector = message.createReactionCollector({ filter, dispose: true });

  collector.on("collect", async (reaction, user) => {
    console.log(`Reaction collected: ${reaction.emoji.name} by ${user.tag}`);

    if (user.bot) return;

    const guild = reaction.message.guild;
    if (!guild) return;

    const member = await reaction.message.guild?.members.fetch(user.id);

    if (member) {
      try {
        if (!reaction.message.guild) throw new Error("No reactions found");

        const hasStaffRole = member.roles.cache.has(staffId);
        if (!hasStaffRole) throw new Error("User is not a staff");
        if (reaction.emoji.id === approvedEmojiId) {
          const request = await NicknameRequest.findOne({
            messageId: message.id,
          });
          if (request) {
            const userToChange = await reaction.message.guild.members.fetch(
              request.userId
            );
            const userMessageChannel =
              reaction.message.guild.channels.cache.get(
                request.channelId
              ) as TextChannel;
            if (!userMessageChannel)
              throw new Error("No nickname request channel found");

            const userMessage = userMessageChannel.messages.cache.get(
              request.userMessageId
            );
            if (!userMessage) throw new Error("No user message found to react");

            if (userToChange) {
              await userToChange.setNickname(nickname); // Assign the new nickname
              console.log(
                `Changed nickname for ${userToChange.user.username} to ${nickname}`
              );
              // nicknameRequestChannel.send({
              //   content: `Nickname request for <@${userToChange.user.id}> to **${nickname} is approved**`,
              //   allowedMentions: { parse: ["users"] },
              // });
              await userMessage?.react(approveEmoji);
              await nicknameRequest_REMOVE(message.id);
              collector.stop("approved");
            }
          }
        } else if (reaction.emoji.id === denyEmojiId) {
          const request = await NicknameRequest.findOne({
            messageId: message.id,
          });
          if (request) {
            const userToChange = await reaction.message.guild.members.fetch(
              request.userId
            );
            const userMessageChannel =
              reaction.message.guild.channels.cache.get(
                request.channelId
              ) as TextChannel;
            if (!userMessageChannel)
              throw new Error("No nickname request channel found");

            const userMessage = userMessageChannel.messages.cache.get(
              request.userMessageId
            );
            if (!userMessage) throw new Error("No user message found to react");
            if (userToChange) {
              await nicknameRequest_REMOVE(message.id);
              console.log(
                `Nickname request for ${userToChange.user.username} to ${nickname} is denied`
              );
              // nicknameRequestChannel.send({
              //   content: `Nickname request for <@${userToChange.user.id}> to **${nickname} is denied**`,
              //   allowedMentions: { parse: ["users"] },
              // });
              await userMessage?.react(denyEmoji);
              collector.stop("denied");
            }
          }
        } else {
          console.log("Not approve or deny emoji");
        }
      } catch (error) {
        console.log(error);
      }
    }
  });
}

export async function initializeNicknameRequests(client: Client) {
  const guild = client.guilds.cache.first();

  if (!guild) {
    console.error("Bot is not in any guild");
    return;
  }

  try {
    const channels = await guild.channels.fetch();
    const nicknameRequests = await fetchAllNicknameRequests();

    if (!nicknameRequests) throw new Error("No nickname requests");

    for (const channel of channels.values()) {
      if (channel instanceof TextChannel) {
        const filteredNicknameRequests = nicknameRequests.filter(
          (nicknameRequest) => nicknameRequest.channelId === channel.id
        );

        for (const { messageId, nickname } of filteredNicknameRequests) {
          const message = await channel.messages.fetch(messageId);
          if (!message) {
            console.error(
              `Message with ID ${messageId} not found in channel ${channel.id}`
            );
            return;
          }

          setupNicknameRequestCollector(message, nickname);
          console.log(
            `Initialized react ${nickname} for message ${messageId} in channel ${channel.id}`
          );
        }
      }
    }
  } catch (error) {
    console.error(`Error initializing reaction roles: ${error}`);
  }
}
