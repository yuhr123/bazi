let currentResult = null;
let currentFormat = 'json'; // 当前显示格式：'json' 或 'markdown'

// 将八字数据转换为 Markdown 格式
function formatToMarkdown(data) {
  let md = '';

  // 标题
  md += `# 八字命盘\n\n`;

  // 基本信息
  md += `## 📋 基本信息\n\n`;
  md += `| 项目 | 信息 |\n`;
  md += `|------|------|\n`;
  md += `| **性别** | ${data['性别'] || ''} |\n`;
  md += `| **公历** | ${data['阳历'] || ''} |\n`;
  md += `| **农历** | ${data['农历'] || ''} |\n`;
  md += `| **八字** | ${data['八字'] || ''} |\n`;
  md += `| **生肖** | ${data['生肖'] || ''} |\n`;
  md += `| **日主** | ${data['日主'] || ''} |\n`;
  md += `\n`;

  // 四柱信息
  md += `## 🎋 四柱详解\n\n`;
  const pillars = [
    { key: '年柱', name: '年柱', emoji: '🌸' },
    { key: '月柱', name: '月柱', emoji: '🌺' },
    { key: '日柱', name: '日柱', emoji: '🌻' },
    { key: '时柱', name: '时柱', emoji: '🌼' },
  ];

  pillars.forEach((pillar) => {
    const pillarData = data[pillar.key];
    if (pillarData) {
      md += `### ${pillar.emoji} ${pillar.name}\n\n`;
      md += `| 属性 | 值 |\n`;
      md += `|------|----|\n`;

      // 处理天干和地支（它们是嵌套对象）
      const tianGan = pillarData['天干']?.['天干'] || '';
      const diZhi = pillarData['地支']?.['地支'] || '';
      md += `| **干支** | ${tianGan}${diZhi} |\n`;

      // 五行（组合天干和地支的五行）
      const tianGanWuXing = pillarData['天干']?.['五行'] || '';
      const diZhiWuXing = pillarData['地支']?.['五行'] || '';
      md += `| **五行** | ${tianGanWuXing}${diZhiWuXing} |\n`;

      // 纳音
      md += `| **纳音** | ${pillarData['纳音'] || ''} |\n`;

      // 十神（天干的十神）
      const shiShen = pillarData['天干']?.['十神'] || '日主';
      md += `| **十神** | ${shiShen} |\n`;

      // 藏干信息（地支藏干是对象格式：主气、中气、余气）
      const cangGan = pillarData['地支']?.['藏干'];
      if (cangGan) {
        const cangGanList = [];
        if (cangGan['主气']) {
          cangGanList.push(`${cangGan['主气']['天干']}(${cangGan['主气']['十神']})`);
        }
        if (cangGan['中气']) {
          cangGanList.push(`${cangGan['中气']['天干']}(${cangGan['中气']['十神']})`);
        }
        if (cangGan['余气']) {
          cangGanList.push(`${cangGan['余气']['天干']}(${cangGan['余气']['十神']})`);
        }
        if (cangGanList.length > 0) {
          md += `| **藏干** | ${cangGanList.join('、')} |\n`;
        }
      }

      // 旬空
      if (pillarData['空亡']) {
        md += `| **旬空** | ${pillarData['空亡']} |\n`;
      }

      // 星运和自坐
      if (pillarData['星运']) {
        md += `| **星运** | ${pillarData['星运']} |\n`;
      }
      if (pillarData['自坐']) {
        md += `| **自坐** | ${pillarData['自坐']} |\n`;
      }

      md += `\n`;
    }
  });

  // 神煞信息
  if (data['神煞']) {
    md += `## ⭐ 神煞\n\n`;
    const shensha = data['神煞'];
    pillars.forEach((pillar) => {
      const ss = shensha[pillar.key];
      if (ss && ss.length > 0) {
        md += `**${pillar.name}**: ${ss.join('、')}\n\n`;
      }
    });
  }

  // 大运信息
  if (data['大运']) {
    const dayun = data['大运'];
    md += `## 🔮 大运\n\n`;
    md += `- **起运日期**: ${dayun['起运日期'] || ''}\n`;
    md += `- **起运年龄**: ${dayun['起运年龄'] || ''}\n\n`;

    if (dayun['大运'] && Array.isArray(dayun['大运'])) {
      md += `| 序号 | 年龄范围 | 干支 | 天干十神 | 地支藏干 |\n`;
      md += `|------|----------|------|----------|----------|\n`;
      dayun['大运'].forEach((dy, index) => {
        const age = `${dy['开始年龄']}-${dy['结束年龄']}岁`;
        const ganzhi = dy['干支'] || '';
        const tianGanShiShen = dy['天干十神'] || '';
        // 地支藏干是数组，需要合并
        const diZhiCangGan = dy['地支藏干'] ? dy['地支藏干'].join('') : '';
        md += `| ${index + 1} | ${age} | ${ganzhi} | ${tianGanShiShen} | ${diZhiCangGan} |\n`;
      });
      md += `\n`;
    }
  }

  // 刑冲合会
  if (data['刑冲合会']) {
    const xchh = data['刑冲合会'];
    md += `## 🔄 刑冲合会\n\n`;

    // 辅助函数：递归提取对象中的所有文本值
    const extractValues = (obj) => {
      if (obj === null || obj === undefined) return [];

      // 如果是字符串，直接返回
      if (typeof obj === 'string') return [obj];

      // 如果是数组，递归处理每个元素
      if (Array.isArray(obj)) {
        const results = [];
        obj.forEach(item => {
          const extracted = extractValues(item);
          results.push(...extracted);
        });
        return results;
      }

      // 如果是对象，递归处理所有值
      if (typeof obj === 'object') {
        const results = [];
        Object.keys(obj).forEach(key => {
          const extracted = extractValues(obj[key]);
          results.push(...extracted);
        });
        return results;
      }

      // 其他类型转为字符串
      return [String(obj)];
    };

    // 辅助函数：将关系对象转换为字符串
    const formatRelations = (relObj) => {
      if (!relObj || typeof relObj !== 'object') return '';

      const relations = [];
      Object.keys(relObj).forEach((key) => {
        const value = relObj[key];

        // 提取所有文本值
        const values = extractValues(value);

        if (values.length > 0) {
          relations.push(`${key}: ${values.join('、')}`);
        }
      });
      return relations.join(' | ');
    };

    // 收集所有关系信息
    const pillars = [
      { key: '年', name: '年柱', emoji: '🌸' },
      { key: '月', name: '月柱', emoji: '🌺' },
      { key: '日', name: '日柱', emoji: '🌻' },
      { key: '时', name: '时柱', emoji: '🌼' },
    ];

    let hasContent = false;

    pillars.forEach((pillar) => {
      const pillarData = xchh[pillar.key];
      if (pillarData && typeof pillarData === 'object') {
        const tianGanRel = formatRelations(pillarData['天干']);
        const diZhiRel = formatRelations(pillarData['地支']);

        if (tianGanRel || diZhiRel) {
          hasContent = true;
          md += `### ${pillar.emoji} ${pillar.name}\n\n`;

          if (tianGanRel) {
            md += `**天干关系**: ${tianGanRel}\n\n`;
          }
          if (diZhiRel) {
            md += `**地支关系**: ${diZhiRel}\n\n`;
          }
        }
      }
    });

    if (!hasContent) {
      md += `*暂无刑冲合会信息*\n\n`;
    }
  }

  // 底部
  md += `---\n`;
  md += `*生成时间: ${new Date().toLocaleString('zh-CN')}*\n`;

  return md;
}

      // 日期类型切换
      document.querySelectorAll('input[name="dateType"]').forEach((radio) => {
        radio.addEventListener('change', (e) => {
          const dateType = e.target.value;
          document.getElementById('solarInputGroup').classList.toggle('active', dateType === 'solar');
          document.getElementById('lunarInputGroup').classList.toggle('active', dateType === 'lunar');
        });
      });

      // 表单提交
      document.getElementById('baziForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        // 隐藏之前的结果和错误
        hideError();
        hideResult();

        const formData = new FormData(e.target);
        const dateType = formData.get('dateType');
        const gender = formData.get('gender');
        const eightCharProviderSect = formData.get('eightCharProviderSect');

        let requestData = {
          dateType,
          gender: Number(gender),
          eightCharProviderSect: Number(eightCharProviderSect),
        };

        // 根据日期类型构建请求数据
        if (dateType === 'solar') {
          const solarDatetime = document.getElementById('solarDatetime').value;
          if (!solarDatetime) {
            showError('请选择公历日期时间');
            return;
          }
          // 转换为 ISO 格式，添加时区信息（保持本地时间不变）
          // datetime-local 的值格式为: "YYYY-MM-DDTHH:mm"
          requestData.solarDatetime = solarDatetime + ':00+08:00';
        } else {
          const lunarDatetime = document.getElementById('lunarDatetime').value;
          if (!lunarDatetime) {
            showError('请选择农历日期时间');
            return;
          }
          // 农历时间格式转换：从 "YYYY-MM-DDTHH:mm" 转为 "YYYY-MM-DD HH:mm:ss"
          requestData.lunarDatetime = lunarDatetime.replace('T', ' ') + ':00';
        }

        // 显示加载状态
        showLoading();

        try {
          const response = await fetch('/api/bazi', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
          });

          const result = await response.json();

          if (result.success) {
            currentResult = result.data;
            showResult(result.data);
          } else {
            showError(result.error || '生成命盘失败，请检查输入信息');
          }
        } catch (error) {
          console.error('请求失败:', error);
          showError('网络请求失败，请检查服务器连接');
        } finally {
          hideLoading();
        }
      });

      // 切换格式
      function switchFormat(format) {
        currentFormat = format;
        if (currentResult) {
          updateDisplay();
        }
      }

      // 更新显示
      function updateDisplay() {
        const outputElement = document.getElementById('jsonOutput');

        if (currentFormat === 'markdown') {
          const markdown = formatToMarkdown(currentResult);
          outputElement.textContent = markdown;
          outputElement.classList.add('markdown-mode');
        } else {
          outputElement.textContent = JSON.stringify(currentResult, null, 2);
          outputElement.classList.remove('markdown-mode');
        }
      }

      // 显示结果
      function showResult(data) {
        updateDisplay();
        document.getElementById('resultSection').classList.add('show');

        // 滚动到结果区域
        document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      // 隐藏结果
      function hideResult() {
        document.getElementById('resultSection').classList.remove('show');
      }

      // 显示错误
      function showError(message) {
        const errorElement = document.getElementById('errorMessage');
        errorElement.textContent = '❌ ' + message;
        errorElement.classList.add('show');
      }

      // 隐藏错误
      function hideError() {
        document.getElementById('errorMessage').classList.remove('show');
      }

      // 显示加载状态
      function showLoading() {
        document.getElementById('loading').classList.add('show');
        document.querySelector('.btn-primary').disabled = true;
      }

      // 隐藏加载状态
      function hideLoading() {
        document.getElementById('loading').classList.remove('show');
        document.querySelector('.btn-primary').disabled = false;
      }

      // 复制结果
      function copyResult() {
        if (!currentResult) return;

        let content, successMessage;
        if (currentFormat === 'markdown') {
          content = formatToMarkdown(currentResult);
          successMessage = '✅ Markdown 数据已复制到剪贴板！';
        } else {
          content = JSON.stringify(currentResult, null, 2);
          successMessage = '✅ JSON 数据已复制到剪贴板！';
        }

        navigator.clipboard
          .writeText(content)
          .then(() => {
            alert(successMessage);
          })
          .catch((err) => {
            console.error('复制失败:', err);
            alert('❌ 复制失败，请手动选择文本复制');
          });
      }

      // 下载结果
      function downloadResult() {
        if (!currentResult) return;

        let content, mimeType, extension;
        if (currentFormat === 'markdown') {
          content = formatToMarkdown(currentResult);
          mimeType = 'text/markdown';
          extension = 'md';
        } else {
          content = JSON.stringify(currentResult, null, 2);
          mimeType = 'application/json';
          extension = 'json';
        }

        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;

        // 生成文件名：八字_性别_日期时间.扩展名
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const bazi = currentResult['八字'] || 'bazi';
        const gender = currentResult['性别'] || '';
        a.download = `八字命盘_${bazi.replace(/\s/g, '_')}_${gender}_${timestamp}.${extension}`;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      // 重置表单
      function resetForm() {
        document.getElementById('baziForm').reset();
        hideError();
        hideResult();
        currentResult = null;
        currentFormat = 'json';
        // 重置日期类型显示
        document.getElementById('solarInputGroup').classList.add('active');
        document.getElementById('lunarInputGroup').classList.remove('active');
        // 重置格式选择
        document.querySelector('input[name="outputFormat"][value="json"]').checked = true;
      }

      // 页面加载时设置当前日期时间
      window.addEventListener('DOMContentLoaded', () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hour = String(now.getHours()).padStart(2, '0');
        const minute = String(now.getMinutes()).padStart(2, '0');

        document.getElementById('solarDatetime').value = `${year}-${month}-${day}T${hour}:${minute}`;
      });