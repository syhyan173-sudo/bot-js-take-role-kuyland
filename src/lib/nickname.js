import { PermissionFlagsBits } from 'discord.js';
import { NICKNAME_MAX_LENGTH, NICKNAME_PREFIX } from './constants.js';

/**
 * Membersihkan nama dasar user dengan membuang prefix "Warga | " yang sudah ada.
 * @param {string} currentName
 * @returns {string}
 */
export function stripNicknamePrefix(currentName) {
  return currentName.replace(/^Warga\s*\|\s*/i, '').trim();
}

/**
 * Menyusun nickname baru berformat "Warga | nama" dengan batas 32 karakter.
 * @param {string} currentName Nama saat ini (nickname/displayName/username).
 * @returns {string}
 */
export function buildWargaNickname(currentName) {
  const baseName = stripNicknamePrefix(currentName);
  const maxBaseLength = NICKNAME_MAX_LENGTH - NICKNAME_PREFIX.length;
  const finalBaseName = baseName.length > maxBaseLength ? baseName.slice(0, maxBaseLength) : baseName;
  return `${NICKNAME_PREFIX}${finalBaseName}`;
}

/**
 * Mencoba mengubah nickname member menjadi format warga.
 * Mengembalikan status beserta catatan opsional untuk ditampilkan ke user.
 *
 * @param {import('discord.js').GuildMember} targetMember
 * @param {import('discord.js').GuildMember} botMember
 * @param {string} guildOwnerId
 * @returns {Promise<{ changed: boolean, nickname: string, notice: string }>}
 */
export async function applyWargaNickname(targetMember, botMember, guildOwnerId) {
  const newNickname = buildWargaNickname(
    targetMember.nickname || targetMember.user.displayName || targetMember.user.username
  );

  // Sudah sesuai format, tidak perlu diubah.
  if (targetMember.nickname === newNickname) {
    return { changed: false, nickname: newNickname, notice: '' };
  }

  if (guildOwnerId === targetMember.id) {
    return {
      changed: false,
      nickname: newNickname,
      notice: '\n\n*(Catatan: Nickname tidak dapat diubah otomatis karena kamu adalah Pemilik Server).*',
    };
  }

  if (!botMember.permissions.has(PermissionFlagsBits.ManageNicknames)) {
    console.warn('[WARN] Bot tidak memiliki permission ManageNicknames.');
    return {
      changed: false,
      nickname: newNickname,
      notice: '\n\n*(Catatan: Bot belum memiliki permission Manage Nicknames untuk mengubah nama).*',
    };
  }

  if (botMember.roles.highest.position <= targetMember.roles.highest.position) {
    return {
      changed: false,
      nickname: newNickname,
      notice: '\n\n*(Catatan: Posisi role kamu setara atau lebih tinggi dari bot sehingga nama tidak dapat diubah).*',
    };
  }

  try {
    await targetMember.setNickname(newNickname, 'Otomatisasi Take Role Warga KUYLAND ROLEPLAY');
    return { changed: true, nickname: newNickname, notice: '' };
  } catch (nickError) {
    console.error(`[WARN] Gagal mengubah nickname ${targetMember.user.tag}:`, nickError.message);
    return { changed: false, nickname: newNickname, notice: '' };
  }
}

export default { stripNicknamePrefix, buildWargaNickname, applyWargaNickname };
