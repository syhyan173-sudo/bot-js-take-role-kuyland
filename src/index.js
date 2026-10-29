import { createClient } from './lib/client.js';
import { loadCommands, loadButtons } from './handlers/loaders.js';
import { loadEvents } from './handlers/loadEvents.js';
import { CONFIG } from './config/index.js';

/**
 * Titik masuk bot: inisialisasi client, muat command/button/event, lalu login.
 */
async function main() {
  const client = createClient();

  // Wadah registry agar mudah diakses dari event mana pun.
  client.commands = new Map();
  client.buttons = new Map();

  const [commandCount, buttonCount, eventCount] = await Promise.all([
    loadCommands(client),
    loadButtons(client),
    loadEvents(client),
  ]);

  console.log(`[INFO] Dimuat: ${commandCount} command, ${buttonCount} button, ${eventCount} event.`);

  // Global error handling
  process.on('unhandledRejection', (reason) => {
    console.error('[UNHANDLED REJECTION]', reason);
  });

  process.on('uncaughtException', (error) => {
    console.error('[UNCAUGHT EXCEPTION]', error);
  });

  // Login bot
  await client.login(CONFIG.token).catch((err) => {
    console.error('[FATAL] Gagal login ke Discord. Periksa kembali DISCORD_TOKEN di file .env.');
    console.error(err.message);
    process.exit(1);
  });
}

main().catch((error) => {
  console.error('[FATAL] Gagal menjalankan bot:', error);
  process.exit(1);
});
