// script.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. 取得 DOM 元素
    const daysInput = document.getElementById('days-since-visit');
    const spendingInput = document.getElementById('average-spending');
    const frequencyInput = document.getElementById('visit-frequency');
    
    const probText = document.getElementById('probability-result');
    const riskLabel = document.getElementById('risk-status-label');

    // 圓餅圖變數
    let riskPieChart = null;

    // 2. 初始化圓餅圖
    function initPieChart() {
        const ctx = document.getElementById('riskPieChart');
        if (!ctx) return;
        
        riskPieChart = new Chart(ctx.getContext('2d'), {
            type: 'pie',
            data: {
                labels: ['安全', '警告', '危險'],
                datasets: [{
                    data: [33, 33, 34],
                    backgroundColor: [
                        '#4CAF50', // 安全 - 綠色
                        '#FFC107', // 警告 - 黃色
                        '#F44336'  // 危險 - 紅色
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.parsed}%`;
                            }
                        }
                    }
                }
            }
        });
    }

    // 3. 更新圓餅圖數據
    function updatePieChart(probability) {
        if (!riskPieChart) return;
        
        // 計算各風險等級的比例
        let safePercent = 0;
        let warningPercent = 0;
        let criticalPercent = 0;
        
        if (probability < 30) {
            safePercent = 100;
        } else if (probability >= 30 && probability <= 60) {
            warningPercent = 100;
        } else {
            criticalPercent = 100;
        }
        
        // 更新圓餅圖數據
        riskPieChart.data.datasets[0].data = [safePercent, warningPercent, criticalPercent];
        riskPieChart.update();
        
        // 更新百分比顯示
        document.getElementById('safe-percent').textContent = `${safePercent}%`;
        document.getElementById('warning-percent').textContent = `${warningPercent}%`;
        document.getElementById('critical-percent').textContent = `${criticalPercent}%`;
    }

    // 4. 核心運算邏輯 (模擬 Colab 數據模型)
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

    // 5. 更新畫面視覺與狀態
    function updateUI(probability) {
        // 更新數字顯示
        probText.textContent = `${probability}%`;

        // 判定風險等級與顏色
        let riskColor, riskText;
        if (probability > 60) {
            riskColor = '#F44336'; // 紅色
            riskText = '危險 (Critical)';
        } else if (probability >= 30) {
            riskColor = '#FFC107'; // 黃色
            riskText = '警告 (Warning)';
        } else {
            riskColor = '#4CAF50'; // 綠色
            riskText = '安全 (Safe)';
        }

        // 更新標籤
        riskLabel.textContent = riskText;
        riskLabel.style.backgroundColor = riskColor;
        riskLabel.style.color = probability > 60 ? '#ffffff' : '#000000';
        probText.style.color = riskColor;

        // 更新圓餅圖
        updatePieChart(probability);
    }

    // 6. 綁定「即時感應」事件監聽器
    // 使用 'input' 事件，確保滑桿拖曳或鍵盤輸入時能即時觸發
    const inputs = [daysInput, spendingInput, frequencyInput];
    inputs.forEach(input => {
        if (input) {
            input.addEventListener('input', calculateChurnRisk);
        }
    });

    // 7. 初始化
    initPieChart();
    calculateChurnRisk();
});