import path from 'path';
import {fileURLToPath} from 'url';

import dotenv from 'dotenv';
import express from 'express';

import {translateCatMeow, type CatProfileInput} from './services/catTranslate.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

dotenv.config({path: path.join(rootDir, '.env.local')});
dotenv.config({path: path.join(rootDir, '.env')});

const app = express();
const PORT = Number(process.env.PORT) || 3001;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({limit: '2mb'}));

if (!isProd) {
  app.get('/', (_req, res) => {
    res.json({
      name: 'miaol-api',
      hint: '开发时请打开前端 http://localhost:3000（Vite 会把 /api 代理到本服务）。若直接访问本端口，请用 /api/health 或 POST /api/translate。',
      endpoints: {
        health: 'GET /api/health',
        translate: 'POST /api/translate',
      },
    });
  });
}

/** 显式挂在 app 上，避免子 Router 挂载在某些环境下匹配不到 POST。 */
app.get('/api/health', (_req, res) => {
  res.json({ok: true, service: 'miaol-api', ts: new Date().toISOString()});
});

app.post('/api/translate', async (req, res) => {
  try {
    const profile = req.body?.profile as CatProfileInput | undefined;
    if (
      !profile ||
      typeof profile.name !== 'string' ||
      typeof profile.age !== 'number' ||
      !Array.isArray(profile.personality) ||
      typeof profile.breed !== 'string'
    ) {
      res.status(400).json({
        error:
          '请求体应为 { profile: { name: string, age: number, personality: string[], breed: string } }',
      });
      return;
    }

    const result = await translateCatMeow({
      name: profile.name.trim() || '小猫咪',
      age: Number.isFinite(profile.age) ? profile.age : 1,
      personality: profile.personality.filter((p) => typeof p === 'string'),
      breed: profile.breed,
    });
    res.json(result);
  } catch (err) {
    console.error('[api/translate]', err);
    const message = err instanceof Error ? err.message : '服务器错误';
    const code =
      message.includes('GEMINI_API_KEY') || message.includes('API key')
        ? 503
        : 500;
    res.status(code).json({error: message});
  }
});

app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    res.status(404).json({error: 'Not found'});
    return;
  }
  next();
});

const distDir = path.join(rootDir, 'dist');

if (isProd) {
  app.use(express.static(distDir));
  app.get('*', (_req, res, next) => {
    res.sendFile(path.join(distDir, 'index.html'), (err) => {
      if (err) next(err);
    });
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[server] http://127.0.0.1:${PORT}`);
  console.log('[server] POST /api/translate  GET /api/health');
  if (!isProd) {
    console.log(`[server] 根路径说明: GET http://127.0.0.1:${PORT}/`);
  }
  if (isProd) {
    console.log(`[server] 静态资源: ${distDir}`);
  }
});
