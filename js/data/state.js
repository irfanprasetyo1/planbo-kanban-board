import { loadData, saveData, generateId } from "./storage.js";

let data = loadData();

//Fungsi untuk menyimpan setiap perubahan data terbaru secara otomatis ke localStorage
function persist() {
  saveData(data);
}

//Fungsi untuk mengambil seluruh state data aplikasi saat ini
export function getState() {
  return data;
}

//Fungsi untuk mengambil objek board yang sedang aktif berdasarkan activeBoardId
export function getActiveBoard() {
  return data.boards.find((b) => b.id === data.activeBoardId);
}

//Fungsi untuk mengubah status board aktif ke board yang di pilih
export function setActiveBoard(boardId) {
  data.activeBoardId = boardId;
  persist();
}

//Fungsi untuk membuat board baru
export function addBoard(name) {
  const newBoard = {
    id: generateId("board"),
    name,
    columns: [
      { id: generateId("col"), name: "To Do", cards: [] },
      { id: generateId("col"), name: "In Progress", cards: [] },
      { id: generateId("col"), name: "Done", cards: [] },
    ],
  };

  data.boards.push(newBoard);
  data.activeBoardId = newBoard.id;
  persist();
  return newBoard;
}

//Fungsi untuk menghapus board
export function deleteBoard(boardId) {
  if (data.boards.length <= 1) return false;

  data.boards = data.boards.filter((b) => b.id !== boardId);

  if (data.activeBoardId === boardId) {
    data.activeBoardId = data.boards[0].id;
  }
  persist();
  return true;
}

//Fungsi untuk membuat card baru
export function addCard(columnId, judul) {
  const board = getActiveBoard();
  const column = board.columns.find((c) => c.id === columnId);
  const newCard = { id: generateId("card"), judul };
  column.cards.push(newCard);
  persist();
  return newCard;
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
  column.cards = column.cards.filter((c) => c.id !== cardId);

  persist();
}

//Fungsi untuk menimpa data lama dengan data baru
export function replaceState(newData) {
  data = newData;
  persist();
}
