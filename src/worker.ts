import { getBaziDetail, getChineseCalendar, getSolarTimes } from './index.js';

// HTML 页面内容
const HTML_CONTENT = `<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>八字命盘生成器</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB',
          'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        min-height: 100vh;
        padding: 20px;
        color: #333;
      }

      .container {
        max-width: 1200px;
        margin: 0 auto;
      }

      .header {
        text-align: center;
        color: white;
        margin-bottom: 30px;
      }

      .header h1 {
        font-size: 2.5em;
        margin-bottom: 10px;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
      }

      .header p {
        font-size: 1.1em;
        opacity: 0.95;
      }

      .card {
        background: white;
        border-radius: 15px;
        padding: 30px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        margin-bottom: 30px;
      }

      .form-group {
        margin-bottom: 20px;
      }

      label {
        display: block;
        margin-bottom: 8px;
        font-weight: 600;
        color: #555;
      }

      input[type='text'],
      input[type='datetime-local'],
      select {
        width: 100%;
        padding: 12px;
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        font-size: 1em;
        transition: border-color 0.3s;
      }

      input:focus,
      select:focus {
        outline: none;
        border-color: #667eea;
      }

      .radio-group {
        display: flex;
        gap: 20px;
        margin-top: 8px;
      }

      .radio-group label {
        display: flex;
        align-items: center;
        font-weight: normal;
        cursor: pointer;
      }

      .radio-group input[type='radio'] {
        width: auto;
        margin-right: 8px;
      }

      button {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 14px 32px;
        border: none;
        border-radius: 8px;
        font-size: 1.1em;
        font-weight: 600;
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
        width: 100%;
      }

      button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
      }

      button:active {
        transform: translateY(0);
      }

      button:disabled {
        background: #ccc;
        cursor: not-allowed;
        transform: none;
      }

      .result {
        display: none;
        animation: fadeIn 0.5s;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .result.show {
        display: block;
      }

      .result h2 {
        color: #667eea;
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 2px solid #e0e0e0;
      }

      .bazi-info {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 15px;
        margin-bottom: 20px;
      }

      .info-item {
        padding: 15px;
        background: #f8f9fa;
        border-radius: 8px;
        border-left: 4px solid #667eea;
      }

      .info-item strong {
        color: #555;
        display: block;
        margin-bottom: 5px;
      }

      .pillars {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 15px;
        margin: 20px 0;
      }

      .pillar {
        text-align: center;
        padding: 20px;
        background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
        border-radius: 12px;
        border: 2px solid #667eea30;
      }

      .pillar h3 {
        color: #667eea;
        margin-bottom: 15px;
        font-size: 1.2em;
      }

      .pillar-char {
        font-size: 2em;
        font-weight: bold;
        color: #333;
        margin: 10px 0;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
      }

      .error {
        background: #fee;
        color: #c33;
        padding: 15px;
        border-radius: 8px;
        border-left: 4px solid #c33;
        margin-top: 20px;
      }

      .loading {
        text-align: center;
        padding: 20px;
        color: #667eea;
      }

      @media (max-width: 768px) {
        .pillars {
          grid-template-columns: repeat(2, 1fr);
        }

        .header h1 {
          font-size: 2em;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>🎋 八字命盘生成器</h1>
        <p>精准的八字排盘工具 · 基于专业天文历法计算</p>
      </div>

      <div class="card">
        <form id="baziForm">
          <div class="form-group">
            <label>日期类型</label>
            <div class="radio-group">
              <label>
                <input type="radio" name="dateType" value="solar" checked />
                公历（阳历）
              </label>
              <label>
                <input type="radio" name="dateType" value="lunar" />
                农历（阴历）
              </label>
            </div>
          </div>

          <div class="form-group" id="solarDateGroup">
            <label for="solarDatetime">出生时间（公历）</label>
            <input
              type="datetime-local"
              id="solarDatetime"
              name="solarDatetime"
              required
            />
          </div>

          <div class="form-group" id="lunarDateGroup" style="display: none">
            <label for="lunarDatetime">出生时间（农历）</label>
            <input
              type="text"
              id="lunarDatetime"
              name="lunarDatetime"
              placeholder="例如: 2000-05-15 12:00:00"
            />
            <small style="color: #666; margin-top: 5px; display: block">
              格式: YYYY-MM-DD HH:mm:ss
            </small>
          </div>

          <div class="form-group">
            <label>性别</label>
            <div class="radio-group">
              <label>
                <input type="radio" name="gender" value="1" checked />
                男
              </label>
              <label>
                <input type="radio" name="gender" value="0" />
                女
              </label>
            </div>
          </div>

          <div class="form-group">
            <label for="eightCharProviderSect">子时配置</label>
            <select id="eightCharProviderSect" name="eightCharProviderSect">
              <option value="2" selected>23:00-23:59 日干支为当天（推荐）</option>
              <option value="1">23:00-23:59 日干支为明天</option>
            </select>
          </div>

          <button type="submit" id="submitBtn">生成八字命盘</button>
        </form>
      </div>

      <div class="result" id="result">
        <div class="card">
          <h2>八字命盘结果</h2>
          <div id="resultContent"></div>
        </div>
      </div>
    </div>

    <script>
      const form = document.getElementById('baziForm');
      const result = document.getElementById('result');
      const resultContent = document.getElementById('resultContent');
      const submitBtn = document.getElementById('submitBtn');
      const dateTypeRadios = document.querySelectorAll('input[name="dateType"]');
      const solarDateGroup = document.getElementById('solarDateGroup');
      const lunarDateGroup = document.getElementById('lunarDateGroup');

      // 日期类型切换
      dateTypeRadios.forEach((radio) => {
        radio.addEventListener('change', (e) => {
          if (e.target.value === 'solar') {
            solarDateGroup.style.display = 'block';
            lunarDateGroup.style.display = 'none';
          } else {
            solarDateGroup.style.display = 'none';
            lunarDateGroup.style.display = 'block';
          }
        });
      });

      // 表单提交
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const dateType = formData.get('dateType');
        const data = {
          dateType,
          solarDatetime: dateType === 'solar' ? formData.get('solarDatetime') : undefined,
          lunarDatetime: dateType === 'lunar' ? formData.get('lunarDatetime') : undefined,
          gender: parseInt(formData.get('gender')),
          eightCharProviderSect: parseInt(formData.get('eightCharProviderSect')),
        };

        // 转换公历时间格式
        if (data.dateType === 'solar' && data.solarDatetime) {
          data.solarDatetime = new Date(data.solarDatetime).toISOString();
        }

        submitBtn.disabled = true;
        submitBtn.textContent = '生成中...';
        result.classList.remove('show');

        try {
          const response = await fetch('/api/bazi', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });

          const result_data = await response.json();

          if (result_data.success) {
            displayResult(result_data.data);
            result.classList.add('show');
          } else {
            resultContent.innerHTML = \`<div class="error">\${result_data.error}</div>\`;
            result.classList.add('show');
          }
        } catch (error) {
          resultContent.innerHTML = \`<div class="error">请求失败: \${error.message}</div>\`;
          result.classList.add('show');
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = '生成八字命盘';
        }
      });

      function displayResult(data) {
        let html = \`
          <div class="bazi-info">
            <div class="info-item"><strong>性别:</strong> \${data.性别}</div>
            <div class="info-item"><strong>阳历:</strong> \${data.阳历}</div>
            <div class="info-item"><strong>农历:</strong> \${data.农历}</div>
            <div class="info-item"><strong>生肖:</strong> \${data.生肖}</div>
            <div class="info-item"><strong>八字:</strong> \${data.八字}</div>
            <div class="info-item"><strong>日主:</strong> \${data.日主}</div>
          </div>

          <h3 style="margin-top: 30px; margin-bottom: 15px; color: #667eea;">四柱详情</h3>
          <div class="pillars">
            <div class="pillar">
              <h3>年柱</h3>
              <div class="pillar-char">\${data.年柱.天干.天干}\${data.年柱.地支.地支}</div>
              <div>\${data.年柱.纳音}</div>
            </div>
            <div class="pillar">
              <h3>月柱</h3>
              <div class="pillar-char">\${data.月柱.天干.天干}\${data.月柱.地支.地支}</div>
              <div>\${data.月柱.纳音}</div>
            </div>
            <div class="pillar">
              <h3>日柱</h3>
              <div class="pillar-char">\${data.日柱.天干.天干}\${data.日柱.地支.地支}</div>
              <div>\${data.日柱.纳音}</div>
            </div>
            <div class="pillar">
              <h3>时柱</h3>
              <div class="pillar-char">\${data.时柱.天干.天干}\${data.时柱.地支.地支}</div>
              <div>\${data.时柱.纳音}</div>
            </div>
          </div>
        \`;

        if (data.神煞) {
          html += \`
            <h3 style="margin-top: 30px; margin-bottom: 15px; color: #667eea;">神煞</h3>
            <div class="bazi-info">
          \`;
          for (const [key, value] of Object.entries(data.神煞)) {
            if (Array.isArray(value) && value.length > 0) {
              html += \`<div class="info-item"><strong>\${key}:</strong> \${value.join('、')}</div>\`;
            }
          }
          html += \`</div>\`;
        }

        resultContent.innerHTML = html;
      }
    </script>
  </body>
</html>
`;

