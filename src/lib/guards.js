import { PermissionFlagsBits } from 'discord.js';

/**
 * Hasil validasi standar.
 * @typedef {{ ok: true } | { ok: false, message: string }} GuardResult
 */

/**
 * Memastikan bot memiliki permission yang dibutuhkan di guild.
 * @param {import('discord.js').GuildMember|null|undefined} botMember
 * @param {bigint[]} permissions
 * @param {string} message Pesan error bila permission tidak terpenuhi.
 * @returns {GuardResult}
 */
export function checkBotPermissions(botMember, permissions, message) {
  if (!botMember) {
    return { ok: false, message: '❌ Data member bot tidak tersedia. Coba lagi beberapa saat lagi.' };
  }

  const hasAll = permissions.every((permission) => botMember.permissions.has(permission));
  return hasAll ? { ok: true } : { ok: false, message };
}

/**
 * Memastikan role Warga tersedia di guild.
 * @param {import('discord.js').Guild} guild
 * @param {string} roleId
 * @param {string} message Pesan error bila role tidak ditemukan.
 * @returns {Promise<{ role: import('discord.js').Role|null, result: GuardResult }>}
 */
export async function resolveWargaRole(guild, roleId, message) {
  const role = await guild.roles.fetch(roleId).catch(() => null);
  return role ? { role, result: { ok: true } } : { role: null, result: { ok: false, message } };
}

/**
 * Memastikan posisi role bot berada di atas role target (agar bisa diberikan).
 * @param {import('discord.js').GuildMember} botMember
 * @param {import('discord.js').Role} role
 * @param {string} message Pesan error bila hierarki tidak valid.
 * @returns {GuardResult}
 */
export function checkRoleHierarchy(botMember, role, message) {
  const isValid = botMember.roles.highest.position > role.position;
  return isValid ? { ok: true } : { ok: false, message };
}

/**
 * Permission minimal agar bot dapat menjalankan command /setup-warga.
 * @type {readonly bigint[]}
 */
export const SETUP_REQUIRED_PERMISSIONS = Object.freeze([
  PermissionFlagsBits.ManageRoles,
  PermissionFlagsBits.ManageNicknames,
]);

export default {
  checkBotPermissions,
  resolveWargaRole,
  checkRoleHierarchy,
  SETUP_REQUIRED_PERMISSIONS,
};
