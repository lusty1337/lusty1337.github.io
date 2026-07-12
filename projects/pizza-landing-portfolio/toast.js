// всплывашки в правом нижнем углу.
// info — «функция недоступна» для кнопок-заглушек портфолио,
// success — короткое подтверждение (например, добавление в корзину).

const PORTFOLIO_MSG = "Эта функция недоступна, так как это один из проектов портфолио, а не полноценный ресурс 😅";

let box = null;
function container() {
  if (!box) {
    box = document.createElement("div");
    box.className = "toasts";
    box.setAttribute("aria-live", "polite");
    document.body.appendChild(box);
  }
  return box;
}

export function toast(message, type = "info", ttl = 4200) {
  const el = document.createElement("div");
  el.className = `toast toast--${type}`;
  el.innerHTML = `
    <span class="toast__ico">${type === "success" ? "✓" : "i"}</span>
    <p class="toast__msg"></p>`;
  el.querySelector(".toast__msg").textContent = message;
  container().appendChild(el);

  // даём кадр, чтобы сработал transition появления
  requestAnimationFrame(() => el.classList.add("is-in"));

  const kill = () => {
    el.classList.remove("is-in");
    el.addEventListener("transitionend", () => el.remove(), { once: true });
    setTimeout(() => el.remove(), 400); // страховка, если transitionend не придёт
  };
  const timer = setTimeout(kill, ttl);
  el.addEventListener("click", () => { clearTimeout(timer); kill(); });
}

export const portfolioToast = () => toast(PORTFOLIO_MSG, "info");

// любая кнопка/ссылка с атрибутом data-toast показывает «функция недоступна»
export function wirePortfolioButtons(root = document) {
  root.addEventListener("click", e => {
    const t = e.target.closest("[data-toast]");
    if (!t) return;
    e.preventDefault();
    portfolioToast();
  });
}
