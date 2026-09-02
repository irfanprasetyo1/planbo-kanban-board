import { loadData, saveData, generateId } from "./storage.js";

let data = loadData();

//Fungsi untuk menyimpan setiap perubahan data terbaru secara otomatis ke localStorage
function persist() {
  saveData(data);
}

//Fungsi untuk mengembalikan data yang sedang aktif
export function getState() {
  return data;
}

//Fungsi untuk mencari dan mengembalikan board berdasarkan ID
export function getActiveBoard() {
  return data.boards.find((b) => b.id === data.activeBoardId);
}

//Fungsi untuk mengubah status board aktif ke board yang di pilih
export function setActiveBoard(boardId) {
  data.activeBoardId = boardId;
  persist();
}

//Fungsi untuk membuat board baru
export function addBoard(nama) {
  const newBoard = {
    id: generateId("board"),
    nama,
    columns: [
      { id: generateId("col"), name: "To Do", cards: [] },
      { id: generateId("col"), name: "In Progress", cards: [] },
      { id: generateId("col"), name: "Done", cards: [] },
    ],
  };

  data.boards.push(newBoard);
  data.activeBoardId = newBoard.id;
  persist();
  return newBoard();
}

//Fungsi untuk membuat card baru
export function addCard(columnId, judul) {
  const board = getActiveBoard();
  const column = board.columns.find((c) => c.id === columnId);
  column.cards.push({ id: generateId("card"), judul });
}

//Fungsi untuk memindahkan card
export function moveCard(cardId, fromColumnId, toColumnId) {
  const board = getActiveBoard();
  const fromColumn = board.columns.find((c) => c.id === fromColumnId);
  const toColumn = board.columns.find((c) => c.id === toColumnId);
  const cardIndex = fromColumn.cards.findIndex((c) => c.id === cardId);
  const [moveCard] = fromColumn.cards.splice(cardIndex, 1);
  toColumn.cards.push(moveCard);

  persist();
}

//Fungsi untuk menghapus card
export function deleteCard(columnId, cardId) {
  const board = getActiveBoard();
  const column = board.columns.find((c) => c.id === columnId);
  column.cards = column.cards.filter((c) => c !== cardId);

  persist();
}

//Fungsi untuk menimpa data lama dengan data baru
export function replaceState(newData) {
  data = newData;
  persist();
}
