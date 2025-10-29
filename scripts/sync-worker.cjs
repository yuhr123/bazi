#!/usr/bin/env node

/**
 * 同步 public/ 目录的文件到 worker.ts
 * 使用方法: node scripts/sync-worker.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔄 开始同步静态资源到 worker.ts...\n');

// 读取文件
const htmlContent = fs.readFileSync('public/index.html', 'utf8');
const cssContent = fs.readFileSync('public/css/style.css', 'utf8');
const jsContent = fs.readFileSync('public/js/app.js', 'utf8');

// 转义特殊字符
const escape = (str) =>
  str.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');

// 生成 worker.ts
const workerContent = `import { getBaziDetail, getChineseCalendar, getSolarTimes } from './index.js';

// 静态资源内容
const HTML_CONTENT = \`${escape(htmlContent)}\`;

const CSS_CONTENT = \`${escape(cssContent)}\`;

const JS_CONTENT = \`${escape(jsContent)}\`;

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
      // 静态资源路由
      if (path === '/' || path === '/index.html') {
        return new Response(HTML_CONTENT, {
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            ...corsHeaders,
          },
        });
      }

      if (path === '/css/style.css') {
        return new Response(CSS_CONTENT, {
          headers: {
            'Content-Type': 'text/css; charset=utf-8',
            'Cache-Control': 'public, max-age=86400',
            ...corsHeaders,
          },
        });
      }

      if (path === '/js/app.js') {
        return new Response(JS_CONTENT, {
          headers: {
            'Content-Type': 'application/javascript; charset=utf-8',
            'Cache-Control': 'public, max-age=86400',
            ...corsHeaders,
          },
        });
      }

      // API: 生成八字
      if (path === '/api/bazi' && request.method === 'POST') {
        const body = (await request.json()) as any;
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
        const body = (await request.json()) as any;
        const { solarDatetime } = body;
        const calendar = await getChineseCalendar(solarDatetime);
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
        const body = (await request.json()) as any;
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
`;

// 写入文件
fs.writeFileSync('src/worker.ts', workerContent);

console.log('✅ HTML: public/index.html');
console.log('✅ CSS:  public/css/style.css');
console.log('✅ JS:   public/js/app.js');
console.log('\n✅ worker.ts 已更新！');
console.log(`📦 文件大小: ${Math.round(workerContent.length / 1024)} KB\n`);