// 处理请求
export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // 处理 CORS 预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // 首页
      if (path === '/' || path === '/index.html') {
        return new Response(HTML_CONTENT, {
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            ...corsHeaders,
          },
        });
      }

      // API: 生成八字
      if (path === '/api/bazi' && request.method === 'POST') {
        const body = await request.json();
        const { dateType, solarDatetime, lunarDatetime, gender, eightCharProviderSect } = body;

        // 验证输入
        if (!dateType || (dateType !== 'solar' && dateType !== 'lunar')) {
          return new Response(
            JSON.stringify({
              success: false,
              error: '请选择日期类型（公历或农历）',
            }),
            {
              status: 400,
              headers: { 'Content-Type': 'application/json', ...corsHeaders },
            },
          );
        }

        if (dateType === 'solar' && !solarDatetime) {
          return new Response(
            JSON.stringify({
              success: false,
              error: '请输入公历日期时间',
            }),
            {
              status: 400,
              headers: { 'Content-Type': 'application/json', ...corsHeaders },
            },
          );
        }

        if (dateType === 'lunar' && !lunarDatetime) {
          return new Response(
            JSON.stringify({
              success: false,
              error: '请输入农历日期时间',
            }),
            {
              status: 400,
              headers: { 'Content-Type': 'application/json', ...corsHeaders },
            },
          );
        }

        if (gender === undefined || gender === null) {
          return new Response(
            JSON.stringify({
              success: false,
              error: '请选择性别',
            }),
            {
              status: 400,
              headers: { 'Content-Type': 'application/json', ...corsHeaders },
            },
          );
        }

        // 调用核心函数生成八字
        const baziData = await getBaziDetail({
          solarDatetime: dateType === 'solar' ? solarDatetime : undefined,
          lunarDatetime: dateType === 'lunar' ? lunarDatetime : undefined,
          gender: Number(gender),
          eightCharProviderSect: Number(eightCharProviderSect) || 2,
        });

        return new Response(
          JSON.stringify({
            success: true,
            data: baziData,
          }),
          {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          },
        );
      }

      // API: 健康检查
      if (path === '/api/health' && request.method === 'GET') {
        return new Response(
          JSON.stringify({
            status: 'ok',
            message: '八字命盘生成服务运行正常',
            timestamp: new Date().toISOString(),
          }),
          {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          },
        );
      }

      // API: 获取黄历
      if (path === '/api/calendar' && request.method === 'POST') {
        const body = await request.json();
        const { solarDatetime } = body;
        const calendar = await getChineseCalendar({ solarDatetime });
        return new Response(
          JSON.stringify({
            success: true,
            data: calendar,
          }),
          {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          },
        );
      }

      // API: 根据八字获取可能的阳历时间
      if (path === '/api/solar-times' && request.method === 'POST') {
        const body = await request.json();
        const { bazi } = body;
        const solarTimes = await getSolarTimes({ bazi });
        return new Response(
          JSON.stringify({
            success: true,
            data: solarTimes,
          }),
          {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          },
        );
      }

      // 404
      return new Response('Not Found', { status: 404, headers: corsHeaders });
    } catch (error: any) {
      console.error('处理请求时出错:', error);
      return new Response(
        JSON.stringify({
          success: false,
          error: error.message || '服务器内部错误',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        },
      );
    }
  },
};
