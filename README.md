# 🏙️ KUYLAND ROLEPLAY - Bot Take Role Warga

Bot Discord verifikasi Take Role Warga untuk komunitas **KUYLAND ROLEPLAY** (GTA SA-MP / GTA V Roleplay). Dibangun menggunakan **JavaScript (ES Modules)** dan **Discord.js v14**.

---

## 🌟 Fitur Utama

- 🏙️ **Tombol Interaktif**: Member cukup menekan tombol **🏙️ Ambil Role Warga** untuk langsung mendapatkan role Warga.
- 🏷️ **Otomatis Ganti Nickname**: Nama panggilan member otomatis disesuaikan menjadi `Warga | namauser` saat berhasil mengambil role (dengan penanganan batas 32 karakter Discord).
- 🔒 **Pesan Ephemeral**: Notifikasi hanya dapat dilihat oleh member yang menekan tombol (bersih dan tidak membanjiri channel).
- ⚠️ **Deteksi Role Ganda**: Jika member sudah memiliki role Warga, bot akan mengirimkan notifikasi bahwa role sudah dimiliki.
- 🎨 **Embed Modern Bertema GTA SA-MP**: Desain oranye keemasan elegan bertema sunset San Andreas dengan layout profesional.
- ⚡ **Slash Command `/setup-warga`**: Perintah cepat untuk admin guna mengirim panel verifikasi ke channel yang diinginkan.
- 🛡️ **Keamanan Tingkat Tinggi**:
  - Hanya **Administrator** yang dapat mengeksekusi `/setup-warga`.
  - Pengecekan izin (*permissions*) dan hierarki role Discord sebelum mengeksekusi aksi.
  - Bot hanya mengelola satu role (`WARGA_ROLE_ID`).
  - Penanganan error Discord API secara mendalam.

---

## 📁 Struktur File

```text
├── src/
│   ├── index.js                  # Entry point: muat handler & login bot
│   ├── config/
│   │   └── index.js              # Validasi .env & konfigurasi terpusat (CONFIG)
│   ├── lib/
│   │   ├── client.js             # Factory Discord Client (intents)
│   │   ├── constants.js          # Warna embed, footer, custom ID, prefix nickname
│   │   ├── guards.js             # Validasi permission, role, & hierarki role
│   │   └── nickname.js           # Logika format nickname "Warga | nama"
│   ├── ui/
│   │   └── embeds.js             # Semua template embed & komponen panel
│   ├── commands/
│   │   └── setupWarga.js         # Slash command /setup-warga
│   ├── buttons/
│   │   └── takeRoleWarga.js      # Handler tombol "Ambil Role Warga"
│   ├── events/
│   │   ├── ready.js              # Saat bot online
│   │   └── interactionCreate.js  # Dispatcher interaksi (command & button)
│   └── handlers/
│       ├── loaders.js            # Auto-loader untuk command & button
│       └── loadEvents.js         # Auto-loader untuk event
├── scripts/
│   └── deploy-commands.js        # Registrasi slash command ke Discord
├── .env.example                  # Template konfigurasi environment
├── .gitignore                    # File pengabaian git (node_modules, .env)
├── package.json                  # Dependensi dan script Node.js
└── README.md                     # Panduan lengkap instalasi dan penggunaan
```

### ➕ Menambah Fitur Baru

Struktur ini memakai **auto-loader**, jadi Anda tidak perlu mengubah file lain:

- **Command baru** → buat file di `src/commands/` yang mengekspor `{ data, execute }`.
- **Button baru** → buat file di `src/buttons/` yang mengekspor `{ customId, execute }`.
- **Event baru** → buat file di `src/events/` yang mengekspor `{ name, once?, execute }`.

Jalankan `npm run deploy` setelah menambah command baru.

---

## 📋 Prasyarat

