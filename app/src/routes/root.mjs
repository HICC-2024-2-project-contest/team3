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
    parts: [],
  });
});

router.get('/settings', (req, res) => {
  res.redirect('/settings/account');
});

router.get('/settings/account', (req, res) => {
  res.render('index', {
    title: '계정 정보 - 설정',
    page: 'auth/settings/index',
    parts: ['nav', 'footer'],
    setting: 'account',
  });
});

import gamesRouter from './games.mjs';
router.use('/g', gamesRouter);

import profilesRouter from './profiles.mjs';
router.use('/profiles', profilesRouter);

export default router;
