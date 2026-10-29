import { DiscordAPIError, PermissionFlagsBits } from 'discord.js';
import { BUTTON_IDS } from '../lib/constants.js';
import { checkBotPermissions, checkRoleHierarchy, resolveWargaRole } from '../lib/guards.js';
import { applyWargaNickname } from '../lib/nickname.js';
import { createAlreadyWargaEmbed, createWargaSuccessEmbed } from '../ui/embeds.js';
import { CONFIG } from '../config/index.js';

/**
 * Button: "Ambil Role Warga"
 * Memberikan role Warga kepada member yang menekan tombol, lalu menyesuaikan nickname.
 */
export default {
  customId: BUTTON_IDS.TAKE_ROLE_WARGA,

  /** @param {import('discord.js').ButtonInteraction} interaction */
  async execute(interaction) {
    // Gunakan deferReply ephemeral agar aman dari batas 3 detik Discord API
    await interaction.deferReply({ ephemeral: true });

    try {
      const { guild, member, user } = interaction;
      const botMember = guild.members.me;

      // 1. Validasi permission bot
      const permissionsCheck = checkBotPermissions(
        botMember,
        [PermissionFlagsBits.ManageRoles],
        '❌ Bot tidak memiliki izin **Manage Roles** untuk memberikan role. Hubungi Administrator.'
      );

      if (!permissionsCheck.ok) {
        console.warn('[WARN] Bot tidak memiliki permission ManageRoles.');
        return await interaction.editReply({ content: permissionsCheck.message });
      }

      // 2. Fetch data role Warga
      const { role: wargaRole, result: roleCheck } = await resolveWargaRole(
        guild,
        CONFIG.wargaRoleId,
        '❌ Role Warga tidak ditemukan pada server ini. Silakan hubungi Administrator.'
      );

      if (!roleCheck.ok) {
        return await interaction.editReply({ content: roleCheck.message });
      }

      // 3. Validasi hierarki role
      const hierarchyCheck = checkRoleHierarchy(
        botMember,
        wargaRole,
        '❌ Bot tidak dapat memberikan role ini karena posisi role bot berada di bawah atau sejajar dengan role Warga. Hubungi Administrator.'
      );

      if (!hierarchyCheck.ok) {
        return await interaction.editReply({ content: hierarchyCheck.message });
      }

      // 4. Pastikan data member up-to-date
      const targetMember = await guild.members.fetch(user.id).catch(() => member);

      // 5. Cek apakah member sudah memiliki role Warga
      if (targetMember.roles.cache.has(CONFIG.wargaRoleId)) {
        return await interaction.editReply({ embeds: [createAlreadyWargaEmbed()] });
      }

      // 6. Berikan role Warga
      await targetMember.roles.add(wargaRole);

      // 7. Sesuaikan nickname menjadi "Warga | namauser"
      const nicknameState = await applyWargaNickname(targetMember, botMember, guild.ownerId);

      // 8. Kirim notifikasi sukses
      return await interaction.editReply({ embeds: [createWargaSuccessEmbed(nicknameState)] });
    } catch (error) {
      console.error(`[ERROR] Gagal memberikan role kepada ${interaction.user.tag}:`, error);

      let errorNotice = '❌ Terjadi kesalahan saat memproses role kamu. Silakan hubungi Administrator.';

      if (error instanceof DiscordAPIError) {
        if (error.code === 50013) {
          errorNotice = '❌ Bot kekurangan hak akses (Missing Permissions). Pastikan role bot berada di atas role Warga.';
        } else if (error.code === 10011) {
          errorNotice = '❌ Role Warga tidak ditemukan di server ini.';
        }
      }

      return await interaction.editReply({ content: errorNotice }).catch(() => null);
    }
  },
};
