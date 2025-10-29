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

      .form-group label {
        display: block;
        margin-bottom: 8px;
        font-weight: 600;
        color: #555;
        font-size: 14px;
      }

      .form-group input,
      .form-group select {
        width: 100%;
        padding: 12px;
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        font-size: 14px;
        transition: all 0.3s;
      }

      .form-group input:focus,
      .form-group select:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }

      .radio-group {
        display: flex;
        gap: 20px;
        margin-top: 8px;
      }

      .radio-item {
        display: flex;
        align-items: center;
        cursor: pointer;
      }

      .radio-item input[type='radio'] {
        width: auto;
        margin-right: 6px;
        cursor: pointer;
      }

      .button-group {
        display: flex;
        gap: 15px;
        margin-top: 30px;
      }

      button {
        flex: 1;
        padding: 14px 30px;
        font-size: 16px;
        font-weight: 600;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s;
      }

      .btn-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      }

      .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
      }

      .btn-secondary {
        background: #f5f5f5;
        color: #666;
      }

      .btn-secondary:hover {
        background: #e0e0e0;
      }

      .btn-copy {
        background: #4caf50;
        color: white;
      }

      .btn-copy:hover {
        background: #45a049;
        transform: translateY(-2px);
        box-shadow: 0 5px 20px rgba(76, 175, 80, 0.4);
      }

      .btn-download {
        background: #ff9800;
        color: white;
      }

      .btn-download:hover {
        background: #f57c00;
        transform: translateY(-2px);
        box-shadow: 0 5px 20px rgba(255, 152, 0, 0.4);
      }

      button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none !important;
      }

      .result-section {
        display: none;
      }

      .result-section.show {
        display: block;
      }

      .result-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
      }

      .result-header h2 {
        color: #667eea;
        font-size: 1.5em;
      }

      .result-actions {
        display: flex;
        gap: 10px;
      }

      .result-actions button {
        flex: none;
        padding: 10px 20px;
        font-size: 14px;
      }

      .json-output {
        background: #1e1e1e;
        color: #d4d4d4;
        padding: 20px;
        border-radius: 8px;
        font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
        font-size: 13px;
        line-height: 1.6;
        overflow-x: auto;
        max-height: 600px;
        overflow-y: auto;
      }

      .error-message {
        background: #ffebee;
        color: #c62828;
        padding: 15px;
        border-radius: 8px;
        border-left: 4px solid #c62828;
        margin-top: 20px;
        display: none;
      }

      .error-message.show {
        display: block;
      }

      .loading {
        text-align: center;
        padding: 20px;
        display: none;
      }

      .loading.show {
        display: block;
      }

      .loading-spinner {
        border: 3px solid #f3f3f3;
        border-top: 3px solid #667eea;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        margin: 0 auto 10px;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      .info-box {
        background: #e3f2fd;
        border-left: 4px solid #2196f3;
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 20px;
        font-size: 14px;
        color: #1565c0;
      }

      .date-input-group {
        display: none;
      }

      .date-input-group.active {
        display: block;
      }

      .example-text {
        font-size: 12px;
        color: #999;
        margin-top: 5px;
      }

      .footer {
        text-align: center;
        color: white;
        margin-top: 30px;
        opacity: 0.9;
      }

      .footer a {
        color: white;
        text-decoration: none;
        border-bottom: 1px solid rgba(255, 255, 255, 0.5);
      }

      .footer a:hover {
        border-bottom-color: white;
      }

      @media (max-width: 768px) {
        .header h1 {
          font-size: 1.8em;
        }

        .card {
          padding: 20px;
        }

        .button-group {
          flex-direction: column;
        }

        .result-header {
          flex-direction: column;
          align-items: flex-start;
          gap: 15px;
        }

        .result-actions {
          width: 100%;
        }

        .result-actions button {
          flex: 1;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>🎋 八字命盘生成器</h1>
        <p>生成 AI 适用的 JSON 格式精准八字命盘</p>
      </div>

      <div class="card">
        <div class="info-box">
          💡 <strong>使用提示：</strong>支持公历和农历两种输入方式，选择对应的日期类型后填写准确的出生时间即可生成完整的八字命盘
          JSON 数据。
        </div>

        <form id="baziForm">
          <!-- 日期类型选择 -->
          <div class="form-group">
            <label>日期类型 *</label>
            <div class="radio-group">
              <label class="radio-item">
                <input type="radio" name="dateType" value="solar" checked />
                <span>公历（阳历）</span>
              </label>
              <label class="radio-item">
                <input type="radio" name="dateType" value="lunar" />
                <span>农历（阴历）</span>
              </label>
            </div>
          </div>

          <!-- 公历日期输入 -->
          <div id="solarInputGroup" class="date-input-group active">
            <div class="form-group">
              <label for="solarDatetime">公历日期时间 *</label>
              <input
                type="datetime-local"
                id="solarDatetime"
                name="solarDatetime"
                placeholder="选择公历日期和时间"
              />
              <div class="example-text">示例：2000年5月15日 12:00</div>
            </div>
          </div>

          <!-- 农历日期输入 -->
          <div id="lunarInputGroup" class="date-input-group">
            <div class="form-group">
              <label for="lunarDatetime">农历日期时间 *</label>
              <input
                type="datetime-local"
                id="lunarDatetime"
                name="lunarDatetime"
                placeholder="选择农历日期和时间"
              />
              <div class="example-text">示例：农历 2000年5月15日 12:00（注意：这里输入的是农历的年月日）</div>
            </div>
          </div>

          <!-- 性别选择 -->
          <div class="form-group">
            <label>性别 *</label>
            <div class="radio-group">
              <label class="radio-item">
                <input type="radio" name="gender" value="1" checked />
                <span>男</span>
              </label>
              <label class="radio-item">
                <input type="radio" name="gender" value="0" />
                <span>女</span>
              </label>
            </div>
          </div>

          <!-- 早晚子时配置 -->
          <div class="form-group">
            <label for="eightCharProviderSect">早晚子时配置</label>
            <select id="eightCharProviderSect" name="eightCharProviderSect">
              <option value="2" selected>23:00-23:59 日干支为当天（推荐）</option>
              <option value="1">23:00-23:59 日干支为明天</option>
            </select>
            <div class="example-text">选择子时（23:00-23:59）的日干支计算方式</div>
          </div>

          <!-- 按钮组 -->
          <div class="button-group">
            <button type="submit" class="btn-primary">🎯 生成八字命盘</button>
            <button type="button" class="btn-secondary" onclick="resetForm()">🔄 重置表单</button>
          </div>
        </form>

        <!-- 加载状态 -->
        <div id="loading" class="loading">
          <div class="loading-spinner"></div>
          <p>正在生成命盘，请稍候...</p>
        </div>

        <!-- 错误信息 -->
        <div id="errorMessage" class="error-message"></div>
      </div>

      <!-- 结果显示区域 -->
      <div id="resultSection" class="card result-section">
        <div class="result-header">
          <h2>📋 命盘结果</h2>
          <div class="result-actions">
            <button class="btn-copy" onclick="copyResult()">📋 复制 JSON</button>
            <button class="btn-download" onclick="downloadResult()">💾 下载 JSON</button>
          </div>
        </div>
        <pre id="jsonOutput" class="json-output"></pre>
      </div>

      <div class="footer">
        <p>
          <a href="https://github.com/yuhr123/bazi" target="_blank">GitHub 仓库</a>
        </p>
      </div>
    </div>

    <script>
      let currentResult = null;

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

      // 显示结果
      function showResult(data) {
        const jsonOutput = document.getElementById('jsonOutput');
        jsonOutput.textContent = JSON.stringify(data, null, 2);
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

        const jsonString = JSON.stringify(currentResult, null, 2);
        navigator.clipboard
          .writeText(jsonString)
          .then(() => {
            alert('✅ JSON 数据已复制到剪贴板！');
          })
          .catch((err) => {
            console.error('复制失败:', err);
            alert('❌ 复制失败，请手动选择文本复制');
          });
      }

      // 下载结果
      function downloadResult() {
        if (!currentResult) return;

        const jsonString = JSON.stringify(currentResult, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;

        // 生成文件名：八字_性别_日期时间.json
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const bazi = currentResult['八字'] || 'bazi';
        const gender = currentResult['性别'] || '';
        a.download = \`八字命盘_\${bazi.replace(/\\s/g, '_')}_\${gender}_\${timestamp}.json\`;

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
        // 重置日期类型显示
        document.getElementById('solarInputGroup').classList.add('active');
        document.getElementById('lunarInputGroup').classList.remove('active');
      }

      // 页面加载时设置当前日期时间
      window.addEventListener('DOMContentLoaded', () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hour = String(now.getHours()).padStart(2, '0');
        const minute = String(now.getMinutes()).padStart(2, '0');

        document.getElementById('solarDatetime').value = \`\${year}-\${month}-\${day}T\${hour}:\${minute}\`;
      });
    </script>
  </body>
</html>
`;

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
        // 重置日期类型显示
        document.getElementById('solarInputGroup').classList.add('active');
        document.getElementById('lunarInputGroup').classList.remove('active');
      }

      // 页面加载时设置当前日期时间
      window.addEventListener('DOMContentLoaded', () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hour = String(now.getHours()).padStart(2, '0');
        const minute = String(now.getMinutes()).padStart(2, '0');

        document.getElementById('solarDatetime').value = \`\${year}-\${month}-\${day}T\${hour}:\${minute}\`;
      });
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
