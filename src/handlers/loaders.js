import { readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Mengambil seluruh file JavaScript di dalam sebuah folder (non-rekursif).
 * @param {string} folder
 * @param {string} baseDir
 * @returns {string[]} Daftar path absolut file .js
 */
function getJsFiles(folder, baseDir) {
  const absoluteDir = join(baseDir, folder);

  return readdirSync(absoluteDir)
    .filter((file) => file.endsWith('.js'))
    .map((file) => join(absoluteDir, file));
}

/**
 * Memuat semua slash command ke dalam Map pada client.
 * @param {import('discord.js').Client} client
 * @returns {Promise<number>} Jumlah command yang dimuat.
 */
export async function loadCommands(client) {
  const files = getJsFiles('../commands', __dirname);

  for (const file of files) {
    const { default: command } = await import(pathToFileURL(file).href);

    if (!command?.data || typeof command.execute !== 'function') {
      console.warn(`[WARN] Command dilewati (format tidak valid): ${file}`);
      continue;
    }

    client.commands.set(command.data.name, command);
  }

  return client.commands.size;
}

/**
 * Memuat semua handler button ke dalam Map pada client.
 * @param {import('discord.js').Client} client
 * @returns {Promise<number>} Jumlah button yang dimuat.
 */
export async function loadButtons(client) {
  const files = getJsFiles('../buttons', __dirname);

  for (const file of files) {
    const { default: button } = await import(pathToFileURL(file).href);

    if (!button?.customId || typeof button.execute !== 'function') {
      console.warn(`[WARN] Button dilewati (format tidak valid): ${file}`);
      continue;
    }

    client.buttons.set(button.customId, button);
  }

  return client.buttons.size;
}
