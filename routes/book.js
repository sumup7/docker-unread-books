'use strict';
const express = require('express');
const router = express.Router();
const authenticationEnsurer = require('./authentication-ensurer');
const uuid = require('uuid');
const Book = require('../models/book');
const User = require('../models/user');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });
// let photoUrl;
router.get('/new', authenticationEnsurer, csrfProtection, (req, res, next) => {
  res.render('new', { user: req.user, csrfToken:req.csrfToken() });
});

router.post('/', authenticationEnsurer, csrfProtection, (req, res, next) => {
  const bookId = uuid.v4();
  const updatedAt = new Date();
  Book.create({
    bookId: bookId,
    bookTitle: req.body.bookTitle.slice(0, 255) || ' (タイトル未設定) ',
    author: req.body.author.slice(0, 255) || ' (著者未設定）',
    publisher: req.body.publisher.slice(0, 255) || ' (出版社未設定）',
    memo: req.body.memo,
    read: false,
    photo: req.body.photoUrl,
    createdBy: req.user.id,
    updatedAt: updatedAt
  }).then(() => {
    res.redirect('/');})
});

router.get('/:bookId', authenticationEnsurer, csrfProtection,(req, res, next) => {
  Book.findOne({
    include: [
      {
        model: User,
        attributes:['userId', 'username']
      }],
      where: {
        bookId: req.params.bookId
      },
      order:[['updatedAt', 'DESC']]
  }).then((book) => {
    if (book) {
    res.render('book', {
      user: req.user,
      book:book,
      users: [req.user],
      csrfToken:req.csrfToken()
    });
} else {
  const err = new Error('指定された予定は見つからない');
  err.status = 404;
  next(err);
}
});
});

router.get('/:bookId/edit', authenticationEnsurer, csrfProtection,(req, res, next) => {
  Book.findOne({
    include: [
      {
        model: User,
        attributes:['userId', 'username']
      }],
    where: {
      bookId: req.params.bookId
    }
  }).then((book) => {
    if (isMine(req, book)) {// 作成者のみが編集フォームを開ける
      res.render('edit', {
        user: req.user,
        book: book,
        csrfToken:req.csrfToken()
      });
    }else {
      const err = new Error('指定された本の情報がない、または、本の編集する権限がありません');
    }
  });
});

router.post('/:bookId', authenticationEnsurer, csrfProtection,(req, res, next) => {
  Book.findOne({
    where: {
      bookId: req.params.bookId
    }
  }).then((book) => {
    if (book && isMine(req, book)) {
      if (parseInt(req.query.edit) === 1) {
        const updatedAt = new Date();
        book.update({
          bookId:book.bookId,
          bookTitle: req.body.bookTitle.slice(0, 255) || '（名称未設定）',
          author: req.body.author.slice(0, 255) || '（名称未設定）',
          publisher: req.body.publisher.slice(0, 255) || '（名称未設定）',
          memo: req.body.memo,
          createdBy: req.user.id,
          updatedAt: updatedAt
        }).then((book) => {
            res.redirect('/book/' + book.bookId);
          }
      ); } else if(parseInt(req.query.read) === 1) {
          const updatedAt = new Date();
          book.update({
            read:true
          }).then(() => {
              res.redirect('/');
      });
      } else {
        const err = new Error('不正なリクエストです');
        err.status = 400;
        next(err);
      }
    } else {
      const err = new Error('指定された本の情報がない、または、編集する権限がありません');
      err.status = 404;
      next(err);
    }
  });
});

function isMine(req, book) {
  return book && parseInt(book.createdBy) === parseInt(req.user.id);
}

module.exports = router;