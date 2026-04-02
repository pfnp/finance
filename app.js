let transactions = JSON.parse(localStorage.getItem('tx')) || [];

function switchTab(id, el) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}

function render() {
  const list = document.getElementById('list');
  const balance = document.getElementById('balance');
  list.innerHTML = '';
  let total = 0;

  transactions.forEach((t, i) => {
    total += t.amount;

    const wrapper = document.createElement('div');
    wrapper.className = 'wrapper';

    const del = document.createElement('div');
    del.className = 'delete';
    del.innerText = 'Удалить';
    del.onclick = () => deleteItem(i);

    const div = document.createElement('div');
    div.className = 'item';

    const colorClass = t.amount > 0 ? 'income' : 'expense';

    div.innerHTML = `
      <div>
        <div>${t.name}</div>
        <div class="category">${t.category}</div>
      </div>
      <span class="${colorClass}">${t.amount}</span>
    `;

    let startX = 0, currentX = 0;

    div.addEventListener('touchstart', e => startX = e.touches[0].clientX);
    div.addEventListener('touchmove', e => {
      currentX = e.touches[0].clientX;
      let diff = currentX - startX;
      if (diff < 0) div.style.transform = `translateX(${diff}px)`;
    });
    div.addEventListener('touchend', () => {
      let diff = currentX - startX;
      div.style.transform = diff < -80 ? 'translateX(-80px)' : 'translateX(0px)';
    });

    wrapper.appendChild(del);
    wrapper.appendChild(div);
    list.appendChild(wrapper);
  });

  balance.innerText = total + ' ₽';
}

function openModal() { document.getElementById('modalBg').style.display = 'block'; }
function closeModal() { document.getElementById('modalBg').style.display = 'none'; }

function save() {
  const name = document.getElementById('name').value;
  const category = document.getElementById('category').value;
  const amount = parseInt(document.getElementById('amount').value);
  if (!name || !amount) return;

  transactions.push({ name, category, amount });
  localStorage.setItem('tx', JSON.stringify(transactions));
  document.getElementById('name').value = '';
  document.getElementById('amount').value = '';
  closeModal();
  render();
}

function deleteItem(index) {
  transactions.splice(index, 1);
  localStorage.setItem('tx', JSON.stringify(transactions));
  render();
}

render();