Sebelum memulai, pastikan perangkat atau VPS Anda telah terpasang:
- **Node.js LTS** (versi 18.x, 20.x, atau yang lebih baru). Unduh di [nodejs.org](https://nodejs.org/).
- Akses ke akun Discord dengan hak Administrator di server **KUYLAND ROLEPLAY**.

---

## 🛠️ Langkah 1: Persiapan di Discord Developer Portal

1. Buka [Discord Developer Portal](https://discord.com/developers/applications).
2. Klik tombol **New Application** di pojok kanan atas, beri nama (misal: `KUYLAND Citizen Bot`), lalu klik **Create**.
3. **Mendapatkan Client ID**:
   - Di menu samping, pilih **General Information**.
   - Salin nilai **Application ID** (ini adalah `CLIENT_ID`).
4. **Mendapatkan Bot Token**:
   - Di menu samping, pilih **Bot**.
   - Klik **Reset Token**, lalu salin token yang muncul (ini adalah `DISCORD_TOKEN`). *Simpan dengan aman dan jangan bagikan kepada siapapun.*
5. **Mengaktifkan Privileged Gateway Intents**:
   - Masih di halaman **Bot**, gulir ke bawah ke bagian **Privileged Gateway Intents**.
   - Aktifkan:
     - ✅ **Server Members Intent**
   - Klik **Save Changes**.
6. **Mengundang Bot ke Server**:
   - Di menu samping, pilih **OAuth2** > **URL Generator**.
   - Pada bagian **SCOPES**, centang:
     - ✅ `bot`
     - ✅ `applications.commands`
   - Pada bagian **BOT PERMISSIONS**, centang:
     - ✅ `Manage Roles`
     - ✅ `Manage Nicknames`
     - ✅ `Send Messages`
     - ✅ `Embed Links`
     - ✅ `View Channels`
     - *(Atau centang `Administrator` untuk kemudahan)*.
   - Salin URL di bagian bawah, buka di browser, lalu undang bot ke server Discord Anda.

---

## ⚙️ Langkah 2: Pengaturan di Server Discord

1. **Aktifkan Developer Mode di Discord**:
   - Masuk ke Discord > **User Settings** (ikon gerigi) > **Advanced** > Aktifkan **Developer Mode**.
2. **Mendapatkan Guild ID (Server ID)**:
   - Klik kanan pada ikon/nama server **KUYLAND ROLEPLAY** > pilih **Copy Server ID** (ini adalah `GUILD_ID`).
3. **Mendapatkan Role Warga ID**:
   - Masuk ke **Server Settings** > **Roles**.
   - Buat role bernama `Warga` (jika belum ada).
   - Klik kanan pada role `Warga` > pilih **Copy Role ID** (ini adalah `WARGA_ROLE_ID`).
4. **⚠️ PENTING: Pengaturan Hierarki Role**:
   - Masuk ke **Server Settings** > **Roles**.
   - Tarik role bot (role yang memiliki nama bot Anda) agar posisinya berada **DI ATAS role Warga**.
   - *Jika posisi role bot berada di bawah role Warga, Discord API akan menolak pemberian role dengan error `Missing Permissions`.*

---

## 📦 Langkah 3: Instalasi dan Konfigurasi Proyek

1. Buka terminal (PowerShell / Command Prompt / Terminal) di folder proyek ini:
   ```bash
   cd "e:\kuyland project\Bot js kuyland"
   ```

2. Instal dependensi:
   ```bash
   npm install
   ```

3. Buat file `.env` dengan menyalin file `.env.example`:
   - Di Windows PowerShell:
     ```powershell
     Copy-Item .env.example .env
     ```
   - Di Command Prompt (CMD):
     ```cmd
     copy .env.example .env
     ```
   - Di Linux / macOS:
     ```bash
     cp .env.example .env
     ```

4. Buka file `.env` menggunakan teks editor (seperti VS Code atau Notepad), lalu isi nilai variabel:
   ```env
   DISCORD_TOKEN=MTE5...token_bot_kamu...
   CLIENT_ID=123456789012345678
   GUILD_ID=123456789012345678
   WARGA_ROLE_ID=123456789012345678
   ```

   > 🔐 **Penting**: File `.env` menyimpan token & ID rahasia Anda. File ini **sudah di-ignore** oleh `.gitignore` sehingga tidak akan ikut ter-commit. Jangan pernah mengisi nilai asli ke `.env.example` — file itu hanya berisi placeholder kosong sebagai contoh.
   >
   > Bila `CLIENT_ID`, `GUILD_ID`, atau `WARGA_ROLE_ID` diisi bukan angka, bot akan menolak start dan menampilkan pesan error yang jelas saat `npm start` / `npm run deploy`.

---

## 🚀 Langkah 4: Registrasi Slash Command

Jalankan perintah berikut sekali untuk mendaftarkan perintah `/setup-warga` ke server Discord Anda:

```bash
npm run deploy
```

Jika berhasil, akan muncul output:
```text
[INFO] Memulai proses registrasi slash command...
[SUKSES] Berhasil mendaftarkan 1 slash command ke server (Guild ID: ...).
[SUKSES] Perintah /setup-warga sekarang siap digunakan oleh Administrator!
```

---

## 🎮 Langkah 5: Menjalankan Bot

Jalankan bot dengan perintah:

```bash
npm start
```

Output terminal saat bot berhasil online:
```text
========================================================
[ONLINE] Berhasil login sebagai: KUYLAND Citizen Bot#1234
[INFO] Server (Guild ID) yang dipantau: 123456789012345678
[INFO] Target Role Warga ID: 123456789012345678
========================================================
```

---

## 💬 Cara Menggunakan di Discord

1. Buka channel teks tempat Anda ingin menempatkan panel verifikasi (misal: `#ambil-role` atau `#verifikasi-warga`).
2. Sebagai Administrator, ketik perintah slash:
   ```text
   /setup-warga
   ```
3. Tekan Enter. Bot akan:
   - Mengirim pesan embed elegan **🏙️ KUYLAND ROLEPLAY** beserta tombol **🏙️ Ambil Role Warga**.
   - Memberikan pesan konfirmasi ephemeral kepada Anda bahwa panel berhasil dikirim.
4. Member dapat langsung menekan tombol tersebut:
   - **Jika belum memiliki role**: Bot langsung menambahkan role Warga dan mengirim notifikasi sukses.
   - **Jika sudah memiliki role**: Bot mengirim peringatan ramah bahwa mereka sudah menjadi Warga Kuyland.

---

## 🔧 Solusi Masalah (Troubleshooting)

| Masalah | Penyebab | Solusi |
| :--- | :--- | :--- |
| **Error: 50013 Missing Permissions** | Posisi role bot berada di bawah role Warga | Buka **Server Settings > Roles**, geser role bot ke atas role `Warga`. |
| **Role Warga tidak ditemukan** | `WARGA_ROLE_ID` salah atau role terhapus | Salin kembali Role ID `Warga` dan perbarui di `.env`. |
| **Slash command `/setup-warga` tidak muncul** | Script deploy belum dijalankan | Jalankan perintah `npm run deploy`. |
| **Perintah hanya bisa dijalankan admin** | Fitur proteksi aktif | Pastikan Anda memiliki permission `Administrator` di server. |
| **Nama tidak berubah otomatis** | Bot belum memiliki permission `Manage Nicknames` atau member adalah Server Owner / role lebih tinggi dari bot | Berikan permission `Manage Nicknames` ke bot & pastikan role bot lebih tinggi dari member (Discord tidak memperbolehkan bot mengubah nickname Server Owner). |
| **Error Token Invalid** | Token di `.env` salah | Buka Developer Portal, lakukan **Reset Token**, lalu salin ke `.env`. |

---

*One Community, One Story, One Kuyland.*

