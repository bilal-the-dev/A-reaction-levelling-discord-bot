const { CommandType } = require("wokcommands");
const { PermissionFlagsBits } = require("discord.js");

const {
	handleInteractionError,
	replyOrEditInteraction,
} = require("../utils/interaction");
const reactionMap = require("../cache/reactionMap");
module.exports = {
	// Required for slash commands
	description: "Add points to a user ",

	// permissions: [PermissionFlagsBits.Administrator],
	options: [
		{
			name: "user",
			description: "user to add ",
			type: 6,
			required: true,
		},
		{
			name: "amount",
			description: "amount to add",
			type: 10,
			required: true,
		},
	],
	// Create a legacy and slash command
	type: CommandType.SLASH,

	callback: async ({ interaction }) => {
		try {
			await interaction.deferReply();
			const { options } = interaction;
			const { id } = options.getUser("user");
			const amount = options.getNumber("amount");

			reactionMap.addCustomPoints(id, amount);

			await replyOrEditInteraction(interaction, "Success, added the points!");
		} catch (err) {
			await handleInteractionError(err, interaction);
		}
	},
};
