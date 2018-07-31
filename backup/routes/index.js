var express = require('express');
var router = express.Router();
var session = require('express-session');
router.use(session({secret: 'ssshhhhh'}));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
