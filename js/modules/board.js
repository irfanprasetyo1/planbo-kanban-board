import { getActiveBoard, addCard, moveCard } from "../data/state.js";

//Fungsi untuk membuat element card di HTML
function createCardElement(card, columnId) {
  const cardEl = document.createElement("div");
  cardEl.className = "card";
  cardEl.dataset.cardId = card.id;
  cardEl.dataset.columnId = columnId;
  cardEl.textContent = card.judul;

  cardEl.draggable = true;
  cardEl.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({ cardId: card.id, fromColumnId: columnId }),
    );

    setTimeout(() => cardEl.classList.add("is-dragging"), 0);
  });

  cardEl.addEventListener("dragend", () => {
    cardEl.classList.remove("is-dragging");
  });

  return cardEl;
}

//Fungsi untuk membuat element kolom
function createColumnElement(column) {
  const columnEl = document.createElement("div");
  columnEl.className = "column";
  columnEl.dataset.columnId = column.id;

  const header = document.createElement("div");
  header.className = "column-header";
  header.innerHTML = `
    <span class="column-title">${column.name}</span>
    <span class="column-count">${column.cards.length}</span>
  `;
  columnEl.appendChild(header);

  const list = document.createElement("div");
  list.className = "column-list";
  list.dataset.columnId = column.id;

  column.cards.forEach((card) => {
    list.appendChild(createCardElement(card, column.id));
  });

  list.addEventListener("dragover", (e) => {
    e.preventDefault();
    columnEl.classList.add("is-drag-over");
  });

  list.addEventListener("dragleave", () => {
    columnEl.classList.remove("is-drag-over");
  });

  list.addEventListener("drop", (e) => {
    e.preventDefault();
    columnEl.classList.remove("is-drag-over");

    const payload = JSON.parse(e.dataTransfer.getData("text/plain"));

    if (payload.fromColumnId === column.id) return;

    moveCard(payload.cardId, payload.fromColumnId, column.id);
    renderBoard();
  });

  columnEl.appendChild(list);

  const addBtn = document.createElement("button");
  addBtn.className = "add-card-btn";
  addBtn.innerHTML = `<i data-feather="plus" aria-hidden="true"></i> Tambah kartu`;
  addBtn.addEventListener("click", () => {
    const judul = prompt("New card title:");
    if (!judul || !judul.trim()) return;

    addCard(column.id, judul.trim());
    renderBoard();
  });
  columnEl.appendChild(addBtn);

  return columnEl;
}

//Fungsi untuk merender board
export function renderBoard() {
  const board = getActiveBoard();
  const boardEl = document.getElementById("board");

  boardEl.innerHTML = "";
  board.columns.forEach((column) => {
    boardEl.appendChild(createColumnElement(column));
  });

  if (window.feather) {
    feather.replace();
  }

  requestAnimationFrame(() => {
    boardEl.classList.add("is-ready");
  });
}
