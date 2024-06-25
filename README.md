# Reaction Leveling Bot

This Discord bot provides a reaction leveling system where the bot reacts to messages with emojis and dynamically updates leaderboards based on user reactions.

## Features

- **Dynamic Leaderboard**: Set up a leaderboard with a command and keep it updated in a specific channel every minute.
- **Add Points**: Manually add custom points to a user.
- **Set Custom Points**: Define points for specific emojis. Each reaction with a designated emoji awards points to the message author.
- **Set Leaderboard Time**: Configure the time range for the dynamic leaderboard updates, showing reactions and scores from the specified duration.

## Commands

### /leaderboard

- **Description**: Start or update a dynamic leaderboard in a channel.
- **Usage**: `/leaderboard`

### /add_point

- **Description**: Add custom points to a user.
- **Usage**: `/add_point [amount] @user`

### /set_custom_points

- **Description**: Set points for specific emojis.
- **Usage**: `/set_custom_points [amount]`
- **Note**: After invoking this command, the bot will prompt you to ask with the emoji you want to assign points to.

### /set_leaderboard_time

- **Description**: Set the time duration for the dynamic leaderboard.
- **Usage**: `/set_leaderboard_time [time]`
- **Example**: `/set_leaderboard_time 40m` (for the last 40 minutes), `/set_leaderboard_time All Time` (for all-time records).

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/reaction-leveling-bot.git
   cd reaction-leveling-bot
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   Create a `.env` file in the root directory and add your Discord bot token:

   ```
   TOKEN=your_discord_bot_token
   ```

4. Create configuration files:

Copy sample.data.json to data.json:

```bash
cp sample.data.json data.json
```

Copy sample.config.json to config.json:

```bash
cp sample.config.json config.json
```

5. Start the bot:

   ```bash
   npm start
   ```

## Contributing

Contributions are welcome! Please fork the repository and submit pull requests.
