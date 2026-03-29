let debts = JSON.parse(localStorage.getItem("debts")) || [];
let currentEdit = null;

function getColor(name){
  let hash=0;
  for(let i=0;i<name.length;i++){
    hash=name.charCodeAt(i)+((hash<<5)-hash);
  }
  return `hsl(${hash%360},70%,60%)`;
}

function save(){
  localStorage.setItem("debts", JSON.stringify(debts));
}

function render(){
  const list=document.getElementById("debtList");
  const totalEl=document.getElementById("total");
  const freeEl=document.getElementById("free");

  list.innerHTML="";

  debts.sort((a,b)=>a.days-b.days);

  let total=0;
  let free=0;

  debts.forEach((d,i)=>{
    total+=d.amount;
    free+=d.limit;

    let color="green";
    if(d.days<=20 && d.days>=7) color="orange";
    if(d.days<7) color="red";

    const li=document.createElement("li");

    const info=document.createElement("span");
    info.innerHTML=`<strong>${d.card}</strong><br>${d.amount}₽ | ${d.days} дн.`;
    info.style.color=color;

    const actions=document.createElement("div");

    const edit=document.createElement("button");
    edit.textContent="✎";
    edit.onclick=()=>editDebt(i);

    const del=document.createElement("button");
    del.textContent="✕";
    del.onclick=()=>deleteDebt(i);

    actions.append(edit,del);
    li.append(info,actions);
    list.appendChild(li);
  });

  totalEl.textContent=`${total} ₽`;
  freeEl.textContent=`Остаток по кредиткам: ${free} ₽`;

  drawChart();
}

function drawChart(){
  const canvas=document.getElementById("chart");
  const ctx=canvas.getContext("2d");

  ctx.clearRect(0,0,320,320);

  const total=debts.reduce((s,d)=>s+d.amount,0);
  if(!total) return;

  let start=-Math.PI/2;

  debts.forEach(d=>{
    const slice=d.amount/total*Math.PI*2;
    const color=getColor(d.card);

    ctx.beginPath();
    ctx.arc(160,160,110,start,start+slice);
    ctx.arc(160,160,70,start+slice,start,true);
    ctx.closePath();

    ctx.fillStyle=color;
    ctx.fill();

    start+=slice;
  });

  ctx.fillStyle="#2b2b2b";
  ctx.font="bold 16px sans-serif";
  ctx.textAlign="center";
  ctx.fillText(`${total} ₽`,160,160);
}

function addDebt(){
  const card=cardName.value.trim();
  const amount=+amountInput.value;
  const limit=+limitInput.value;
  const days=+daysInput.value;

  if(!card||!amount||!limit||!days) return;

  debts.push({card,amount,limit,days});
  clearInputs();
  save();
  render();
}

function editDebt(i){
  currentEdit=i;
  const d=debts[i];

  editAmount.value=d.amount;
  editLimit.value=d.limit;
  editDays.value=d.days;

  modal.classList.remove("hidden");
}

function saveEdit(){
  const d=debts[currentEdit];

  d.amount=+editAmount.value;
  d.limit=+editLimit.value;
  d.days=+editDays.value;

  modal.classList.add("hidden");

  save();
  render();
}

function deleteDebt(i){
  debts.splice(i,1);
  save();
  render();
}

function clearInputs(){
  cardName.value="";
  amountInput.value="";
  limitInput.value="";
  daysInput.value="";
}

// 🔔 Уведомления
function requestNotificationPermission(){
  if(Notification.permission!=="granted"){
    Notification.requestPermission();
  }
}

function checkNotifications(){
  const now=new Date();
  const hours=now.getHours();
  const minutes=now.getMinutes();

  if(hours===16 && minutes===0){
    debts.forEach(d=>{
      if(d.days<7){
        new Notification(`Погаси кредитку: ${d.card}`,{
          body:`Осталось ${d.days} дней`
        });
      }
    });
  }
}

// проверка каждую минуту
setInterval(checkNotifications,60000);

requestNotificationPermission();

const cardName=document.getElementById("cardName");
const amountInput=document.getElementById("amount");
const limitInput=document.getElementById("limit");
const daysInput=document.getElementById("days");

["cardName","amount","limit","days"].forEach(id=>{
  document.getElementById(id).addEventListener("keydown",e=>{
    if(e.key==="Enter") addDebt();
  });
});

render();
