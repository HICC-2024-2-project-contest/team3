'use strict';

import express from 'express';
const router = express.Router();

router.get('/login', (req, res) => {
  res.render('index', {
    title: '로그인',
    page: 'auth/login',
    parts: [],
  });
});

router.get('/register', (req, res) => {
  res.render('index', {
    title: '회원가입',
    page: 'auth/register',
    parts: [],
  });
});

router.get('/reset-password', (req, res) => {
  res.render('auth/reset-password', {
    title: '비밀번호 재설정',
    page: 'reset-password',
  });
});

export default router;
