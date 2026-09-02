import { initToggle } from "./modules/theme.js";
import { renderBoard } from "./modules/board.js";

document.addEventListener("DOMContentLoaded", () => {
  initToggle();
  renderBoard();
});
