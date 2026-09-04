import { initToggle } from "./modules/theme.js";
import { renderBoard } from "./modules/board.js";
import { initBoardSwitch } from "./modules/board-switch.js";
import { initStats } from "./modules/stats.js";
import { initUndo } from "./modules/undo.js";
import { initExportImport } from "./modules/export-import.js";

document.addEventListener("DOMContentLoaded", () => {
  initToggle();
  initBoardSwitch();
  initStats();
  initUndo(() => {
    renderBoard();
  });
  initExportImport(() => {
    renderBoard();
  });
  renderBoard();
});
