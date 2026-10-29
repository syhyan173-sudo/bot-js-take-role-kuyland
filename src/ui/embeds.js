import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';
import { BUTTON_IDS, COLORS, FOOTER_TEXT } from '../lib/constants.js';

/**
 * Membuat embed panel Take Role Warga beserta row tombolnya.
 * @returns {{ embed: EmbedBuilder, row: ActionRowBuilder<ButtonBuilder> }}
 */
export function createWargaPanel() {
  const embed = new EmbedBuilder()
    .setColor(COLORS.PRIMARY)
    .setTitle('🏙️ KUYLAND ROLEPLAY')
    .setDescription(
      'Selamat datang di KUYLAND ROLEPLAY!\n\n' +
      'Jadilah bagian dari komunitas kami dan mulai perjalananmu bersama warga Kuyland. Tekan tombol di bawah untuk mendapatkan role Warga dan mengakses komunitas kami.\n\n' +
      'One Community, One Story, One Kuyland.'
    )
    .setFooter({ text: FOOTER_TEXT });

  const button = new ButtonBuilder()
    .setCustomId(BUTTON_IDS.TAKE_ROLE_WARGA)
    .setLabel('Ambil Role Warga')
    .setEmoji('🏙️')
    .setStyle(ButtonStyle.Primary);

  const row = new ActionRowBuilder().addComponents(button);

  return { embed, row };
}

/**
 * Embed informasi ketika member sudah memiliki role Warga.
 * @returns {EmbedBuilder}
 */
export function createAlreadyWargaEmbed() {
  return new EmbedBuilder()
    .setColor(COLORS.WARNING)
    .setTitle('🏙️ Informasi Role Warga')
    .setDescription(
      'Kamu **sudah memiliki role Warga** di **KUYLAND ROLEPLAY**!\n\n' +
      'Nikmati petualanganmu dan selalu patuhi peraturan kota.'
    )
    .setFooter({ text: FOOTER_TEXT });
}

/**
 * Embed sukses setelah role Warga diberikan.
 * @param {{ changed: boolean, nickname: string, notice: string }} nicknameState
 * @returns {EmbedBuilder}
 */
export function createWargaSuccessEmbed(nicknameState) {
  const { changed, nickname, notice } = nicknameState;

  return new EmbedBuilder()
    .setColor(COLORS.SUCCESS)
    .setTitle('✅ Selamat Datang, Warga Kuyland!')
    .setDescription(
      'Role **Warga** telah berhasil ditambahkan ke akunmu!\n' +
      (changed ? `Nama kamu telah disesuaikan menjadi **${nickname}**.\n\n` : '\n') +
      'Sekarang kamu dapat mengakses channel komunitas **KUYLAND ROLEPLAY**.\n' +
      '*One Community, One Story, One Kuyland.*' +
      notice
    )
    .setFooter({ text: FOOTER_TEXT });
}

export default { createWargaPanel, createAlreadyWargaEmbed, createWargaSuccessEmbed };
