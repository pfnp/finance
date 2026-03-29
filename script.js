let debts = JSON.parse(localStorage.getItem("debts")) || [];

function save() {
  localStorage.setItem("debts", JSON.stringify(debts));
}

function render() {
  const list = document.getElementById("debtList");
  const totalEl = document.getElementById("total");

  list.innerHTML = "";

  // сортировка по дням
  debts.sort((a,b) => a.days - b.days);

  let total = 0;

  debts.forEach((debt, index) => {
    total += debt.amount;

    let color = "green";
    if (debt.days <= 20 && debt.days >= 7) color = "orange";
    if (debt.days < 7) color = "red";

    const li = document.createElement("li");

    const info = document.createElement("span");
    info.innerHTML = `
      <strong>${debt.card}</strong> — ${debt.amount}₽ 
      (лимит: ${debt.limit}) — ${debt.days} дн.
    `;
    info.style.color = color;

    const actions = document.createElement("div");

    const delBtn = document.createElement("button");
    delBtn.textContent = "✕";
    delBtn.className = "small-btn";
    delBtn.onclick = () => deleteDebt(index);

    actions.appendChild(delBtn);

    li.appendChild(info);
    li.appendChild(actions);

    list.appendChild(li);
  });

  totalEl.textContent = `Общий долг: ${total} ₽`;

  drawChart();
}

function addDebt() {
  const card = document.getElementById("cardName").value.trim();
  const amount = parseFloat(document.getElementById("amount").value);
  const limit = parseFloat(document.getElementById("limit").value);
  const days = parseInt(document.getElementById("days").value);

  if (!card || !amount || !limit || !days) return;

  debts.push({ card, amount, limit, days });

  document.getElementById("cardName").value = "";
  document.getElementById("amount").value = "";
  document.getElementById("limit").value = "";
  document.getElementById("days").value = "";

  save();
  render();
}

function deleteDebt(index) {
  debts.splice(index, 1);
  save();
  render();
}

// простая круговая диаграмма
function drawChart() {
  const canvas = document.getElementById("chart");
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const total = debts.reduce((sum, d) => sum + d.amount, 0);
  if (total === 0) return;

  let start = 0;

  debts.forEach(debt => {
    const slice = (debt.amount / total) * Math.PI * 2;

    ctx.beginPath();
    ctx.moveTo(150,150);
    ctx.arc(150,150,100,start,start+slice);
    ctx.closePath();

    ctx.fillStyle = getRandomColor();
    ctx.fill();

    start += slice;
  });
}

function getRandomColor() {
  return `hsl(${Math.random()*360},70%,60%)`;
}

// Enter
["cardName","amount","limit","days"].forEach(id => {
  document.getElementById(id).addEventListener("keydown", e => {
    if (e.key === "Enter") addDebt();
  });
});

render();
