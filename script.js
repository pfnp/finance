let debts = JSON.parse(localStorage.getItem("debts")) || [];

const colors = ["#4cafef","#ff9800","#f44336","#8bc34a","#9c27b0"];

function save() {
  localStorage.setItem("debts", JSON.stringify(debts));
}

function render() {
  const list = document.getElementById("debtList");
  const totalEl = document.getElementById("total");
  const freeEl = document.getElementById("free");

  list.innerHTML = "";

  debts.sort((a,b) => a.days - b.days);

  let total = 0;
  let free = 0;

  debts.forEach((debt, index) => {
    total += debt.amount;
    free += debt.limit;

    let color = "#4caf50";
    if (debt.days <= 20 && debt.days >= 7) color = "#ff9800";
    if (debt.days < 7) color = "#f44336";

    const li = document.createElement("li");

    const info = document.createElement("span");
    info.innerHTML = `
      <strong>${debt.card}</strong><br>
      ${debt.amount}₽ | лимит: ${debt.limit} | ${debt.days} дн.
    `;
    info.style.color = color;

    const actions = document.createElement("div");

    const editBtn = document.createElement("button");
    editBtn.textContent = "✎";
    editBtn.className = "small-btn";
    editBtn.onclick = () => editDebt(index);

    const delBtn = document.createElement("button");
    delBtn.textContent = "✕";
    delBtn.className = "small-btn";
    delBtn.onclick = () => deleteDebt(index);

    actions.appendChild(editBtn);
    actions.appendChild(delBtn);

    li.appendChild(info);
    li.appendChild(actions);

    list.appendChild(li);
  });

  totalEl.textContent = `Долг: ${total} ₽`;
  freeEl.textContent = `Остаток: ${free} ₽`;

  drawChart();
}

function addDebt() {
  const card = cardName.value.trim();
  const amount = +amountInput.value;
  const limit = +limitInput.value;
  const days = +daysInput.value;

  if (!card || !amount || !limit || !days) return;

  debts.push({ card, amount, limit, days });

  clearInputs();
  save();
  render();
}

function editDebt(index) {
  const d = debts[index];

  const newAmount = prompt("Новый долг", d.amount);
  const newLimit = prompt("Новый лимит", d.limit);
  const newDays = prompt("Новые дни", d.days);

  if (newAmount && newLimit && newDays) {
    debts[index] = {
      ...d,
      amount: +newAmount,
      limit: +newLimit,
      days: +newDays
    };
    save();
    render();
  }
}

function deleteDebt(index) {
  debts.splice(index, 1);
  save();
  render();
}

function drawChart() {
  const canvas = document.getElementById("chart");
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0,0,300,300);

  const total = debts.reduce((s,d)=>s+d.amount,0);
  if (!total) return;

  let start = 0;

  debts.forEach((d,i)=>{
    const slice = d.amount/total * Math.PI*2;

    ctx.beginPath();
    ctx.moveTo(150,150);
    ctx.arc(150,150,100,start,start+slice);
    ctx.closePath();

    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();

    start += slice;
  });
}

function clearInputs(){
  cardName.value="";
  amountInput.value="";
  limitInput.value="";
  daysInput.value="";
}

const cardName = document.getElementById("cardName");
const amountInput = document.getElementById("amount");
const limitInput = document.getElementById("limit");
const daysInput = document.getElementById("days");

["cardName","amount","limit","days"].forEach(id=>{
  document.getElementById(id).addEventListener("keydown", e=>{
    if(e.key==="Enter") addDebt();
  });
});

render();
