import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    EmbedBuilder,
    PermissionFlagsBits,
    SlashCommandBuilder,
    TextChannel,
} from "discord.js";
import {
    getVerificationMessageStatus,
    setVerificationChannelID,
    setVerificationMessageID,
    setVerificationStatus,
} from "../../modules/verificationModule";
import { verifiedRoleId } from "../../modules/verificationModule";
import { sendWelcomeAfterVerification } from "../../Utils.function";

export default {
    data: new SlashCommandBuilder()
        .setName("send-verification")
        .setDescription("Send a verification embed message on a target channel")
        .addChannelOption((option) =>
            option
                .setName("channel")
                .setDescription(
                    "The channel where the verification message will be sent"
                )
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const member = interaction.member;
        if (!member || !interaction.guild) {
            await interaction.reply({
                content: "This command can only be used in a guild.",
                ephemeral: true,
            });
            return;
        }

        if ((await getVerificationMessageStatus()) === true) {
            await interaction.reply({
                content: "There is already an existing verification message",
                ephemeral: true,
            });
            return;
        }

        await interaction.deferReply({ ephemeral: true });

        const channel = interaction.options.getChannel("channel");

        const embedMessage = new EmbedBuilder()
            .setTitle("Welcome to Finesse!")
            .setColor("Blue")
            .setDescription(
                "Welcome to our community! Before you can fully access the server, please verify yourself by clicking the button below."
            );

        const button = new ButtonBuilder()
            .setCustomId("sushi_button")
            .setEmoji("956641640376832010")
            .setStyle(ButtonStyle.Primary);

        const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
            button
        );

        try {
            const message = await (channel as TextChannel).send({
                embeds: [embedMessage],
                components: [actionRow],
            });

            const collector = message.createMessageComponentCollector();

            collector.on("collect", async (buttonInteraction) => {
                // Check if the interaction is a button interaction
                if (!buttonInteraction.isButton()) return;

                // Check if it's the right button
                if (buttonInteraction.customId !== "sushi_button") return;

                const member = buttonInteraction.member;
                if (!member || !interaction.guild) {
                    await buttonInteraction.reply({
                        content: "This command can only be used in a guild.",
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

                        sendWelcomeAfterVerification(buttonInteraction, member);
                    } else {
                        await buttonInteraction.reply({
                            content: "The specified role was not found.",
                            ephemeral: true,
                        });
                    }
                } catch (error) {
                    const errorMessage = (error as Error).message;
                    await buttonInteraction.reply({
                        content: `There was an error assigning the roles: ${errorMessage}`,
                        ephemeral: true,
                    });
                }
            });

            // Edit the initial deferred reply to confirm the action was successful
            await interaction.editReply({
                content: "The verification message has been sent successfully!",
            });
            console.log("Verification set");

            await setVerificationChannelID(channel?.id);
            await setVerificationMessageID(message.id);
            await setVerificationStatus(true);
        } catch (error) {
            const errorMessage = (error as Error).message;
            await interaction.editReply({
                content: `There was an error sending the announcement: ${errorMessage}`,
            });
        }
    },
};
