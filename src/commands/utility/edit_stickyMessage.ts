import {
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder,
} from "discord.js";
import { editStickyMessageString } from "../../modules/stickyMessageModule";

export default {
    data: new SlashCommandBuilder()
        .setName("edit_sticky_message")
        .setDescription("Edit the message of the sticky message")
        .addStringOption((option) =>
            option
                .setName("message")
                .setDescription("The message")
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

        await interaction.deferReply({ ephemeral: true });

        const message = interaction.options.getString("message") || "";

        try {
            await editStickyMessageString(message);

            console.log("Sticky message edit done, message: ", message);
            await interaction.editReply({
                content: `Sticky message edit done, message: ${message}`,
            });
            return;
        } catch (error) {
            const errorMessage = (error as Error).message;
            await interaction.editReply({
                content: `There was an error editing the sticky message: ${errorMessage}`,
            });
            return;
        }
    },
};
