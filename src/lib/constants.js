/**
 * Konstanta global bot: warna embed, footer, custom ID komponen, dan prefix nickname.
 * Semua nilai visual/identitas dipusatkan di sini agar mudah diubah.
 */

/** Palet warna embed (hex) bertema GTA SA-MP sunset. */
export const COLORS = Object.freeze({
  PRIMARY: 0xE67E22, // Oranye keemasan elegan
  SUCCESS: 0x2ECC71, // Hijau sukses
  WARNING: 0xF39C12, // Oranye peringatan
});

/** Teks footer standar pada semua embed. */
export const FOOTER_TEXT = 'KUYLAND ROLEPLAY • Citizen Verification';

/** Kumpulan custom ID untuk komponen interaktif (button, modal, dsb). */
export const BUTTON_IDS = Object.freeze({
  TAKE_ROLE_WARGA: 'take_role_warga',
});

/** Nama slash command. */
export const COMMAND_NAMES = Object.freeze({
  SETUP_WARGA: 'setup-warga',
});

/** Prefix nickname otomatis untuk warga. */
export const NICKNAME_PREFIX = 'Warga | ';

/** Batas maksimal panjang nickname di Discord. */
export const NICKNAME_MAX_LENGTH = 32;
