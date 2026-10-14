// =========================================================
// Portfolio — animaciones y comportamiento
// =========================================================

const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// 1) TEXTO QUE SE ESCRIBE SOLO ---------------------------------------------
const frase = "while(vivo): aprender()";
const typed = document.getElementById("typed");

if (sinMovimiento) {
  typed.textContent = frase;
} else {
  let i = 0;
  const escribir = () => {
    typed.textContent = frase.slice(0, i);
    i++;
    if (i <= frase.length) setTimeout(escribir, 70 + Math.random() * 60);
  };
  setTimeout(escribir, 700);
}

// 2) SECCIONES QUE APARECEN AL HACER SCROLL ---------------------------------
// IntersectionObserver avisa cuando un elemento entra en pantalla.
const observer = new IntersectionObserver(
  (entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add("visible");
        observer.unobserve(entrada.target); // se anima una sola vez
      }
    });
  },
  { threshold: 0.15 }
);

// En el hero, cada elemento aparece un poquito después del anterior
document.querySelectorAll(".hero .reveal").forEach((el, i) => {
  el.style.setProperty("--delay", `${i * 0.12}s`);
});
document.querySelectorAll(".services .reveal").forEach((el, i) => {
  el.style.setProperty("--delay", `${i * 0.12}s`);
});
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// 3) NÚMEROS QUE CUENTAN HASTA SU VALOR ------------------------------------
const contar = (el) => {
  const final = Number(el.dataset.count);
  const sufijo = el.dataset.suffix || "";
  if (sinMovimiento) { el.textContent = final + sufijo; return; }
  const duracion = 1400;
  const inicio = performance.now();
  const paso = (ahora) => {
    const t = Math.min((ahora - inicio) / duracion, 1);
    const suave = 1 - Math.pow(1 - t, 3); // arranca rápido y frena al final
    el.textContent = Math.round(final * suave) + (t === 1 ? sufijo : "");
    if (t < 1) requestAnimationFrame(paso);
  };
  requestAnimationFrame(paso);
};

const observerNumeros = new IntersectionObserver((entradas) => {
  entradas.forEach((e) => {
    if (e.isIntersecting) { contar(e.target); observerNumeros.unobserve(e.target); }
  });
}, { threshold: 0.6 });

document.querySelectorAll("[data-count]").forEach((el) => observerNumeros.observe(el));

// 4) LUZ QUE SIGUE AL MOUSE ------------------------------------------------
const spotlight = document.querySelector(".spotlight");
window.addEventListener("pointermove", (e) => {
  spotlight.style.setProperty("--mx", `${e.clientX}px`);
  spotlight.style.setProperty("--my", `${e.clientY}px`);
});

// Borde iluminado en las tarjetas de servicios
document.querySelectorAll(".glow").forEach((card) => {
  card.addEventListener("pointermove", (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--x", `${e.clientX - r.left}px`);
    card.style.setProperty("--y", `${e.clientY - r.top}px`);
  });
});

// 5) IMÁGENES DE PROYECTOS QUE SE INCLINAN CON EL MOUSE (efecto 3D) ---------
if (!sinMovimiento && window.matchMedia("(hover: hover)").matches) {
  document.querySelectorAll(".project__media").forEach((media) => {
    media.addEventListener("pointermove", (e) => {
      const r = media.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;  // de -0.5 a 0.5
      const y = (e.clientY - r.top) / r.height - 0.5;
      media.style.setProperty("--ry", `${x * 8}deg`);
      media.style.setProperty("--rx", `${-y * 8}deg`);
    });
    media.addEventListener("pointerleave", () => {
      media.style.setProperty("--ry", "0deg");
      media.style.setProperty("--rx", "0deg");
    });
  });
}

// 6) HEADER: se oscurece al bajar y se esconde si seguís bajando -----------
const header = document.getElementById("header");
let ultimoScroll = 0;
window.addEventListener("scroll", () => {
  const y = window.scrollY;
  header.classList.toggle("scrolled", y > 20);
  header.classList.toggle("hidden", y > ultimoScroll && y > 400 && !nav.classList.contains("open"));
  ultimoScroll = y;
}, { passive: true });

// 7) MENÚ DEL CELULAR ------------------------------------------------------
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

menuBtn.addEventListener("click", () => {
  const abierto = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", abierto);
  document.body.style.overflow = abierto ? "hidden" : "";
});

nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => {
  nav.classList.remove("open");
  menuBtn.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}));

// 8) COPIAR MAIL -----------------------------------------------------------
const toast = document.getElementById("toast");
const mostrarAviso = (texto) => {
  toast.textContent = texto;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
};

document.getElementById("copiar").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText("alexisdanielrobledo@gmail.com");
    mostrarAviso("✓ Mail copiado");
  } catch (e) {
    mostrarAviso("alexisdanielrobledo@gmail.com");
  }
});

// 9) AÑO DEL FOOTER --------------------------------------------------------
document.getElementById("anio").textContent = new Date().getFullYear();
