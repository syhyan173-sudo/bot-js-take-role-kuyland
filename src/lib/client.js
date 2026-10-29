import { Client, GatewayIntentBits } from 'discord.js';

/**
 * Membuat instance Discord Client dengan intent yang dibutuhkan bot.
 * @returns {Client}
 */
export function createClient() {
  return new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
    ],
  });
}

export default createClient;
