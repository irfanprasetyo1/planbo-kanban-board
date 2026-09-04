import { getState, replaceState } from "../data/state.js";

const MAX_HISTORY = 10;
let history = [];

//Fungsi untuk menyimpan salinan snapshot (maksimal 10 salinan)
export function recordSnapshot() {
  const snapshot = JSON.parse(JSON.stringify(getState()));
  history.push(snapshot);

  if (history.length > MAX_HISTORY) {
    history.shift();
  }

  updateUndoButton();
}

//Fungsi untuk mengembalikan salinan sebelumnya
export function undo() {
  if (history.length === 0) return null;

  const lastSnapshot = history.pop();
  replaceState(lastSnapshot);
  updateUndoButton();

  return lastSnapshot;
}

//Fungsi untuk memperbarui status aktif/ non aktif tombol undo
function updateUndoButton() {
  const undoBtn = document.getElementById("undoBtn");
  if (!undoBtn) return;

  undoBtn.disabled = history.length === 0;
}

//Fungsi untuk inisiasi undo Button
export function initUndo(onUndo) {
  const undoBtn = document.getElementById("undoBtn");
  if (!undoBtn) return;

  undoBtn.addEventListener("click", () => {
    const restored = undo();
    if (restored && typeof onUndo === "function") {
      onUndo();
    }
  });

  updateUndoButton();
}
