import {
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder,
} from "discord.js";
import { deleteAllStickyChannels } from "../../modules/stickyMessageModule";

export default {
    data: new SlashCommandBuilder()
        .setName("unset_all_sticky_channels")
        .setDescription("Unsets all sticky channels")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction: ChatInputCommandInteraction) {
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
            const success = await deleteAllStickyChannels();
            if (success === "sticky not found") {
                await interaction.editReply({
                    content: `Sticky Channels not found`,
                });
                return;
            }
            await interaction.editReply({
                content: `Sticky Channels has been unset`,
            });
            return;
        } catch (error) {
            const errorMessage = (error as Error).message;
            await interaction.editReply({
                content: `There was an error deleting sticky channels: ${errorMessage}`,
            });
            return;
        }
    },
};
