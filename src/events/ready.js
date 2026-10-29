import { ActivityType, Events } from 'discord.js';
import { COMMAND_NAMES } from '../lib/constants.js';
import { CONFIG } from '../config/index.js';

export default {
  name: Events.ClientReady,
  once: true,

  /** @param {import('discord.js').Client<true>} readyClient */
  execute(readyClient) {
    console.log('========================================================');
    console.log(`[ONLINE] Berhasil login sebagai: ${readyClient.user.tag}`);
    console.log(`[INFO] Server (Guild ID) yang dipantau: ${CONFIG.guildId}`);
    console.log(`[INFO] Target Role Warga ID: ${CONFIG.wargaRoleId}`);
    console.log('========================================================');

    readyClient.user.setActivity(`KUYLAND ROLEPLAY | /${COMMAND_NAMES.SETUP_WARGA}`, {
      type: ActivityType.Watching,
    });
  },
};
