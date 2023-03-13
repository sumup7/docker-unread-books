var express = require('express');
const Book = require('../models/book');
var router = express.Router();
const moment = require('moment-timezone');

/* GET home page. */
router.get('/', function(req, res, next) {
  const title = '積読管理アプリ';
  if (req.user) {
    Book.findAll({
      where:{
        createdBy: req.user.id,read:false
      },
      order:[['updatedAt', 'DESC']]
    }).then(unreadBooks => {
      Book.findAll({
        where:{
          createdBy: req.user.id,read:true
        },
        order:[['updatedAt', 'DESC']]
      }).then(readBooks => {
        Book.findAll({
          where:{
            read:false
          },
          order:[['updatedAt', 'DESC']]
        }).then(allUnreadBooks => {
          Book.findAll({
          where:{
            read:true
          },
          order:[['updatedAt', 'DESC']]
        }).then(allReadBooks => {
        readBooks.forEach((readBook) => {readBook.formattedUpdatedAt = moment(readBook.updatedAt).tz('Asia/Tokyo').format('YYYY/MM/DD HH:mm')});
        unreadBooks.forEach((unreadBook) => {unreadBook.formattedUpdatedAt = moment(unreadBook.updatedAt).tz('Asia/Tokyo').format('YYYY/MM/DD HH:mm')});
        allUnreadBooks.forEach((otherUnreadBook) => {otherUnreadBook.formattedUpdatedAt = moment(otherUnreadBook.updatedAt).tz('Asia/Tokyo').format('YYYY/MM/DD HH:mm')});
        allReadBooks.forEach((otherReadBook) => {otherReadBook.formattedUpdatedAt = moment(otherReadBook.updatedAt).tz('Asia/Tokyo').format('YYYY/MM/DD HH:mm')});
        res.render('index', {
        title: title,
        user: req.user,
        unreadBooks: unreadBooks,
        readBooks:readBooks,
        allUnreadBooks:allUnreadBooks,
        allReadBooks:allReadBooks
      });
      });
      });
      });
    });
    } else {
      res.render('index', { title: 'Express', user:req.user });
    }
});

module.exports = router;