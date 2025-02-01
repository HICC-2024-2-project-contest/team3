'use strict';

import config from './config.mjs';

import express from 'express';

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/* static (public) 파일 설정 */
app.use(express.static(path.resolve(__dirname, './public')));

/* 기능 설정 */
app.disable('x-powered-by');

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: 104857600 }));

/* 미들웨어 설정 */
import middlewares from './modules/middlewares/index.mjs';
app.use(middlewares.cookies());
app.use(middlewares.headers(config.headers));

/* 템플릿 엔진 설정 */
import TemplateEngine from './modules/engine.mjs';

const engine = new TemplateEngine({
  views: path.resolve(__dirname, './views'),
});
app.engine('html', engine.render.bind(engine));
app.set('view engine', 'html');
app.set('views', engine.views);
app.use(engine.use.bind(engine));

/* 루트 라우터 불러오기 */
import router from './routes/root.mjs';
app.use('/', router);

/* Fallback 404 처리 */
app.all('*', (req, res) => {
  res.status(404).render('error/404');
});

export default app;
