// 获取DOM元素
const originalText = document.getElementById('originalText');
const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');
const resultText = document.getElementById('resultText');

// 存储团长链接数据
let leaderLinks = {};

// 页面加载时读取CSV文件
window.addEventListener('load', async () => {
    try {
        const response = await fetch('团长链接.csv');
        const csvText = await response.text();
        processCSVData(csvText);
    } catch (error) {
        console.error('读取CSV文件失败:', error);
        alert('读取团长链接数据失败，请确保CSV文件存在且格式正确。');
    }
});

// 处理CSV数据
function processCSVData(csvText) {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    
    // 从第二行开始处理数据
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const values = line.split(',');
        const leaderName = values[0];
        
        // 存储每个团长的品牌链接
        leaderLinks[leaderName] = {};
        for (let j = 1; j < headers.length; j++) {
            leaderLinks[leaderName][headers[j]] = values[j];
        }
    }
}

// 生成文案
generateBtn.addEventListener('click', () => {
    const text = originalText.value;
    if (!text) {
        alert('请输入原始文案！');
        return;
    }

    // 查找所有【品牌链接】并替换
    let result = text;
    for (const leaderName in leaderLinks) {
        let leaderText = text;
        for (const brand in leaderLinks[leaderName]) {
            const link = leaderLinks[leaderName][brand];
            if (link) {
                leaderText = leaderText.replace(/【品牌链接】/g, link);
            }
        }
        result += `\n\n${leaderName}的文案：\n${leaderText}`;
    }

    // 显示结果
    resultText.textContent = result;
    copyBtn.disabled = false;
});

// 复制文案
copyBtn.addEventListener('click', () => {
    const text = resultText.textContent;
    if (!text) return;

    // 使用现代复制API
    navigator.clipboard.writeText(text).then(() => {
        alert('文案已复制到剪贴板！');
    }).catch(err => {
        console.error('复制失败:', err);
        alert('复制失败，请手动复制。');
    });
}); 