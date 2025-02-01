'use strict';

import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  if (req.cookies.booth) {
    res.redirect(`/dash`);
  } else {
    res.redirect(`/auth`);
  }
});

router.get('/error/403', (req, res) => {
  res.render('error/403');
});
router.get('/done', (req, res) => {
  res.render('error/403-done');
});

import dashRouter from './dash.mjs';
router.use('/dash', dashRouter);

import authRouter from './auth.mjs';
router.use('/auth', authRouter);

import userRouter from './user.mjs';
router.use('/user', userRouter);

import qrRouter from './qr.mjs';
router.use('/qr', qrRouter);

export default router;
