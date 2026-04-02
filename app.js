// ===== Работа с LocalStorage =====
function getData(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

function setData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// ===== Финансы (кошельки) =====
function addWallet() {
  const name = document.getElementById("walletName").value;
  const amount = +document.getElementById("walletAmount").value;

  if (!name || !amount) return;

  const wallets = getData("wallets");
  wallets.push({ name, amount });
  setData("wallets", wallets);

  renderWallets();
}

function renderWallets() {
  const list = document.getElementById("walletList");
  const totalEl = document.getElementById("walletTotal");

  if (!list) return;

  const wallets = getData("wallets");

  list.innerHTML = "";
  let total = 0;

  wallets.forEach(w => {
    total += w.amount;

    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `<span>${w.name}</span><span>${w.amount}</span>`;
    list.appendChild(div);
  });

  totalEl.textContent = total;
}

// ===== Подписки =====
function addSub() {
  const name = document.getElementById("subName").value;
  const price = +document.getElementById("subPrice").value;

  if (!name || !price) return;

  const subs = getData("subs");
  subs.push({ name, price });
  setData("subs", subs);

  renderSubs();
}

function renderSubs() {
  const list = document.getElementById("subList");
  const totalEl = document.getElementById("subTotal");

  if (!list) return;

  const subs = getData("subs");

  list.innerHTML = "";
  let total = 0;

  subs.forEach(s => {
    total += s.price;

    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `<span>${s.name}</span><span>${s.price}</span>`;
    list.appendChild(div);
  });

  totalEl.textContent = total;
}

// ===== Кредитки =====
function addCredit() {
  const name = document.getElementById("creditName").value;
  const amount = +document.getElementById("creditAmount").value;

  if (!name || !amount) return;

  const credits = getData("credits");
  credits.push({ name, amount });
  setData("credits", credits);

  renderCredits();
}

function renderCredits() {
  const list = document.getElementById("creditList");
  const totalEl = document.getElementById("creditTotal");

  if (!list) return;

  const credits = getData("credits");

  list.innerHTML = "";
  let total = 0;

  credits.forEach(c => {
    total += c.amount;

    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `<span>${c.name}</span><span>${c.amount}</span>`;
    list.appendChild(div);
  });

  totalEl.textContent = total;
}

// ===== Инициализация =====
document.addEventListener("DOMContentLoaded", () => {
  renderWallets();
  renderSubs();
  renderCredits();
});