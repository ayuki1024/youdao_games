(async()=>{
    "use strict";

    const questionEl = document.getElementById('question');
    const choicesEl = document.getElementById('choices');
    const scoreEl = document.getElementById('score');
    const highEl = document.getElementById('high');
    const timerEl = document.getElementById('timer');
    const nextBtn = document.getElementById('nextBtn');
    const resetBtn = document.getElementById('resetBtn');

    let timerId = null, elapsed = 0;
    function startTimer(){ clearTimer(); elapsed = 0; timerEl.textContent = '0'; timerId = setInterval(()=>{ elapsed++; timerEl.textContent = String(elapsed); }, 1000); }
    function clearTimer(){ if(timerId){ clearInterval(timerId); timerId = null; } }

    let score = 0;
    function updateScore(){ scoreEl.textContent = String(score); }
    function updateHighWith(candidate){
        const bestRaw = localStorage.getItem('u4_high');
        const best = parseInt(bestRaw || '0', 10) || 0;
        const next = candidate > best ? candidate : best;
        if(next !== best){ localStorage.setItem('u4_high', String(next)); }
        highEl.textContent = String(next);
    }

    function resetAll(){
        score = 0; updateScore(); updateHighWith(score);
        startTimer();
    }

    let questions = [];
    try {
        const res = await fetch('questions.json', { cache: 'no-store' });
        questions = await res.json();
    } catch (e) {
        questions = [
            { q: 'cout 输出两个整数 a 和 b，以下语句正确的是？', options: ['cout << a << b;', 'cout >> a >> b;'], answer: 0 },
            { q: '计算 7 / 2 的结果在 int 类型中是？', options: ['3', '3.5'], answer: 0 },
            { q: '10 % 4 的值是？', options: ['2', '2.5'], answer: 0 },
            { q: '英文单词含义：bug 更接近于？', options: ['程序错误', '期望值'], answer: 0 },
            { q: 'double x=5; int y=2; x / y 的结果类型是？', options: ['double', 'int'], answer: 0 },
            { q: '英文 expect 的含义是？', options: ['期望', '错误'], answer: 0 }
        ];
    }

    function pickQuestion(){
        if(questions.length === 0) return null;
        return questions[Math.floor(Math.random()*questions.length)];
    }

    function playSound(type){
        try {
            const audio = new Audio();
            if(type === 'correct'){
                // 成功音效 - 使用Web Audio API生成简单音调
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = ctx.createOscillator();
                const gainNode = ctx.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(ctx.destination);
                oscillator.frequency.setValueAtTime(523, ctx.currentTime); // C5
                oscillator.frequency.setValueAtTime(659, ctx.currentTime + 0.1); // E5
                oscillator.frequency.setValueAtTime(784, ctx.currentTime + 0.2); // G5
                gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
                oscillator.start(ctx.currentTime);
                oscillator.stop(ctx.currentTime + 0.5);
            } else if(type === 'wrong'){
                // 错误音效
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = ctx.createOscillator();
                const gainNode = ctx.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(ctx.destination);
                oscillator.frequency.setValueAtTime(200, ctx.currentTime);
                oscillator.frequency.setValueAtTime(150, ctx.currentTime + 0.1);
                gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                oscillator.start(ctx.currentTime);
                oscillator.stop(ctx.currentTime + 0.3);
            }
        } catch(e) {}
    }

    function showChalkDust(){
        // 黑板粉笔灰效果
        for(let i = 0; i < 30; i++){
            const dust = document.createElement('div');
            dust.style.position = 'fixed';
            dust.style.left = Math.random() * 100 + '%';
            dust.style.top = Math.random() * 50 + '%';
            dust.style.width = '2px';
            dust.style.height = '2px';
            dust.style.background = '#f0f8ff';
            dust.style.borderRadius = '50%';
            dust.style.pointerEvents = 'none';
            dust.style.zIndex = '9999';
            dust.style.opacity = '0.8';
            dust.style.transition = 'all 2s ease-out';
            document.body.appendChild(dust);
            
            setTimeout(() => {
                dust.style.top = (Math.random() * 50 + 50) + '%';
                dust.style.left = (Math.random() * 100) + '%';
                dust.style.opacity = '0';
                dust.style.transform = 'scale(0)';
            }, 100);
            
            setTimeout(() => dust.remove(), 2100);
        }
    }

    function bounceButton(btn){
        btn.style.transform = 'scale(1.1)';
        btn.style.transition = 'transform 0.2s ease';
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
        }, 200);
    }

    function showChalkFeedback(correct, btn){
        const text = correct ? '✓ 正确!' : '✗ 错误!';
        const feedback = document.createElement('div');
        feedback.textContent = text;
        feedback.style.position = 'absolute';
        feedback.style.fontSize = '20px';
        feedback.style.fontFamily = 'Courier New, monospace';
        feedback.style.color = correct ? '#90EE90' : '#FFB6C1';
        feedback.style.pointerEvents = 'none';
        feedback.style.zIndex = '1000';
        feedback.style.transition = 'all 1s ease-out';
        feedback.style.fontWeight = 'bold';
        
        const rect = btn.getBoundingClientRect();
        feedback.style.left = (rect.left + rect.width/2) + 'px';
        feedback.style.top = (rect.top - 20) + 'px';
        feedback.style.transform = 'translateX(-50%)';
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            feedback.style.top = (rect.top - 80) + 'px';
            feedback.style.opacity = '0';
            feedback.style.transform = 'translateX(-50%) scale(1.2)';
        }, 100);
        
        setTimeout(() => feedback.remove(), 1100);
    }

    function renderQuestion(){
        const item = pickQuestion();
        if(!item){ questionEl.textContent = '暂无题目'; choicesEl.innerHTML=''; return; }
        questionEl.textContent = item.q;
        choicesEl.innerHTML = '';
        item.options.forEach((opt, idx)=>{
            const btn = document.createElement('button');
            btn.className = 'btn';
            btn.textContent = opt;
            btn.style.position = 'relative';
            btn.addEventListener('click', ()=>{
                const correct = idx === item.answer;
                bounceButton(btn);
                showChalkFeedback(correct, btn);
                
                if(!correct){
                    playSound('wrong');
                    // 弹窗并清零分数与时间
                    setTimeout(() => {
                        alert('✗ 回答错误！本局已清零，重新开始。');
                        resetAll();
                    }, 300);
                } else {
                    playSound('correct');
                    score += 1; 
                    updateScore(); 
                    updateHighWith(score);
                    showChalkDust();
                    setTimeout(() => {
                        renderQuestion();
                    }, 800);
                }
            });
            choicesEl.appendChild(btn);
        });
    }

    nextBtn?.addEventListener('click', renderQuestion);
    resetBtn?.addEventListener('click', resetAll);

    updateHighWith(0);
    resetAll();
    renderQuestion();
})();


