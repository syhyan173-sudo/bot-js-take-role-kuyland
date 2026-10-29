import { Events } from 'discord.js';

/**
 * Event: interactionCreate
 * Bertindak sebagai dispatcher yang mengarahkan interaksi ke command/button terkait
 * berdasarkan data yang sudah dimuat oleh handler.
 *
 * @param {import('discord.js').Client} client
 * @returns {{ name: string, execute: (interaction: import('discord.js').Interaction) => Promise<unknown> }}
 */
export function createInteractionCreateEvent(client) {
  return {
    name: Events.InteractionCreate,

    /** @param {import('discord.js').Interaction} interaction */
    async execute(interaction) {
      // Hanya tangani interaksi di dalam server (Guild)
      if (!interaction.inGuild()) return;

      // A. Slash Command
      if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);

        if (!command) {
          console.warn(`[WARN] Command tidak dikenal: ${interaction.commandName}`);
          return;
        }

        return command.execute(interaction);
      }

      // B. Button
      if (interaction.isButton()) {
        const button = client.buttons.get(interaction.customId);

        if (!button) return;

        return button.execute(interaction);
      }
    },
  };
}

export default createInteractionCreateEvent;
