const fs = require("fs");

const { CommandType } = require("wokcommands");
const { PermissionFlagsBits } = require("discord.js");

const config = require("./../../config.json");
const { handleInteractionError } = require("../utils/interaction");
module.exports = {
	// Required for slash commands
	description: "Setup leaderboard",
	// permissions: [PermissionFlagsBits.Administrator],
	// Create a legacy and slash command
	type: CommandType.SLASH,

	callback: async ({ interaction }) => {
		const { channel } = interaction;
		try {
			await interaction.reply("Sent");
			await interaction.deleteReply();

			const m = await channel.send("Leaderboard Message");
			config.leaderboardConfig = { channelId: channel.id, messageId: m.id };

			fs.writeFileSync(
				`${__dirname}/../../config.json`,
				JSON.stringify(config)
			);
		} catch (err) {
			await handleInteractionError(err, interaction);
		}
	},
};
