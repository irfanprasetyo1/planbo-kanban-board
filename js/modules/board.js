import {
  getActiveBoard,
  addCard,
  moveCard,
  deleteCard,
} from "../data/state.js";
import { showToast } from "./toast.js";
import { initTouchDrag } from "./touch-drag.js";
import { recordSnapshot } from "./undo.js";

let recentlyChangedCardId = null;

//Fungsi untuk membuat element card di HTML
function createCardElement(card, columnId) {
  const cardEl = document.createElement("div");
  cardEl.className = "card";
  cardEl.dataset.cardId = card.id;
  cardEl.dataset.columnId = columnId;

  const cardText = document.createElement("span");
  cardText.className = "card-text";
  cardText.textContent = card.judul;
  cardEl.appendChild(cardText);

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "card-delete-btn";
  deleteBtn.innerHTML = `<i data-feather="trash-2" aria-hidden="true"></i>`;
  deleteBtn.setAttribute("aria-label", `Delete card: ${card.judul}`);
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    const konfirmasi = confirm(`Delete card "${card.judul}"?`);

    if (!konfirmasi) return;
    cardEl.classList.add("is-removing");
    setTimeout(() => {
      recordSnapshot();
      deleteCard(columnId, card.id);
      renderBoard();
      showToast("Delete card success");
    }, 150);
  });
  cardEl.appendChild(deleteBtn);

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
  initTouchDrag(cardEl, card, columnId);

  if (card.id === recentlyChangedCardId) {
    cardEl.classList.add("is-new");
    requestAnimationFrame(() => {
      cardEl.classList.add("is-visible");
    });
  }

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

    recordSnapshot();
    moveCard(payload.cardId, payload.fromColumnId, column.id);
    recentlyChangedCardId = payload.cardId;
    renderBoard();
  });

  columnEl.appendChild(list);

  const addBtn = document.createElement("button");
  addBtn.className = "add-card-btn";
  addBtn.innerHTML = `<i data-feather="plus" aria-hidden="true"></i> Create card`;
  addBtn.addEventListener("click", () => {
    const judul = prompt("New card title:");
    if (!judul || !judul.trim()) return;

    recordSnapshot();
    const newCard = addCard(column.id, judul.trim());
    recentlyChangedCardId = newCard.id;
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

  recentlyChangedCardId = null;

  if (window.feather) {
    feather.replace();
  }

  requestAnimationFrame(() => {
    boardEl.classList.add("is-ready");
  });
}

document.addEventListener("board:cardMoved", () => {
  renderBoard();
});
