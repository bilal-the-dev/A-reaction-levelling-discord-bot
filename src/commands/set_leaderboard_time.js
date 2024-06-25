const { CommandType } = require("wokcommands");
const { PermissionFlagsBits } = require("discord.js");
const ms = require("ms");
const fs = require("fs");

const {
	handleInteractionError,
	replyOrEditInteraction,
} = require("../utils/interaction");
const config = require("./../../config.json");

module.exports = {
	// Required for slash commands
	description: "Set points for leaderboard",
	guildOnly: true,
	permissions: [PermissionFlagsBits.Administrator],
	options: [
		{
			name: "time",
			description: "All Time, 3 days, 4 weeks, 5 months",
			type: 3,
			required: true,
		},
	],
	// Create a legacy and slash command
	type: CommandType.SLASH,

	callback: async ({ interaction }) => {
		try {
			await interaction.deferReply();
			const { options } = interaction;
			const durationString = options.getString("time");

			let milliseconds = durationString;

			if (durationString !== "All Time")
				milliseconds = durationToMilliseconds(durationString);

			console.log(milliseconds);
			config.leaderboardTime = { str: durationString, ms: milliseconds };

			fs.writeFileSync(
				`${__dirname}/../../config.json`,
				JSON.stringify(config)
			);
			await replyOrEditInteraction(
				interaction,
				"Success, added the configuration!"
			);
		} catch (err) {
			await handleInteractionError(err, interaction);
		}
	},
};
// Function to convert months to milliseconds
function monthsToMilliseconds(months) {
	// Average month length in milliseconds (30.44 days)
	const avgMonthMs = 30 * 24 * 60 * 60 * 1000;
	return months * avgMonthMs;
}
// Function to convert a duration string to milliseconds
function durationToMilliseconds(durationString) {
	// Check if the string contains 'month'
	if (durationString.includes("months") || durationString.includes("month")) {
		const numMonths = parseInt(durationString.split(" ")[0], 10);
		if (isNaN(numMonths)) {
			throw new Error("Invalid duration string");
		}
		return monthsToMilliseconds(numMonths);
	} else {
		// Use the ms module for other durations
		const milliseconds = ms(durationString);
		if (milliseconds === undefined) {
			throw new Error("Invalid duration string");
		}
		return milliseconds;
	}
}
