import {
  getState,
  setActiveBoard,
  addBoard,
  deleteBoard,
} from "../data/state.js";
import { renderBoard } from "./board.js";
import { showToast } from "./toast.js";
import { recordSnapshot } from "./undo.js";

//Merender ulang daftar <option> dropdown bedasarkan data board dan menandai board yang aktif
function renderBoardOptions() {
  const state = getState();
  const select = document.getElementById("boardSelect");

  select.innerHTML = state.boards
    .map(
      (board) =>
        `<option value="${board.id}" ${board.id === state.activeBoardId ? "selected" : ""}>${board.name}</option>`,
    )
    .join("");
}

//Fungsi untuk menginisiasi fitur management board pada antar muka (Perpindahan board dan membuat board baru)
export function initBoardSwitch() {
  const select = document.getElementById("boardSelect");
  const newBoardBtn = document.getElementById("newBoardBtn");
  const deleteBoardBtn = document.getElementById("deleteBoardBtn");

  renderBoardOptions();

  select.addEventListener("change", () => {
    setActiveBoard(select.value);
    renderBoard();
  });

  newBoardBtn.addEventListener("click", () => {
    const nama = prompt("Create new board:");
    if (!nama || !nama.trim()) return;

    addBoard(nama.trim());
    renderBoardOptions();
    renderBoard();
    showToast(`Board "${nama.trim()}" was created`);
  });

  deleteBoardBtn.addEventListener("click", () => {
    const state = getState();
    const activeBoard = state.boards.find((b) => b.id === state.activeBoardId);

    const konfirmasi = confirm(
      `Delete board "${activeBoard.name}"? All columns and card within it will also be deleted`,
    );
    if (!konfirmasi) return;

    recordSnapshot();
    const berhasil = deleteBoard(activeBoard.id);

    if (!berhasil) {
      showToast("Cannot delete the last board");
      return;
    }

    renderBoardOptions();
    renderBoard();
    showToast(`Board "${activeBoard.name}" is deleted`);
  });
}
