let cards = JSON.parse(localStorage.getItem("cards")) || [];
let subs = JSON.parse(localStorage.getItem("subs")) || [];

let editIndex = null;
let editType = null;

// === SAVE ===
function save(){
  localStorage.setItem("cards", JSON.stringify(cards));
  localStorage.setItem("subs", JSON.stringify(subs));
}

// === КРЕДИТКИ ===
function addCard(){
  const name = cardName.value.trim();
  const debt = +amount.value;
  const limit = +document.getElementById("limit").value;
  const dueDate = dueDate.value;
  const wallet = document.getElementById("wallet").value;

  if(!name || !debt) return;

  cards.push({name, debt, limit, dueDate, wallet});
  save();
  renderCards();
}

function renderCards(){
  const list = document.getElementById("cardList");
  const total = document.getElementById("totalDebt");
  if(!list) return;

  list.innerHTML = "";
  let sum = 0;

  cards.forEach((c,i)=>{
    sum += c.debt;

    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <span>${c.wallet} ${c.name} — ${c.debt}</span>
      <div class="card-buttons">
        <button onclick="openEdit('card',${i})">✎</button>
        <button onclick="deleteCard(${i})">✕</button>
      </div>
    `;

    list.appendChild(div);
  });

  if(total) total.textContent = sum;
}

function deleteCard(i){
  cards.splice(i,1);
  save();
  renderCards();
}

// === ПОДПИСКИ ===
function addSub(){
  const name = subName.value.trim();
  const price = +subPrice.value;
  const date = subDate.value;
  const wallet = document.getElementById("wallet").value;

  if(!name || !price) return;

  subs.push({name, price, date, wallet});
  save();
  renderSubs();
}

function renderSubs(){
  const list = document.getElementById("subList");
  const total = document.getElementById("subSum");
  if(!list) return;

  list.innerHTML = "";
  let sum = 0;

  subs.forEach((s,i)=>{
    sum += s.price;

    const li = document.createElement("li");

    li.innerHTML = `
      <span>${s.wallet} ${s.name} — ${s.price}</span>
      <div class="card-buttons">
        <button onclick="openEdit('sub',${i})">✎</button>
        <button onclick="deleteSub(${i})">✕</button>
      </div>
    `;

    list.appendChild(li);
  });

  if(total) total.textContent = sum;
}

function deleteSub(i){
  subs.splice(i,1);
  save();
  renderSubs();
}

// === РЕДАКТИРОВАНИЕ ===
function openEdit(type,i){
  editType = type;
  editIndex = i;

  const item = type === "card" ? cards[i] : subs[i];

  document.getElementById("editName").value = item.name;
  document.getElementById("editValue").value = item.debt || item.price;

  document.getElementById("modal").classList.add("show");
}

function saveEdit(){
  const name = editName.value;
  const value = +editValue.value;

  if(editType === "card"){
    cards[editIndex].name = name;
    cards[editIndex].debt = value;
  } else {
    subs[editIndex].name = name;
    subs[editIndex].price = value;
  }

  save();
  renderCards();
  renderSubs();

  modal.classList.remove("show");
}

// === СТАРТ ===
renderCards();
renderSubs();