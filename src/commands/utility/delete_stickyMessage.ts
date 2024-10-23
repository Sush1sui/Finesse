import {
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder,
} from "discord.js";
import { deleteStickyMessageString } from "../../modules/stickyMessageModule";

export default {
    data: new SlashCommandBuilder()
        .setName("delete_sticky_message")
        .setDescription("Delete the message of the sticky message")
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

        try {
            await deleteStickyMessageString();

            console.log(`Sticky message delete done`);
            await interaction.editReply({
                content: `Sticky message delete done`,
            });
            return;
        } catch (error) {
            const errorMessage = (error as Error).message;
            await interaction.editReply({
                content: `There was an error deleting the sticky message: ${errorMessage}`,
            });
            return;
        }
    },
};
