function getData(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

function setData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// ===== ФИНАНСЫ =====

function toggleIncomeField() {
  const type = document.getElementById("walletType")?.value;
  const group = document.getElementById("incomeGroup");
  if (!group) return;
  group.style.display = type === "invest" ? "flex" : "none";
}

function addWallet() {
  const wallets = getData("wallets");

  wallets.push({
    type: walletType.value,
    name: walletName.value,
    amount: +walletAmount.value,
    income: +walletIncome.value || 0
  });

  setData("wallets", wallets);
  renderWallets();
}

function renderWallets() {
  const list = document.getElementById("walletList");
  if (!list) return;

  const wallets = getData("wallets");

  const order = { cash:1, card:2, invest:3, debt:4 };

  wallets.sort((a,b)=>{
    if(order[a.type]!==order[b.type]) return order[a.type]-order[b.type];
    return b.amount-a.amount;
  });

  let total=0, income=0;
  list.innerHTML="";

  wallets.forEach(w=>{
    total+=w.amount;
    if(w.type==="invest") income+=w.income;

    const div=document.createElement("div");
    div.className="item";
    div.innerHTML=`<span>${w.name}</span><span>${w.amount}</span>`;
    list.appendChild(div);
  });

  walletTotal.textContent=total;
  monthlyIncome.textContent=income;
}

// ===== КРЕДИТКИ =====

function addCredit() {
  const credits = getData("credits");

  credits.push({
    name: creditName.value,
    debt: +creditDebt.value,
    limit: +creditLimit.value,
    date: creditDate.value
  });

  setData("credits", credits);
  renderCredits();
}

function renderCredits() {
  const list = document.getElementById("creditList");
  if (!list) return;

  const credits = getData("credits");

  credits.sort((a,b)=> new Date(a.date)-new Date(b.date));

  let total=0, available=0;
  list.innerHTML="";

  credits.forEach(c=>{
    total+=c.debt;
    available+=(c.limit-c.debt);

    const div=document.createElement("div");
    div.className="item";
    div.innerHTML=`
      <span>${c.name} (${c.date})</span>
      <span>${c.debt}/${c.limit}</span>
    `;
    list.appendChild(div);
  });

  creditTotal.textContent=total;
  creditAvailable.textContent=available;
}

// ===== ПОДПИСКИ =====

function addSub() {
  const subs = getData("subs");

  subs.push({
    name: subName.value,
    price: +subPrice.value,
    date: subDate.value
  });

  setData("subs", subs);
  renderSubs();
}

function renderSubs() {
  const list = document.getElementById("subList");
  if (!list) return;

  const subs = getData("subs");

  subs.sort((a,b)=> new Date(a.date)-new Date(b.date));

  let total=0;
  list.innerHTML="";

  subs.forEach(s=>{
    total+=s.price;

    const div=document.createElement("div");
    div.className="item";
    div.innerHTML=`
      <span>${s.name} (${s.date})</span>
      <span>${s.price}</span>
    `;
    list.appendChild(div);
  });

  subTotal.textContent=total;
}

// ===== INIT =====

document.addEventListener("DOMContentLoaded", ()=>{
  renderWallets();
  renderCredits();
  renderSubs();
});