const fs = require("fs");

const { CommandType } = require("wokcommands");
const { PermissionFlagsBits } = require("discord.js");

const config = require("./../../config.json");
const { handleInteractionError } = require("../utils/interaction");
module.exports = {
	// Required for slash commands
	description: "Add custom points",
	guildOnly: true,
	permissions: [PermissionFlagsBits.Administrator],
	options: [
		{
			name: "amount",
			description: "amount to add",
			type: 10,
			required: true,
		},
	],
	type: CommandType.SLASH,

	callback: async ({ interaction }) => {
		const { channel, options, user } = interaction;
		try {
			const amount = options.getNumber("amount");

			await interaction.reply(
				"Please send the emoji you want to add points for"
			);

			let identifer;

			const collectorFilter = (m) => m.author.id === user.id;

			const collector = channel.createMessageCollector({
				filter: collectorFilter,
				time: 1000 * 60,
			});

			collector.on("collect", (message) => {
				const customEmojiRegex = /<(a)?:([a-zA-Z0-9_]+):(\d+)>/;
				const normalEmojiRegex =
					/(\p{Emoji_Presentation}|\p{Extended_Pictographic})/u;

				const content = message.content;

				const customEmojiMatch = content.match(customEmojiRegex);

				if (customEmojiMatch) {
					identifer = customEmojiMatch[3]; // Capture the ID part
					collector.stop();
				}

				if (!customEmojiMatch) {
					const normalEmojiMatch = content.match(normalEmojiRegex);

					if (!normalEmojiMatch) return;

					identifer = normalEmojiMatch[0];
					collector.stop();
				}
			});

			collector.on("end", async (collected) => {
				if (!identifer)
					return await channel.send(
						"Timeout, please run the cmd again to add points."
					);

				config["specialPoints"][identifer] = amount;

				fs.writeFileSync(
					`${__dirname}/../../config.json`,
					JSON.stringify(config)
				);

				await channel.send("Success, added the custom points for the emoji.");
			});
		} catch (err) {
			await handleInteractionError(err, interaction);
		}
	},
};
