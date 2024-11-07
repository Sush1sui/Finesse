import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    PermissionFlagsBits,
    SlashCommandBuilder,
    TextChannel,
} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("send_embed")
        .setDescription("Sends embed on a target channel")
        .addChannelOption((option) =>
            option
                .setName("channel")
                .setDescription("target channel")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option.setName("title").setDescription("title of the embed")
        )
        .addStringOption((option) =>
            option.setName("author").setDescription("author of the embed")
        )
        .addStringOption((option) =>
            option
                .setName("author_url")
                .setDescription("url of author in the embed")
        )
        .addStringOption((option) =>
            option
                .setName("author_icon_url")
                .setDescription("url icon of author in the embed")
        )
        .addStringOption((option) =>
            option
                .setName("paragraph_1")
                .setDescription("paragraph of the embed")
        )
        .addStringOption((option) =>
            option
                .setName("paragraph_2")
                .setDescription("paragraph of the embed")
        )
        .addStringOption((option) =>
            option
                .setName("paragraph_3")
                .setDescription("paragraph of the embed")
        )
        .addStringOption((option) =>
            option
                .setName("paragraph_4")
                .setDescription("paragraph of the embed")
        )
        .addStringOption((option) =>
            option
                .setName("paragraph_5")
                .setDescription("paragraph of the embed")
        )
        .addStringOption((option) =>
            option
                .setName("paragraph_6")
                .setDescription("paragraph of the embed")
        )
        .addStringOption((option) =>
            option
                .setName("paragraph_7")
                .setDescription("paragraph of the embed")
        )
        .addStringOption((option) =>
            option
                .setName("paragraph_8")
                .setDescription("paragraph of the embed")
        )
        .addStringOption((option) =>
            option
                .setName("paragraph_9")
                .setDescription("paragraph of the embed")
        )
        .addStringOption((option) =>
            option
                .setName("paragraph_10")
                .setDescription("paragraph of the embed")
        )
        .addStringOption((option) =>
            option.setName("footer").setDescription("footer of the embed")
        )
        .addStringOption((option) =>
            option
                .setName("footer_icon_url")
                .setDescription("icon url of footer in the embed")
        )
        .addAttachmentOption((option) =>
            option.setName("image").setDescription("image of the embed")
        )
        .addAttachmentOption((option) =>
            option.setName("thumbnail").setDescription("thumbnail of the embed")
        )
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
            const channel = interaction.options.getChannel("channel");

            if (!channel) {
                await interaction.editReply({
                    content: "Channel is required.",
                });
                return;
            }

            const title = interaction.options.getString("title") || null;
            const author = interaction.options.getString("author") || null;
            const author_url =
                interaction.options.getString("author_url") || null;
            const author_icon_url =
                interaction.options.getString("author_icon_url") || null;
            const paragraph_1 =
                interaction.options.getString("paragraph_1") || null;
            const paragraph_2 =
                interaction.options.getString("paragraph_2") || null;
            const paragraph_3 =
                interaction.options.getString("paragraph_3") || null;
            const paragraph_4 =
                interaction.options.getString("paragraph_4") || null;
            const paragraph_5 =
                interaction.options.getString("paragraph_5") || null;
            const paragraph_6 =
                interaction.options.getString("paragraph_6") || null;
            const paragraph_7 =
                interaction.options.getString("paragraph_7") || null;
            const paragraph_8 =
                interaction.options.getString("paragraph_8") || null;
            const paragraph_9 =
                interaction.options.getString("paragraph_9") || null;
            const paragraph_10 =
                interaction.options.getString("paragraph_10") || null;
            const footer = interaction.options.getString("footer") || null;
            const footer_icon_url =
                interaction.options.getString("footer_icon_url") || null;
            const image = interaction.options.getAttachment("image") || null;
            const thumbnail =
                interaction.options.getAttachment("thumbnail") || null;

            const embed = new EmbedBuilder();

            if (title !== null) {
                embed.setTitle(title);
            }
            if (author !== null) {
                embed.setAuthor({
                    name: author,
                    url: author_url || undefined,
                    iconURL: author_icon_url || undefined,
                });
            }

            const embedDescription = `${
                paragraph_1 ? paragraph_1.replace(/\\n/g, "\n") ?? "" : ""
            }
${paragraph_2 ? paragraph_2.replace(/\\n/g, "\n") ?? "" : ""}
${paragraph_3 ? paragraph_3.replace(/\\n/g, "\n") ?? "" : ""}
${paragraph_4 ? paragraph_4.replace(/\\n/g, "\n") ?? "" : ""}
${paragraph_5 ? paragraph_5.replace(/\\n/g, "\n") ?? "" : ""}
${paragraph_6 ? paragraph_6.replace(/\\n/g, "\n") ?? "" : ""}
${paragraph_7 ? paragraph_7.replace(/\\n/g, "\n") ?? "" : ""}
${paragraph_8 ? paragraph_8.replace(/\\n/g, "\n") ?? "" : ""}
${paragraph_9 ? paragraph_9.replace(/\\n/g, "\n") ?? "" : ""}
${paragraph_10 ? paragraph_10.replace(/\\n/g, "\n") ?? "" : ""}`;

            if (embedDescription.length > 6000) {
                await interaction.editReply({
                    content:
                        "Embed description is too long. Please shorten it.",
                });
                return;
            }
            embed.setDescription(embedDescription);

            if (footer !== null) {
                embed.setFooter({
                    text: footer,
                    iconURL: footer_icon_url || undefined,
                });
            }
            if (image !== null) {
                embed.setImage(image.url);
            }
            if (thumbnail !== null) {
                embed.setThumbnail(thumbnail.url);
            }

            await (channel as TextChannel).send({
                embeds: [embed],
            });

            await interaction.editReply({
                content: `Embed sent to ${channel}`,
            });
        } catch (error) {
            console.log(error);
            const errorMessage = (error as Error).message;
            await interaction.editReply({
                content: `There was an error sending the embed message: ${errorMessage}`,
            });
            return;
        }
    },
};

// /send_embed channel:#💎︱colors	 paragraph_1:- :OniYellow: - @Yellow Onigiri paragraph_2:- :OniBlack: - @Black Onigiri paragraph_3:- :OniBlue: - @Blue Onigiri paragraph_4:- :OniGreen: - @Green Onigiri paragraph_5:- :OniOrange: - @Orange Onigiri paragraph_6:- :OniPink: - @Pink Onigiri paragraph_7:- :OniPurple: - @Purple Onigiri paragraph_8:- :OniRed: - @Red Onigiri paragraph_9:- :OniWhite: - @White Onigiri footer:Do it with Finesse™ title:Onigiri Color Roles image: thumbnail:
