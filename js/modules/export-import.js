import { getState, replaceState } from "../data/state.js";
import { showToast } from "./toast.js";

function exportData() {
  const state = getState();
  const jsonString = JSON.stringify(state, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = `planbo-data-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}

function importData(file, onSuccess) {
  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      const importedData = JSON.parse(e.target.result);

      if (!importedData.boards || !Array.isArray(importedData.boards)) {
        throw new Error("File format is incorrect");
      }

      replaceState(importedData);
      onSuccess();
      showToast("Import data success");
    } catch (error) {
      console.error("Import failed:", error);
      alert(
        "The file is invalid or corrupted. Ensure the file was exported from this application",
      );
    }
  };

  reader.readAsText(file);
}

export function initExportImport(onImportSuccess) {
  const exportBtn = document.getElementById("exportBtn");
  const importBtn = document.getElementById("importBtn");
  const importInput = document.getElementById("importInput");

  exportBtn.addEventListener("click", () => {
    exportData();
    showToast("Data export success");
  });

  importBtn.addEventListener("click", () => {
    importInput.click();
  });

  importInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    importData(file, onImportSuccess);
    importInput.value = "";
  });
}
