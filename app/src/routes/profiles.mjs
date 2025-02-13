'use strict';

import express from 'express';
const router = express.Router();

router.get('/:pid', (req, res) => {
  console.log(req.client);
  res.render('index', {
    title: '프로필',
    page: 'profiles/index',
    parts: ['nav', 'footer'],
    tab: 'profile',
    pid: req.params.pid,
    client: req.client,
  });
});

router.get('/:pid/history', (req, res) => {
  res.render('index', {
    title: '프로필',
    page: 'profiles/index',
    parts: ['nav', 'footer'],
    tab: 'history',
    pid: req.params.pid,
  });
});

router.get('/:pid/workshop', (req, res) => {
  res.render('index', {
    title: '프로필',
    page: 'profiles/index',
    parts: ['nav', 'footer'],
    tab: 'workshop',
    pid: req.params.pid,
  });
});

export default router;
