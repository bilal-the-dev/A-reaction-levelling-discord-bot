const fs = require("fs");

const {
	Client,
	IntentsBitField,
	Partials,
	EmbedBuilder,
} = require("discord.js");
const WOK = require("wokcommands");
const path = require("path");
const dotenv = require("dotenv");
const cron = require("node-cron");

const reactionMap = require("./cache/reactionMap");
const config = require("./../config.json");

const { DefaultCommands } = WOK;
dotenv.config();

const { TOKEN } = process.env;

const client = new Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.GuildMembers,
		IntentsBitField.Flags.MessageContent,
		IntentsBitField.Flags.GuildMessageReactions,
	],
	partials: [Partials.Message, Partials.Reaction],
});

client.on("ready", async (readyClient) => {
	readyClient.application.commands.set([]);
	// client.guilds.cache.get("1239804781468586024").commands.set([]);
	console.log(`${readyClient.user.username} is running 🧶`);

	cron.schedule("* * * * *", writePointsToJSON);
	cron.schedule("* * * * *", showDynamicLeaderboard);

	showDynamicLeaderboard();
	new WOK({
		client,
		commandsDir: path.join(__dirname, "./commands"),
		events: {
			dir: path.join(__dirname, "events"),
		},
		disabledDefaultCommands: [
			DefaultCommands.ChannelCommand,
			DefaultCommands.CustomCommand,
			DefaultCommands.Prefix,
			DefaultCommands.RequiredPermissions,
			DefaultCommands.RequiredRoles,
			DefaultCommands.ToggleCommand,
		],
		cooldownConfig: {
			errorMessage: "Please wait {TIME} before doing that again.",
			botOwnersBypass: false,
			dbRequired: 300,
		},
	});
});
client.login(TOKEN);

function writePointsToJSON() {
	fs.writeFile(
		`${__dirname}/../data.json`,
		JSON.stringify(reactionMap.data),
		(err) => {
			if (err) console.log(err);
		}
	);
}

async function showDynamicLeaderboard() {
	const { leaderboardConfig } = config;

	const channel = client.channels.cache.get(leaderboardConfig.channelId);
	const message = await channel?.messages.fetch(leaderboardConfig.messageId);

	if (!message) return;

	const targetTime = Date.now() - config.leaderboardTime.ms;

	try {
		const { data } = reactionMap;

		const dataArray = Object.entries(data);
		const scores = [];

		for (const [userId, pointsArray] of dataArray) {
			if (!pointsArray) continue;

			let cb = (acc, cur) => acc + (cur.points ?? 0);

			if (config.leaderboardTime.str !== "All Time")
				cb = (acc, cur) => {
					console.log(acc);
					console.log(cur);
					console.log(cur.reactedAt < targetTime);
					if (new Date(cur.reactedAt).getTime() < targetTime) return acc;
					else return acc + (cur.points ?? 0);
				};

			const pointsSum = pointsArray.reduce(cb, 0);

			scores.push({ userId, pointsSum });
		}
		scores.sort((a, b) => b.pointsSum - a.pointsSum);

		console.log(scores);

		let description = "";
		scores.forEach((entry, index) => {
			description += `**Rank ${index + 1}:** <@${entry.userId}> ~ \`${
				entry.pointsSum
			} points\`\n\n`;
		});

		if (!description) return;

		const embed = new EmbedBuilder()
			.setColor("#0099ff")
			.setTitle(`Leaderboard ( ${config.leaderboardTime.str} )`)
			.setDescription(description);

		await message.edit({ content: null, embeds: [embed] });
	} catch (error) {
		console.log(error);
	}
}
