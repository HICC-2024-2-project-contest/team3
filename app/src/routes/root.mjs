'use strict';

import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', {
    title: '우당탕탕 TRPG 대작전',
    page: 'root',
    parts: ['nav', 'footer'],
  });
});

import authRouter from './auth.mjs';
router.use('/a', authRouter);

import gamesRouter from './games.mjs';
router.use('/g', gamesRouter);

import profilesRouter from './profiles.mjs';
router.use('/p', profilesRouter);

export default router;
