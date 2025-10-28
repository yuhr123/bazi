import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { getBaziDetail } from './index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
app.use(express.static(path.join(__dirname, '../public')));

// API 路由 - 生成八字命盘
app.post('/api/bazi', async (req, res) => {
  try {
    const { dateType, solarDatetime, lunarDatetime, gender, eightCharProviderSect } = req.body;

    // 验证输入
    if (!dateType || (dateType !== 'solar' && dateType !== 'lunar')) {
      return res.status(400).json({
        success: false,
        error: '请选择日期类型（公历或农历）',
      });
    }

    if (dateType === 'solar' && !solarDatetime) {
      return res.status(400).json({
        success: false,
        error: '请输入公历日期时间',
      });
    }

    if (dateType === 'lunar' && !lunarDatetime) {
      return res.status(400).json({
        success: false,
        error: '请输入农历日期时间',
      });
    }

    if (gender === undefined || gender === null) {
      return res.status(400).json({
        success: false,
        error: '请选择性别',
      });
    }

    // 调用核心函数生成八字
    const baziData = await getBaziDetail({
      solarDatetime: dateType === 'solar' ? solarDatetime : undefined,
      lunarDatetime: dateType === 'lunar' ? lunarDatetime : undefined,
      gender: Number(gender),
      eightCharProviderSect: Number(eightCharProviderSect) || 2,
    });

    res.json({
      success: true,
      data: baziData,
    });
  } catch (error: any) {
    console.error('生成八字命盘时出错:', error);
    res.status(500).json({
      success: false,
      error: error.message || '生成八字命盘失败，请检查输入的日期时间格式',
    });
  }
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: '八字命盘生成服务运行正常',
    timestamp: new Date().toISOString(),
  });
});

// 启动服务器
const port = parseInt(process.env.WEB_PORT || '8080');
app
  .listen(port, () => {
    console.log(`\n🎋 八字命盘 Web 服务已启动！`);
    console.log(`\n访问地址: http://localhost:${port}`);
    console.log(`API 端点: http://localhost:${port}/api/bazi\n`);
  })
  .on('error', (error: any) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`❌ 端口 ${port} 已被占用，请尝试其他端口`);
      console.error(`   可以设置环境变量: WEB_PORT=8081 npm run web\n`);
    } else {
      console.error('❌ 服务器启动失败:', error);
    }
    process.exit(1);
  });
