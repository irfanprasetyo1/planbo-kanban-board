import { getActiveBoard } from "../data/state.js";

//Fungsi untuk menghitung angka statistik
function calculateStats() {
  const board = getActiveBoard();

  let totalCards = 0;
  let doneCards = 0;
  let fullestColumn = { nama: "-", jumlah: 0 };

  board.columns.forEach((column) => {
    totalCards += column.cards.length;

    if (column.name.toLowerCase() === "done") {
      doneCards += column.cards.length;
    }

    if (column.cards.length > fullestColumn.jumlah) {
      fullestColumn = { nama: column.name, jumlah: column.cards.length };
    }
  });

  const persentasiSelesai =
    totalCards === 0 ? 0 : Math.round((doneCards / totalCards) * 100);

  return { totalCards, doneCards, persentasiSelesai, fullestColumn };
}

//Fungsi untuk merender struktur HTML Statistik
function renderStats() {
  const stats = calculateStats();
  const statsBody = document.getElementById("statsBody");

  statsBody.innerHTML = `
    <div class="stats-metric">
      <span>Total kartu</span>
      <strong>${stats.totalCards}</strong>
    </div>
    <div class="stats-metric">
      <span>Sudah selesai</span>
      <strong>${stats.doneCards} (${stats.persentasiSelesai}%)</strong>
    </div>
    <div class="stats-metric">
      <span>Kolom paling penuh</span>
      <strong>${stats.fullestColumn.nama} (${stats.fullestColumn.jumlah})</strong>
    </div>
  `;
}

//Fungsi untuk mengontrol visibilitas dialog dengan class
function toggleStatsDialog(open) {
  const dialog = document.getElementById("statDialog");
  const overlay = document.getElementById("statOverlay");

  if (open) {
    dialog.hidden = !open;
    overlay.hidden = !open;
    requestAnimationFrame(() => {
      dialog.classList.add("is-open");
      overlay.classList.add("is-open");
    });
    renderStats();
  } else {
    dialog.classList.remove("is-open");
    overlay.classList.remove("is-open");

    setTimeout(() => {
      dialog.hidden = true;
      overlay.hidden = true;
    }, 300);
  }
}

//Fungsi untuk inisiasi event listener pada komponen dialog statistik (tombol buka, tutup, dan overlay)
export function initStats() {
  const statsBtn = document.getElementById("statBtn");
  const closeStats = document.getElementById("statCloseBtn");
  const statsOverlay = document.getElementById("statOverlay");

  statsBtn.addEventListener("click", () => toggleStatsDialog(true));
  closeStats.addEventListener("click", () => toggleStatsDialog(false));
  statsOverlay.addEventListener("click", () => toggleStatsDialog(false));
}
