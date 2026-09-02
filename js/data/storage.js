const STORAGE_KEY = "kanban-board-data";

//Fungsi untuk memberikan data awal/default sementara (hanya dipakai jika localStorage kosong)
function getDefaultData() {
  return {
    activeBoardId: "board-1",
    boards: [
      {
        id: "board-1",
        name: "Board Pertama",
        columns: [
          { id: "col-todo", name: "To Do", cards: [] },
          { id: "col-progress", name: "In Progress", cards: [] },
          { id: "col-done", name: "Done", cards: [] },
        ],
      },
    ],
  };
}

//Fungsi untuk mengambil data yang sudah di simpan
export function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : getDefaultData();
  } catch (error) {
    console.error("Failed to read data:", error);
    return getDefaultData();
  }
}

//Fungsi untuk menyimpan data
export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save data:", error);
  }
}

//Fungsi untuk membuat id baru
export function generateId(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}
