import { moveCard } from "../data/state.js";
import { recordSnapshot } from "./undo.js";

let draggedCardEl = null;
let draggedCardId = null;
let sourceColumnId = null;
let scrollInterval = null;
let offsetX = 0;
let offsetY = 0;
const SCROLL_ZONE = 80;
const SCROLL_SPEED = 8;

//Fungsi untuk mengatur otimatis auto-scroll layar saat kartu diseret
function handleAutoScroll(touchY) {
  const viewportHeight = window.innerHeight;
  const isNearTop = touchY < SCROLL_ZONE;
  const isNearBottom = touchY > viewportHeight - SCROLL_ZONE;

  if (!isNearTop && !isNearBottom) {
    stopAutoScroll();
  }

  if (scrollInterval) return;

  scrollInterval = setInterval(() => {
    if (isNearTop) {
      window.scrollBy(0, -SCROLL_SPEED);
    } else if (isNearBottom) {
      window.scrollBy(0, SCROLL_SPEED);
    }
  }, 16);
}

//Fungsi untuk menghentikan proses auto-scroll dan membersihkan interval timer
function stopAutoScroll() {
  if (scrollInterval) {
    clearInterval(scrollInterval);
    scrollInterval = null;
  }
}

//Fungsi untuk menginisiasi fungsional drag-and-drop versi mobile (Saat di sentuh)
export function initTouchDrag(cardEl, card, columId) {
  cardEl.addEventListener(
    "touchstart",
    (e) => {
      const touch = e.touches[0];

      draggedCardEl = cardEl;
      draggedCardId = card.id;
      sourceColumnId = columId;

      const rect = cardEl.getBoundingClientRect();
      offsetX = touch.clientX - rect.left;
      offsetY = touch.clientY - rect.top;

      cardEl.style.position = "fixed";
      cardEl.style.zIndex = "1000";
      cardEl.style.width = `${rect.width}px`;
      cardEl.classList.add("is-touch-dragging");
    },

    { passive: true },
  );

  cardEl.addEventListener(
    "touchmove",
    (e) => {
      if (!draggedCardEl) return;
      e.preventDefault();

      const touch = e.touches[0];
      draggedCardEl.style.left = `${touch.clientX - offsetX}px`;
      draggedCardEl.style.top = `${touch.clientY - offsetY}px`;
      draggedCardEl.style.display = "none";

      const elBelow = document.elementFromPoint(touch.clientX, touch.clientY);
      draggedCardEl.style.display = "";
      document.querySelectorAll(".column.is-drag-over").forEach((col) => {
        col.classList.remove("is-drag-over");
      });

      const columnBelow = elBelow?.closest(".column");
      if (columnBelow) {
        columnBelow.classList.add("is-drag-over");
      }

      handleAutoScroll(touch.clientY);
    },
    { passive: false },
  );

  cardEl.addEventListener("touchend", (e) => {
    if (!draggedCardEl) return;

    const touch = e.changedTouches[0];
    draggedCardEl.style.display = "none";

    const elBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    draggedCardEl.style.display = "";

    const columnBelow = elBelow?.closest(".column");
    draggedCardEl.style.position = "";
    draggedCardEl.style.zIndex = "";
    draggedCardEl.style.left = "";
    draggedCardEl.style.top = "";
    draggedCardEl.style.width = "";
    draggedCardEl.classList.remove("is-touch-dragging");

    document.querySelectorAll(".column.is-drag-over").forEach((col) => {
      col.classList.remove("is-drag-over");
    });

    if (columnBelow && columnBelow.dataset.columId !== sourceColumnId) {
      recordSnapshot();
      moveCard(draggedCardId, sourceColumnId, columnBelow.dataset.columnId);
      document.dispatchEvent(new CustomEvent("board:cardMoved"));
    }

    draggedCardEl = null;
    draggedCardId = null;
    sourceColumnId = null;

    stopAutoScroll();
  });
}
