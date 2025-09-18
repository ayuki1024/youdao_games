(()=>{
    "use strict";

    const ordersEl = document.getElementById('orders');
    const dishesEl = document.getElementById('dishes');
    const scoreEl = document.getElementById('score');
    const highEl = document.getElementById('high');
    const newRoundBtn = document.getElementById('newRoundBtn');
    const resetBtn = document.getElementById('resetBtn');

    let score = 0;
    function updateScore(){ scoreEl.textContent = String(score); }
    function updateHighWith(candidate){
        const bestRaw = localStorage.getItem('u2_high');
        const best = parseInt(bestRaw || '0', 10) || 0;
        const newBest = candidate > best ? candidate : best;
        if (newBest !== best) { localStorage.setItem('u2_high', String(newBest)); }
        highEl.textContent = String(newBest);
    }
    function resetScore(){ score = 0; updateScore(); updateHighWith(score); }

    const DISHES = Array.from({length:10}, (_,i)=>i); // 0..9
    let orders = [];

    function randInt(min, max){ return Math.floor(Math.random()*(max-min+1))+min; }

    function genOrders(n){
        const arr = [];
        for(let i=0;i<n;i++){
            const b = randInt(2, 10);            // 分母(菜系编码)
            const a = randInt(0, 99);            // 分子(顾客口味)
            const r = a % b;                     // 余数就是要的菜
            arr.push({ id: 'o'+i, a, b, r, done:false });
        }
        return arr;
    }

    function renderDishes(){
        dishesEl.innerHTML = '';
        DISHES.forEach(num => {
            const d = document.createElement('div');
            d.className = 'dish';
            d.draggable = true;
            d.dataset.value = String(num);
            d.innerHTML = '<div class="plate">'+num+'</div>';
            d.addEventListener('dragstart', (e)=>{
                d.classList.add('dragging');
                e.dataTransfer?.setData('text/plain', String(num));
                e.dataTransfer?.setDragImage(d, 22, 22);
            });
            d.addEventListener('dragend', ()=> d.classList.remove('dragging'));
            dishesEl.appendChild(d);
        });
    }

    function renderOrders(){
        ordersEl.innerHTML = '';
        orders.forEach(order => {
            const card = document.createElement('div');
            card.className = 'order' + (order.done ? ' done' : '');

            const ticket = document.createElement('div');
            ticket.className = 'ticket';
            ticket.textContent = order.a + ' % ' + order.b;

            const drop = document.createElement('div');
            drop.className = 'drop';
            const hint = document.createElement('span');
            hint.className = 'small';
            hint.textContent = '上菜区';
            const dz = document.createElement('div');
            dz.className = 'dropzone';
            dz.dataset.orderId = order.id;

            dz.addEventListener('dragover', (e)=>{ e.preventDefault(); dz.classList.add('over'); });
            dz.addEventListener('dragleave', ()=> dz.classList.remove('over'));
            dz.addEventListener('drop', (e)=>{
                e.preventDefault();
                dz.classList.remove('over');
                if(order.done) return;
                const data = e.dataTransfer?.getData('text/plain') || '';
                const val = parseInt(data, 10);
                if(Number.isNaN(val)) return;
                const correct = val === order.r;
                if(correct){
                    score += 1;
                    order.done = true;
                    dz.textContent = String(val);
                    dz.style.borderColor = '#34d399';
                    dz.style.background = '#ecfdf5';
                    card.classList.add('done');
                }else{
                    score -= 1;
                    dz.animate([
                        { transform:'translateX(0)' },
                        { transform:'translateX(-6px)' },
                        { transform:'translateX(6px)' },
                        { transform:'translateX(0)' }
                    ], { duration:200, easing:'ease-in-out' });
                }
                updateScore();
                updateHighWith(score);
            });

            drop.appendChild(hint);
            drop.appendChild(dz);
            card.appendChild(ticket);
            card.appendChild(drop);
            ordersEl.appendChild(card);
        });
    }

    function newRound(){
        orders = genOrders(6);
        renderOrders();
        renderDishes();
    }

    newRoundBtn?.addEventListener('click', newRound);
    resetBtn?.addEventListener('click', ()=>{ resetScore(); newRound(); });

    // init
    updateHighWith(0);
    updateScore();
    newRound();
})();

