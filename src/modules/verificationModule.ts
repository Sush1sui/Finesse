import { Client, EmbedBuilder, TextChannel } from "discord.js";
import Verification from "../models/Verification.model";

export const verifiedRoleId = "1292473360114122784";

export async function initializeVerificationCollector(client: Client) {
    // Retrieve verification details from the database
    const verificationChannelId = await getVerificationChannelID();
    const verificationMessageId = await getVerificationMessageID();

    if (verificationChannelId && verificationMessageId) {
        const channel = (await client.channels.fetch(
            verificationChannelId
        )) as TextChannel;
        if (channel) {
            try {
                const message = await channel.messages.fetch(
                    verificationMessageId
                );

                // Attach the collector
                const collector = message.createMessageComponentCollector();

                collector.on("collect", async (buttonInteraction) => {
                    // Check if the interaction is a button interaction
                    if (!buttonInteraction.isButton()) return;

                    // Check if it's the right button
                    if (buttonInteraction.customId !== "sushi_button") return;

                    const member = buttonInteraction.member;
                    if (!member || !buttonInteraction.guild) {
                        await buttonInteraction.reply({
                            content:
                                "This command can only be used in a guild.",
                            ephemeral: true,
                        });
                        return;
                    }

                    try {
                        const role =
                            buttonInteraction.guild?.roles.cache.get(
                                verifiedRoleId
                            );
                        if (role) {
                            if (member.roles.cache.has(role.id)) {
                                await buttonInteraction.reply({
                                    content: "You are already verified!",
                                    ephemeral: true,
                                });
                                return;
                            }

                            await member.roles.add(role);
                            await buttonInteraction.reply({
                                content:
                                    "You have been verified and the role has been assigned!",
                                ephemeral: true,
                            });
                        } else {
                            await buttonInteraction.reply({
                                content: "The specified role was not found.",
                                ephemeral: true,
                            });
                        }

                        const generalChannel =
                            buttonInteraction.guild.channels.cache.get(
                                "1292411347220435006"
                            ) as TextChannel;

                        if (generalChannel) {
                            const embed = new EmbedBuilder()
                                .setDescription(
                                    `**Read** ➣ <#1292414576541040671>\n
                                **Get**  ➣ gib channel\n
                                **Vibe** ➣ <#1290538849570787404>\n
                                `
                                )
                                .setFooter({ text: "Gib footer message" })
                                .setColor("Orange");

                            await generalChannel.send({
                                content: `Welcome ${member.user}!`,
                                allowedMentions: { parse: ["users"] },
                                embeds: [embed],
                            });
                        } else {
                            console.error("General channel not found.");
                        }
                    } catch (error) {
                        const errorMessage = (error as Error).message;
                        await buttonInteraction.reply({
                            content: `There was an error assigning the roles: ${errorMessage}`,
                            ephemeral: true,
                        });
                    }
                });

                console.log("Verification collector has been initialized.");
            } catch (error) {
                console.error(
                    `Failed to fetch verification message: ${
                        (error as Error).message
                    }`
                );
            }
        }
    }
}

export async function initializeVerification() {
    const existingVerificationMessage = await Verification.findOne({});

    if (existingVerificationMessage === null) {
        const verificationMessage = new Verification({
            verificationMessagePresent: false,
            verificationChannelID: null,
            verificationMessageID: null,
        });
        await verificationMessage.save();
    }
}

export async function setVerificationStatus(value: boolean) {
    const existingVerificationMessage = await Verification.findOne({});

    if (existingVerificationMessage) {
        await existingVerificationMessage.updateOne({
            verificationMessagePresent: value,
            verificationChannelID:
                existingVerificationMessage.verificationChannelID,
            verificationMessageID:
                existingVerificationMessage.verificationMessageID,
        });
    }
}

export async function getVerificationChannelID() {
    const existingVerificationMessage = await Verification.findOne({});

    if (existingVerificationMessage)
        return existingVerificationMessage.verificationChannelID;
    return null;
}

export async function getVerificationMessageID() {
    const existingVerificationMessage = await Verification.findOne({});

    if (existingVerificationMessage)
        return existingVerificationMessage.verificationMessageID;
    return null;
}

export async function setVerificationChannelID(
    value: string | undefined | null
) {
    if (value === undefined) throw new Error("Value is undefined");
    const existingVerificationMessage = await Verification.findOne({});

    if (existingVerificationMessage) {
        await existingVerificationMessage.updateOne({
            verificationChannelID: value,
            verificationMessageID:
                existingVerificationMessage.verificationMessageID,
            verificationMessagePresent:
                existingVerificationMessage.verificationMessagePresent,
        });
    }
}

export async function setVerificationMessageID(
    value: string | undefined | null
) {
    if (value === undefined) throw new Error("Value is undefined");
    const existingVerificationMessage = await Verification.findOne({});

    if (existingVerificationMessage) {
        await existingVerificationMessage.updateOne({
            verificationMessageID: value,
            verificationChannelID:
                existingVerificationMessage.verificationChannelID,
            verificationMessagePresent:
                existingVerificationMessage.verificationMessagePresent,
        });
    }
}

export async function getVerificationMessageStatus() {
    const existingVerificationMessage = await Verification.findOne({});

    if (existingVerificationMessage)
        return existingVerificationMessage.verificationMessagePresent;
    return null;
}
