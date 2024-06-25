const reactionMap = require("../../cache/reactionMap");

module.exports = async (reaction, { id: reactorId }) => {
	try {
		if (reaction.partial) await reaction.fetch();

		const { message } = reaction;

		if (!message.inGuild()) return;

		const {
			author: { id: authorId },
			id: messageId,
			guild,
		} = message;

		if (guild.id !== process.env.GUILD_ID) return;

		reactionMap.removePoints(authorId, reactorId, messageId, reaction.emoji);
	} catch (error) {
		console.log(error);
	}
};
