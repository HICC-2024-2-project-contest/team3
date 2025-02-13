'use strict';

import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.redirect('/settings/account');
});

router.get('/account', (req, res) => {
  res.render('index', {
    title: '계정 정보 - 설정',
    page: 'auth/settings/index',
    parts: ['nav', 'footer'],
    setting: 'account',
  });
});

router.get('/change-password', (req, res) => {
  res.render('index', {
    title: '비밀번호 변경 - 설정',
    page: 'auth/settings/index',
    parts: ['nav', 'footer'],
    setting: 'change-password',
  });
});

router.get('/block-records', (req, res) => {
  res.render('index', {
    title: '차단 내역 - 설정',
    page: 'auth/settings/index',
    parts: ['nav', 'footer'],
    setting: 'block-records',
  });
});

router.get('/report-records', (req, res) => {
  res.render('index', {
    title: '신고 내역 - 설정',
    page: 'auth/settings/index',
    parts: ['nav', 'footer'],
    setting: 'report-records',
  });
});

export default router;
