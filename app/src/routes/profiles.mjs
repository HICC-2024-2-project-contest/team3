'use strict';

import express from 'express';
const router = express.Router();

router.get('/:pid', (req, res) => {
  console.log(req.client);
  res.render('index', {
    title: '프로필',
    page: 'profiles/index',
    tab: 'root',
    parts: ['nav', 'footer'],
    pid: req.params.pid,
    client: req.client,
  });
});

router.get('/:pid/play-history', (req, res) => {
  res.render('index', {
    title: '프로필',
    page: 'profiles/index',
    tab: 'history',
    parts: ['nav', 'footer'],
    pid: req.params.pid,
  });
});

router.get('/:pid/workshop', (req, res) => {
  res.render('index', {
    title: '프로필',
    page: 'profiles/index',
    tab: 'workshop',
    parts: ['nav', 'footer'],
    pid: req.params.pid,
  });
});

export default router;
