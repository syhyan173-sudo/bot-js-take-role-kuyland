import 'dotenv/config';
import { REST, Routes } from 'discord.js';
import { assertEnv, CONFIG } from '../src/config/index.js';
import { loadCommands } from '../src/handlers/loaders.js';
import { createClient } from '../src/lib/client.js';

// Deploy hanya membutuhkan token, client ID, dan guild ID (role Warga tidak dipakai di sini).
assertEnv(['DISCORD_TOKEN', 'CLIENT_ID', 'GUILD_ID'], 'Variabel environment berikut belum diisi di file .env');

const rest = new REST({ version: '10' }).setToken(CONFIG.token);

/**
 * Mengumpulkan payload JSON dari seluruh slash command di src/commands.
 * @returns {Promise<object[]>}
 */
async function getCommandPayloads() {
  const client = createClient();
  client.commands = new Map();
  client.buttons = new Map();

  await loadCommands(client);

  return [...client.commands.values()].map((command) => command.data.toJSON());
}

async function deploy() {
  try {
    console.log('[INFO] Memulai proses registrasi slash command...');

    const commands = await getCommandPayloads();

    const data = await rest.put(
      Routes.applicationGuildCommands(CONFIG.clientId, CONFIG.guildId),
      { body: commands }
    );

    console.log(`[SUKSES] Berhasil mendaftarkan ${data.length} slash command ke server (Guild ID: ${CONFIG.guildId}).`);
    console.log('[SUKSES] Perintah /setup-warga sekarang siap digunakan oleh Administrator!');
  } catch (error) {
    console.error('[ERROR] Gagal mendaftarkan slash command:');
    console.error(error);
    process.exit(1);
  }
}

deploy();
