const reactionMap = require("../../cache/reactionMap");
const config = require("./../../../config.json");

module.exports = async (reaction, { id: reactorId }) => {
	try {
		if (reaction.partial) await reaction.fetch();

		const { message } = reaction;

		if (!message.inGuild()) return;

		const {
			author: { id: authorId },
			id: messageId,
		} = message;

		if (reactorId === authorId) return;

		console.log(reactionMap);

		const identifier = reaction.emoji.id ?? reaction.emoji.name;

		const points = config.specialPoints[identifier] ?? 1;

		reactionMap.addPoints(
			messageId,
			authorId,
			reactorId,
			reaction.emoji,
			points
		);
	} catch (error) {
		console.log(error);
	}
};
