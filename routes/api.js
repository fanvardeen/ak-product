var express = require('express');
var router = express.Router();
var fs = require('fs');
var commonmethods = require('../lib/commonHelper.js');

/* GET Home page. */
router.get('/', function (req, res, next) {
  if (req.session.userdata != null) {
    res.render('index', { Userdetails: req.session.userdata });
  }
  else {
    res.render('index');
  }
});

router.get('/index', function (req, res, next) {
  if (req.session.userdata != null) {
    res.render('index', { Userdetails: req.session.userdata });
  }
  else {
    res.render('index');
  }
});

/* GET registration page. */
router.get('/registration', function (req, res, next) {
  res.render('registration', { Userdetails: req.session.userdata });
});
/* GET Login page. */
router.get('/login', function (req, res, next) {
  res.render('login', { Userdetails: req.session.userdata });
});
/* GET Login page. */
router.get('/logout', function (req, res, next) {
  req.session.userdata = null;  
  res.render('index');
});
/* GET Product list. */
router.get('/products', function (req, res, next) {
  commonmethods.getProductList(req, function (err, data) {
    if (err)
      res.json({ status: 'ERROR', error: err });
    else {
      res.render('products', { productitems: data, Userdetails: req.session.userdata });
    }
  });
});

/* GET Filtered Product list. */
router.post('/filteredproducts', function (req, res, next) {
  var searchcontent = req.body.txtsearch;
  commonmethods.getFilteredProductList(searchcontent, function (err, data) {
    if (err)
      res.json({ status: 'ERROR', error: err });
    else {
      res.render('products', { productitems: data, Userdetails: req.session.userdata });
    }
  });
});
/*product add to cart*/
router.post('/addtocart/:id', function (req, res, next) {
  var pid = req.params.id;
  var userDetails = null;
  if (req.session.userdata == undefined) {
    userDetails = {
      UserId: '',
      username: '',
      selectedProducts: '',
      selectedProductsCount: ''
    };
  }
  else {
    userDetails = req.session.userdata;
  }

  if (userDetails.selectedProducts == '') {
    userDetails.selectedProducts = pid;
  }
  else
    userDetails.selectedProducts += ',' + pid;

  var ProductCountSplit = userDetails.selectedProducts.split(",");
  userDetails.selectedProductsCount = ProductCountSplit.length;
  req.session.userdata = userDetails;
  // Add Items in Data table if user loogedin
  var userSelctedData = null;
  try {
    if (userDetails.UserId != '' && userDetails.username != '') {
      var userSelctedData = {
        id: '',
        uid: userDetails.UserId,
        pids: userDetails.selectedProducts,
        status: '1'
      }
      commonmethods.userSelectedProduct(userSelctedData,req,'ADD', function (err, data) {
        console.log('hi- select-db add');
        if (err)
          console.log({ status: 'ERROR', error: err });
        else {
          console.log('User selcted data::', { UserSelectedProduct: userSelctedData, Userdetails: req.session.userdata });
        }
      });
    }
  }
  catch (exception) {
    console.log(exception);
  }
  // End
  res.json({ status: 'success', Userdetails: req.session.userdata });
});

/*product remove from cart*/
router.post('/removetocart/:id', function (req, res, next) {
  var pid = req.params.id;
  if (req.session.userdata != undefined && req.session.userdata.selectedProducts != '') {
    //var PidMatch = req.session.userdata.selectedProducts.includes(pid); 
    var userDetails = req.session.userdata;
    var ProductCountSplit = userDetails.selectedProducts.split(",");
    var filteredAry = ProductCountSplit.filter(function (e) { return e !== pid });
    
    if (userDetails.UserId != undefined && userDetails.UserId != ''){
      var userSelctedData = {
        id: '',
        uid: userDetails.UserId,
        pids: filteredAry.join(','),
        status: '1'
      }
      commonmethods.userSelectedProduct(userSelctedData,req,'REMOVE', function (err, data) {
        console.log('selected product removed');
        console.log(req.session.userdata)
        if (err)
          console.log({ status: 'ERROR', error: err });
        else {
          console.log('User selcted data::', { UserSelectedProduct: userSelctedData, Userdetails: req.session.userdata });
        }
      });      
    }
    else {     
      req.session.userdata.selectedProducts = filteredAry.join(',');
      req.session.userdata.selectedProductsCount = filteredAry.length;
    }
  }
  res.json({ status: 'success', Userdetails: req.session.userdata });
});

/* Add registration form info. */
router.post('/users/add', function (req, res, next) {
  var user = {
    UserId: req.body.userid,
    Password: req.body.password,
    RegType: req.body.regtype,
    Role: req.body.regtype == "1" ? "8" : "9",
    Fname: req.body.firstname,
    Lname: req.body.lastname,
    Email: req.body.email,
    Mobile: req.body.mobile,
    Status: "0"
  };
  commonmethods.writeFile(user, function (err, data) {
    if (err)
      res.render('registration', { statuserror: 'ERROR', msg: 'A problem has been occurred while submitting your data. please try again!!' });
    else {
      if (data == 'success')
        res.render('registration', { statussuccess: 'success', msg: 'Successfully saved data and send email on registered email id for Verifiaction. Kindly verify email id for activate your account', Userdetails: req.session.userdata });
      else
        res.render('registration', { statuserror: 'ERROR', msg: 'record exist, please try with new userid and email', Userdetails: req.session.userdata });
    }
  });
});

/* Validate login */
router.post('/users/validatelogin', function (req, res, next) {
  var user = {
    UserId: req.body.userid,
    Password: req.body.password
  };
  commonmethods.ValidateLogin(user, function (err, data) {      
    if (err)
      res.render('registration', { statuserror: 'ERROR', msg: 'A problem has been occurred in login. please try again!!' });
    /*res.json({status: 'ERROR',error:err});*/
    
    else {     
      if (data == 'notfound') {       
        res.render('login', { statuserror: 'ERROR', msg: 'LoginId/Password mismatch, please try again!!' });
      }
      else {        
        var ProductCount = 0;
        var userDetails = null;
        
        if (req.session.userdata == null || req.session.userdata == undefined) {
          userDetails = {
            UserId: data[0].UserId,
            username: data[0].FName + ' ' + data[0].LName,
            selectedProducts:  '',
            selectedProductsCount: 0
          };
        }
        else {
          userDetails = req.session.userdata;
          userDetails.UserId = data[0].UserId;
          userDetails.username = data[0].FName + ' ' + data[0].LName;          
        }

        var userSelctedData = {
          id: '',
          uid: userDetails.UserId,
          pids: userDetails.selectedProducts,
          status: '1'
        }
        commonmethods.userSelectedProduct(userSelctedData,req, 'ADD', function (err, data) {
          console.log('selected product added');
          if (err)
            console.log({ status: 'ERROR', error: err });
          else {
            console.log('User selcted data::', { UserSelectedProduct: userSelctedData, Userdetails: req.session.userdata });
          }
        });


      }
     
      req.session.userdata = userDetails;

      res.render('index', { Userdetails: userDetails });
    }
    /*res.render('loginuser', { items: data});*/
  });
});

/* Validate Email */
router.post('/users/valdiateEmail', function (req, res, next) {
  var user = {
    id: req.body.id,
    password: req.body.password
  };
  commonmethods.ValidateLogin(user, function (err, data) {
    if (err)
      res.json({ status: 'ERROR', error: err });
    else {
      if (data == 'notfound')
        res.json({ status: 'INFO', info: 'Login Id not found in record !!' });
      else
        res.render('loginuser', { items: data }, { Userdetails: req.session.userdata });
    }
  });
});

module.exports = router;