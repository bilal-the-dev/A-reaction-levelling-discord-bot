const data = require("./../../data.json");

class ReactionMap {
	constructor() {
		this.reactionMap = data;
		this.data = this.reactionMap;
	}

	findPointObject(authorId, reactorId, messageId, emoji) {
		const identifier = emoji.id ?? emoji.name;

		const pointsArray = this.reactionMap[authorId];

		if (!pointsArray) return -1;

		console.log(pointsArray);
		return pointsArray.findIndex(
			(d) =>
				d.identifier === identifier &&
				d.reactorId === reactorId &&
				d.messageId === messageId
		);
	}

	addCustomPoints(authorId, points) {
		if (!this.reactionMap[authorId]) this.reactionMap[authorId] = [];

		this.reactionMap[authorId].push({
			reactedAt: new Date(),
			points,
		});
	}
	addPoints(messageId, authorId, reactorId, emoji, points) {
		if (!this.reactionMap[authorId]) this.reactionMap[authorId] = [];

		const identifier = emoji.id ?? emoji.name;

		this.reactionMap[authorId].push({
			reactedAt: new Date(),
			reactorId,
			identifier,
			points,
			messageId,
		});

		console.log(this.reactionMap[authorId]);
	}

	removePoints(authorId, reactorId, messageId, emoji) {
		const index = this.findPointObject(authorId, reactorId, messageId, emoji);

		console.log(index);

		if (index === -1) return;

		this.reactionMap[authorId].splice(index, 1);

		if (this.reactionMap[authorId].length === 0)
			this.reactionMap[authorId] = undefined;

		console.log(this.reactionMap[authorId]);
	}
}

module.exports = new ReactionMap();
