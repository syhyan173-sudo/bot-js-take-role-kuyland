import 'dotenv/config';

/**
 * Daftar environment variable yang wajib tersedia agar bot dapat berjalan.
 * @type {readonly string[]}
 */
export const REQUIRED_ENV = Object.freeze([
  'DISCORD_TOKEN',
  'CLIENT_ID',
  'GUILD_ID',
  'WARGA_ROLE_ID',
]);

/**
 * Mengembalikan daftar environment variable yang belum diisi.
 * @param {readonly string[]} [keys=REQUIRED_ENV]
 * @returns {string[]}
 */
export function getMissingEnv(keys = REQUIRED_ENV) {
  return keys.filter((key) => !process.env[key]);
}

/**
 * Menghentikan proses bila ada environment variable yang hilang.
 * @param {readonly string[]} [keys=REQUIRED_ENV]
 * @param {string} [label='Konfigurasi tidak lengkap. Variabel berikut hilang di .env']
 */
export function assertEnv(keys = REQUIRED_ENV, label = 'Konfigurasi tidak lengkap. Variabel berikut hilang di .env') {
  const missingEnv = getMissingEnv(keys);

  if (missingEnv.length > 0) {
    console.error(`[FATAL] ${label}: ${missingEnv.join(', ')}`);
    process.exit(1);
  }
}

/**
 * Memastikan nilai berupa Discord Snowflake (ID numerik).
 * @param {string} name
 * @param {string} value
 * @returns {boolean}
 */
function isValidSnowflake(name, value) {
  if (/^\d{17,20}$/.test(value)) return true;

  console.error(`[FATAL] ${name} harus berupa ID Discord (17-20 digit angka), bukan "${value}".`);
  return false;
}

assertEnv();

const invalidEnv = [
  ['CLIENT_ID', process.env.CLIENT_ID],
  ['GUILD_ID', process.env.GUILD_ID],
  ['WARGA_ROLE_ID', process.env.WARGA_ROLE_ID],
].filter(([name, value]) => !isValidSnowflake(name, value));

if (invalidEnv.length > 0) {
  console.error('[FATAL] Periksa kembali nilai ID di file .env.');
  process.exit(1);
}

/**
 * Konfigurasi terpusat bot (dibaca sekali saat modul di-load).
 */
export const CONFIG = Object.freeze({
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.CLIENT_ID,
  guildId: process.env.GUILD_ID,
  wargaRoleId: process.env.WARGA_ROLE_ID,
});

export default CONFIG;
