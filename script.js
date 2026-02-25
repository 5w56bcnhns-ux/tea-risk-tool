// script.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. 取得 DOM 元素
    const daysInput = document.getElementById('days-since-visit');
    const spendingInput = document.getElementById('average-spending');
    const frequencyInput = document.getElementById('visit-frequency');
    
    const probText = document.getElementById('probability-result');
    const riskLabel = document.getElementById('risk-status-label');

    // 2. 核心運算邏輯 (模擬 Colab 數據模型)
    function calculateChurnRisk() {
        const days = parseFloat(daysInput.value) || 0;
        const spending = parseFloat(spendingInput.value) || 0;
        const frequency = parseFloat(frequencyInput.value) || 0;

        // 基準流失率 25.8%
        let baseRisk = 25.8; 
        
        // 天數權重最高 (模擬：超過 30 天風險急劇上升)
        let daysFactor = (days / 30) * 40; // 假設 30 天貢獻 40% 風險
        
        // 頻率與消費金額的微調 (頻率高、消費高則降低風險)
        let freqFactor = (frequency > 4) ? -10 : (frequency < 2 ? 10 : 0);
        let spendFactor = (spending > 150) ? -5 : 0;

        // 計算總機率並限制在 5% 到 99% 之間
        let finalProbability = baseRisk + daysFactor + freqFactor + spendFactor;
        finalProbability = Math.max(5, Math.min(99, Math.round(finalProbability)));

        updateUI(finalProbability);
    }

    // 3. 更新畫面視覺與狀態
    function updateUI(probability) {
        // 更新數字顯示
        probText.textContent = `${probability}%`;

        // 判定風險等級與顏色
        let riskColor, riskText;
        if (probability > 60) {
            riskColor = 'var(--risk-critical)';
            riskText = '危險 (Critical)';
        } else if (probability >= 30) {
            riskColor = 'var(--risk-warning)';
            riskText = '警告 (Warning)';
        } else {
            riskColor = 'var(--risk-safe)';
            riskText = '安全 (Safe)';
        }

        // 更新標籤
        riskLabel.textContent = riskText;
        riskLabel.style.backgroundColor = riskColor;
        probText.style.color = riskColor;
    }

    // 4. 綁定「即時感應」事件監聽器
    // 使用 'input' 事件，確保滑桿拖曳或鍵盤輸入時能即時觸發
    const inputs = [daysInput, spendingInput, frequencyInput];
    inputs.forEach(input => {
        if (input) {
            input.addEventListener('input', calculateChurnRisk);
        }
    });

    // 初始化執行一次，顯示預設值的結果
    calculateChurnRisk();
});