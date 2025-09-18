class DoubleCheckGameV2 {
    constructor() {
        this.input = document.getElementById('answer-input-2');
        this.submit = document.getElementById('submit-btn');
        this.result = document.getElementById('result');
        this.bind();
    }

    bind() {
        this.submit.addEventListener('click', () => this.evaluate());
        this.input.addEventListener('keypress', (e) => { if (e.key === 'Enter') this.evaluate(); });
    }

    evaluate() {
        const raw = this.input.value.trim();
        // 判断是否为保留两位小数的格式：可为 1.00~9.99 或 10.00（排除10.00，因为范围是 < 10.00）
        const twoDecimal = /^\d+\.\d{2}$/; // 至少一位整数，精确两位小数
        if (!twoDecimal.test(raw)) { return this.setResult('格式不正确，应为两位小数', false); }

        const x = Number(raw);
        if (!Number.isFinite(x)) { return this.setResult('不是有效数字', false); }

        const ok = x >= 1.00 && x < 10.00;
        this.setResult(ok ? '满足条件' : '不满足条件', ok);
    }

    setResult(text, ok) {
        this.result.textContent = text;
        this.result.style.color = ok ? '#16a34a' : '#dc2626';
    }
}

document.addEventListener('DOMContentLoaded', () => new DoubleCheckGameV2());


