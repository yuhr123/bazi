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
        a.download = `八字命盘_${bazi.replace(/\s/g, '_')}_${gender}_${timestamp}.json`;

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

        document.getElementById('solarDatetime').value = `${year}-${month}-${day}T${hour}:${minute}`;
      });