import { readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Memuat dan mendaftarkan seluruh event dari folder src/events.
 * Mendukung event factory (default export berupa fungsi yang menerima client)
 * maupun objek event statis ({ name, once, execute }).
 *
 * @param {import('discord.js').Client} client
 * @returns {Promise<number>} Jumlah event yang terdaftar.
 */
export async function loadEvents(client) {
  const eventsDir = join(__dirname, '../events');

  const files = readdirSync(eventsDir).filter((file) => file.endsWith('.js'));
  let registered = 0;

  for (const file of files) {
    const module = await import(pathToFileURL(join(eventsDir, file)).href);

    const resolved = typeof module.default === 'function' ? module.default(client) : module.default;

    if (!resolved?.name || typeof resolved.execute !== 'function') {
      console.warn(`[WARN] Event dilewati (format tidak valid): ${file}`);
      continue;
    }

    if (resolved.once) {
      client.once(resolved.name, (...args) => resolved.execute(...args));
    } else {
      client.on(resolved.name, (...args) => resolved.execute(...args));
    }

    registered += 1;
  }

  return registered;
}

export default loadEvents;
