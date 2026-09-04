# Planbo - Kanban Board

Aplikasi Kanban Board sederhana untuk mengatur tugas dengan sistem kolom (To Do, In Progress, Done) yang bisa dipindah lewat drag-and-drop, mendukung mouse maupun sentuhan (touch).

## Demo

(https://irfanprasetyo1.github.io/planbo-kanban-board/)

## Fitur

- Drag-and-drop kartu antar kolom, mendukung **mouse dan sentuhan (touch)**
- **Multi-Board** — buat, pindah, dan hapus board sesuai kebutuhan
- Tambah dan hapus kartu, lengkap dengan animasi transisi
- **Undo** — urungkan aksi terakhir
- **Dashboard statistik** ringkas (total kartu, persentase selesai, kolom paling penuh)
- **Export & Import** data board dalam format JSON
- Dark mode / light mode toggle
- Toast notifikasi untuk setiap aksi penting
- Data tersimpan otomatis lewat localStorage
- HTML semantic dan atribut aksesibilitas
- Responsive **mobile-first**

## Dibangun dengan

- **HTML5** — struktur semantik dengan ARIA
- **CSS3** — custom properties (variables), dark mode, animasi & transisi, pendekatan mobile-first
- **JavaScript (Vanilla)** — modular, Drag and Drop API native (mouse) dan Touch Event API (sentuhan), localStorage

## Struktur Project

```
├── assets/
│   └── logo/            # logo dan favicon
├── css/
│   ├── variables.css    # warna, font, dan variabel desain (+ dark mode)
│   ├── base.css         # reset dan gaya dasar
│   ├── layout.css       # struktur tata letak, mobile-first
│   └── components.css   # gaya komponen (board, card, dialog, toast, dll)
├── js/
│   ├── main.js           # entry point JavaScript
│   ├── data/
│   │   ├── storage.js     # kelola data ke/dari localStorage
│   │   └── state.js       # pusat kendali seluruh data aplikasi
│   └── modules/
│       ├── board.js        # render board & drag-drop (mouse)
│       ├── touch-drag.js   # drag-drop untuk perangkat sentuh
│       ├── board-switch.js # fitur Multi-Board
│       ├── stats.js        # dashboard statistik
│       ├── undo.js         # riwayat aktivitas & undo
│       ├── export-import.js # backup/restore data JSON
│       ├── theme.js        # dark/light mode
│       └── toast.js        # notifikasi
└── index.html
```

## Tentang Saya

Project ini dibuat sebagai bagian dari proses belajar saya menjadi Front-End Developer, Saya membangun project secara bertahap dan terus belajar dalam pengembangan web.

---

Terima kasih sudah mampir ke project ini!
