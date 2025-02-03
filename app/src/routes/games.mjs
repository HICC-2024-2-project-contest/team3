'use strict';

import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', {
    title: '게임 목록',
    page: 'games/index',
    parts: ['nav', 'footer'],
  });
});

export default router;
