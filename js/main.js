// =========================================================
// Portfolio — comportamiento
// =========================================================

// 1) Modo claro / oscuro (se recuerda la elección)
const raiz = document.documentElement;

try {
  const guardado = localStorage.getItem("tema");
  if (guardado) raiz.dataset.theme = guardado;
} catch (e) { /* si el navegador no deja guardar, no pasa nada */ }

document.getElementById("tema").addEventListener("click", () => {
  const oscuro = getComputedStyle(raiz).colorScheme === "dark";
  raiz.dataset.theme = oscuro ? "light" : "dark";
  try { localStorage.setItem("tema", raiz.dataset.theme); } catch (e) {}
});

// 2) Año del footer automático
document.getElementById("anio").textContent = new Date().getFullYear();
