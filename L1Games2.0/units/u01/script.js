class DataTypeGameV2 {
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
        const basics = [
            { value: '42', type: 'int', display: '42' },
            { value: '-7', type: 'int', display: '-7' },
            { value: '3.14', type: 'float', display: '3.14' },
            { value: '-0.01', type: 'float', display: '-0.01' },
            { value: "'A'", type: 'char', display: "'A'" },
            { value: '"Hi"', type: 'string', display: '"Hi"' },
            { value: 'true', type: 'bool', display: 'true' },
            { value: 'count', type: 'variable', display: 'count' }
        ];
        const tricky = [
            { value: '"123"', type: 'string', display: '"123"' },
            { value: "'5'", type: 'char', display: "'5'" },
            { value: '0', type: 'int', display: '0' },
            { value: 'false', type: 'bool', display: 'false' }
        ];
        this.questions = basics.concat(tricky);
    }

    initializeElements() {
        this.questionValue = document.getElementById('question-value');
        this.answerInput = document.getElementById('answer-input');
        this.submitBtn = document.getElementById('submit-btn');
        this.newQuestionBtn = document.getElementById('new-question-btn');
        this.resetGameBtn = document.getElementById('reset-game-btn');
        this.flagsContainer = document.getElementById('flags-container');
        this.scoreDisplay = document.getElementById('score');
    }

    bindEvents() {
        this.submitBtn.addEventListener('click', () => this.checkAnswer());
        this.newQuestionBtn.addEventListener('click', () => this.generateNewQuestion());
        this.resetGameBtn.addEventListener('click', () => this.resetGame());
        this.answerInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') this.checkAnswer(); });
    }

    generateNewQuestion() {
        const idx = Math.floor(Math.random() * this.questions.length);
        this.currentQuestion = this.questions[idx];
        this.questionValue.textContent = this.currentQuestion.display;
        this.answerInput.value = '';
        this.answerInput.focus();
    }

    checkAnswer() {
        const user = this.answerInput.value.trim().toLowerCase();
        const correct = this.currentQuestion.type;
        const variations = {
            'int': ['int', 'integer', '整型', '整数', 'int型'],
            'float': ['float', 'double', '浮点', '浮点数', 'float型', 'double型'],
            'char': ['char', '字符', 'char型'],
            'string': ['string', '字符串', 'string型', 'str'],
            'bool': ['bool', 'boolean', '布尔', '布尔型', 'bool型'],
            'variable': ['variable', '变量', 'var', '标识符', 'identifier']
        };
        const isCorrect = variations[correct] && variations[correct].includes(user);
        if (isCorrect) { this.handleCorrect(); } else { this.handleWrong(); }
    }

    handleCorrect() {
        this.score += 10; this.flags++; this.updateDisplay(); this.generateNewQuestion(); this.ping('#16a34a');
    }
    handleWrong() {
        if (this.flags > 0) this.flags--; this.updateDisplay(); this.ping('#dc2626');
    }

    updateDisplay() {
        this.scoreDisplay.textContent = this.score;
        this.flagsContainer.innerHTML = '';
        for (let i = 0; i < this.flags; i++) {
            const el = document.createElement('div'); el.className = 'flag'; this.flagsContainer.appendChild(el);
        }
    }

    resetGame() { this.score = 0; this.flags = 0; this.updateDisplay(); this.generateNewQuestion(); }

    ping(color) {
        this.questionValue.style.transition = 'background-color .15s ease';
        const original = this.questionValue.style.backgroundColor;
        this.questionValue.style.backgroundColor = color; setTimeout(()=>{ this.questionValue.style.backgroundColor = original; }, 200);
    }
}

document.addEventListener('DOMContentLoaded', () => { new DataTypeGameV2(); });


