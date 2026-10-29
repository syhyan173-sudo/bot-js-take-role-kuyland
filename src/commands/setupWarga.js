import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { COMMAND_NAMES } from '../lib/constants.js';
import {
  SETUP_REQUIRED_PERMISSIONS,
  checkBotPermissions,
  checkRoleHierarchy,
  resolveWargaRole,
} from '../lib/guards.js';
import { createWargaPanel } from '../ui/embeds.js';
import { CONFIG } from '../config/index.js';

/**
 * Command: /setup-warga
 * Mengirim panel Take Role Warga ke channel tempat command dijalankan.
 */
export default {
  data: new SlashCommandBuilder()
    .setName(COMMAND_NAMES.SETUP_WARGA)
    .setDescription('Mengirim panel Take Role Warga KUYLAND ROLEPLAY ke channel ini')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),

  /** @param {import('discord.js').ChatInputCommandInteraction} interaction */
  async execute(interaction) {
    try {
      // 1. Validasi hak akses Administrator user
      if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
        return await interaction.reply({
          content: '❌ Perintah ini hanya dapat dijalankan oleh Administrator.',
          ephemeral: true,
        });
      }

      // 2. Validasi permission bot (Manage Roles & Manage Nicknames)
      const botMember = interaction.guild.members.me;
      const permissionsCheck = checkBotPermissions(
        botMember,
        SETUP_REQUIRED_PERMISSIONS,
        '❌ Bot kekurangan izin. Pastikan bot memiliki **Manage Roles** (Kelola Peran) dan **Manage Nicknames** (Kelola Nama Panggilan) di server ini.'
      );

      if (!permissionsCheck.ok) {
        return await interaction.reply({ content: permissionsCheck.message, ephemeral: true });
      }

      // 3. Validasi keberadaan role Warga
      const { role: wargaRole, result: roleCheck } = await resolveWargaRole(
        interaction.guild,
        CONFIG.wargaRoleId,
        `❌ Role Warga dengan ID \`${CONFIG.wargaRoleId}\` tidak ditemukan di server ini. Periksa konfigurasi di file \`.env\`.`
      );

      if (!roleCheck.ok) {
        return await interaction.reply({ content: roleCheck.message, ephemeral: true });
      }

      // 4. Validasi hierarki role bot
      const hierarchyCheck = checkRoleHierarchy(
        botMember,
        wargaRole,
        `⚠️ Posisi role bot (${botMember.roles.highest.name}) berada di bawah atau setingkat dengan role **${wargaRole.name}**.\n` +
          'Pindahkan role bot ke posisi lebih tinggi daripada role Warga di menu **Server Settings > Roles**.'
      );

      if (!hierarchyCheck.ok) {
        return await interaction.reply({ content: hierarchyCheck.message, ephemeral: true });
      }

      // 5. Kirim panel Take Role ke channel
      const { embed, row } = createWargaPanel();
      await interaction.channel.send({ embeds: [embed], components: [row] });

      // 6. Konfirmasi ephemeral kepada admin yang mengeksekusi
      return await interaction.reply({
        content: '✅ Panel **Take Role Warga** berhasil dikirim ke channel ini!',
        ephemeral: true,
      });
    } catch (error) {
      console.error('[ERROR] Gagal mengeksekusi /setup-warga:', error);

      const errorMessage = '❌ Terjadi kesalahan saat mengirim panel Take Role Warga.';

      if (interaction.replied || interaction.deferred) {
        return await interaction.followUp({ content: errorMessage, ephemeral: true }).catch(() => null);
      }

      return await interaction.reply({ content: errorMessage, ephemeral: true }).catch(() => null);
    }
  },
};

