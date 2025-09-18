class DataTypeGame {
    constructor() {
        this.score = 0;
        this.flags = 0;
        this.currentQuestion = null;
        this.questions = [];
        this.initializeQuestions();
        this.initializeElements();
        this.bindEvents();
        this.generateNewQuestion();
        this.updateDisplay();
    }

    initializeQuestions() {
        this.questions = [
            // 整数类型
            { value: '42', type: 'int', display: '42' },
            { value: '-100', type: 'int', display: '-100' },
            { value: '0', type: 'int', display: '0' },
            { value: '999', type: 'int', display: '999' },
            
            // 浮点数类型
            { value: '3.14', type: 'float', display: '3.14' },
            { value: '2.71828', type: 'float', display: '2.71828' },
            { value: '0.5', type: 'float', display: '0.5' },
            { value: '-1.5', type: 'float', display: '-1.5' },
            
            // 字符类型
            { value: "'A'", type: 'char', display: "'A'" },
            { value: "'z'", type: 'char', display: "'z'" },
            { value: "'5'", type: 'char', display: "'5'" },
            { value: "'@'", type: 'char', display: "'@'" },
            
            // 字符串类型
            { value: '"Hello"', type: 'string', display: '"Hello"' },
            { value: '"World"', type: 'string', display: '"World"' },
            { value: '"123"', type: 'string', display: '"123"' },
            { value: '""', type: 'string', display: '""' },
            
            // 布尔类型
            { value: 'true', type: 'bool', display: 'true' },
            { value: 'false', type: 'bool', display: 'false' },
            
            // 变量名（需要识别为变量）
            { value: 'count', type: 'variable', display: 'count' },
            { value: 'name', type: 'variable', display: 'name' },
            { value: 'price', type: 'variable', display: 'price' },
            { value: 'isValid', type: 'variable', display: 'isValid' }
        ];
    }

    initializeElements() {
        this.questionValue = document.getElementById('question-value');
        this.answerInput = document.getElementById('answer-input');
        this.submitBtn = document.getElementById('submit-btn');
        this.newQuestionBtn = document.getElementById('new-question-btn');
        this.resetGameBtn = document.getElementById('reset-game-btn');
        this.flagsContainer = document.getElementById('flags-container');
        this.scoreDisplay = document.getElementById('score');
        this.feedback = document.getElementById('feedback');
        this.feedbackIcon = document.getElementById('feedback-icon');
        this.feedbackText = document.getElementById('feedback-text');
    }

    bindEvents() {
        this.submitBtn.addEventListener('click', () => this.checkAnswer());
        this.newQuestionBtn.addEventListener('click', () => this.generateNewQuestion());
        this.resetGameBtn.addEventListener('click', () => this.resetGame());
        
        this.answerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.checkAnswer();
            }
        });

        // 输入框获得焦点时的动画效果
        this.answerInput.addEventListener('focus', () => {
            this.answerInput.style.transform = 'scale(1.05)';
        });

        this.answerInput.addEventListener('blur', () => {
            this.answerInput.style.transform = 'scale(1)';
        });
    }

    generateNewQuestion() {
        const randomIndex = Math.floor(Math.random() * this.questions.length);
        this.currentQuestion = this.questions[randomIndex];
        
        // 更新黑板上的显示
        this.questionValue.textContent = this.currentQuestion.display;
        
        // 清空输入框
        this.answerInput.value = '';
        this.answerInput.focus();
        
        // 隐藏反馈
        this.hideFeedback();
        
        // 添加题目切换动画
        this.questionValue.style.animation = 'none';
        setTimeout(() => {
            this.questionValue.style.animation = 'blink 1.5s infinite';
        }, 100);
    }

    checkAnswer() {
        const userAnswer = this.answerInput.value.trim().toLowerCase();
        const correctAnswer = this.currentQuestion.type;
        
        // 处理多种可能的答案格式
        const answerVariations = {
            'int': ['int', 'integer', '整型', '整数', 'int型'],
            'float': ['float', 'double', '浮点', '浮点数', 'float型', 'double型'],
            'char': ['char', '字符', 'char型'],
            'string': ['string', '字符串', 'string型', 'str'],
            'bool': ['bool', 'boolean', '布尔', '布尔型', 'bool型'],
            'variable': ['variable', '变量', 'var', '标识符', 'identifier']
        };

        const isCorrect = answerVariations[correctAnswer] && 
                         answerVariations[correctAnswer].includes(userAnswer);

        if (isCorrect) {
            this.handleCorrectAnswer();
        } else {
            this.handleWrongAnswer();
        }
    }

    handleCorrectAnswer() {
        this.score += 10;
        this.flags++;
        this.showFeedback('🎉', '回答正确！', '#4CAF50');
        this.updateDisplay();
        this.playSound('correct');
        
        // 2秒后自动生成新题目
        setTimeout(() => {
            this.generateNewQuestion();
        }, 2000);
    }

    handleWrongAnswer() {
        if (this.flags > 0) {
            this.flags--;
        }
        this.showFeedback('❌', '回答错误！', '#F44336');
        this.updateDisplay();
        this.playSound('wrong');
        
        // 显示正确答案提示
        setTimeout(() => {
            this.showFeedback('💡', `正确答案是：${this.getCorrectAnswerText()}`, '#FF9800');
        }, 1500);
        
        // 3秒后生成新题目
        setTimeout(() => {
            this.generateNewQuestion();
        }, 3000);
    }

    getCorrectAnswerText() {
        const answerMap = {
            'int': 'int (整数)',
            'float': 'float (浮点数)',
            'char': 'char (字符)',
            'string': 'string (字符串)',
            'bool': 'bool (布尔)',
            'variable': 'variable (变量)'
        };
        return answerMap[this.currentQuestion.type] || this.currentQuestion.type;
    }

    showFeedback(icon, text, color) {
        this.feedbackIcon.textContent = icon;
        this.feedbackText.textContent = text;
        this.feedback.style.color = color;
        this.feedback.classList.add('show');
    }

    hideFeedback() {
        this.feedback.classList.remove('show');
    }

    updateDisplay() {
        // 更新分数显示
        this.scoreDisplay.textContent = this.score;
        
        // 更新红旗显示
        this.flagsContainer.innerHTML = '';
        for (let i = 0; i < this.flags; i++) {
            const flag = document.createElement('div');
            flag.className = 'flag';
            this.flagsContainer.appendChild(flag);
        }
        
        // 如果红旗为0，显示特殊提示
        if (this.flags === 0) {
            const noFlags = document.createElement('div');
            noFlags.textContent = '无红旗';
            noFlags.style.color = '#999';
            noFlags.style.fontStyle = 'italic';
            this.flagsContainer.appendChild(noFlags);
        }
    }

    resetGame() {
        this.score = 0;
        this.flags = 0;
        this.updateDisplay();
        this.generateNewQuestion();
        this.hideFeedback();
        this.showFeedback('🔄', '游戏重新开始！', '#2196F3');
        setTimeout(() => {
            this.hideFeedback();
        }, 2000);
    }

    playSound(type) {
        // 创建简单的音效（使用Web Audio API）
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        if (type === 'correct') {
            // 正确音效：上升音调
            oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
            oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
            oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } else if (type === 'wrong') {
            // 错误音效：下降音调
            oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(200, audioContext.currentTime + 0.3);
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        }
    }
}

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    const game = new DataTypeGame();
    
    // 添加一些额外的交互效果
    const paper = document.querySelector('.paper');
    const pen = document.querySelector('.pen');
    
    // 鼠标悬停效果
    paper.addEventListener('mouseenter', () => {
        paper.style.transform = 'scale(1.02)';
        paper.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    });
    
    paper.addEventListener('mouseleave', () => {
        paper.style.transform = 'scale(1)';
        paper.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
    });
    
    // 笔的动画效果
    setInterval(() => {
        pen.style.transform = `rotate(${15 + Math.sin(Date.now() / 1000) * 2}deg)`;
    }, 100);
    
    // 添加键盘快捷键
    document.addEventListener('keydown', (e) => {
        if (e.key === 'n' || e.key === 'N') {
            game.generateNewQuestion();
        } else if (e.key === 'r' || e.key === 'R') {
            game.resetGame();
        }
    });
    
    // 显示游戏说明
    setTimeout(() => {
        game.showFeedback('🎮', '游戏开始！识别数据类型，获得红旗！', '#2196F3');
        setTimeout(() => {
            game.hideFeedback();
        }, 3000);
    }, 500);
});

