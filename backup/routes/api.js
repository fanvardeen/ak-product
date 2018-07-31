var express = require('express');
var router = express.Router();
var fs = require('fs');
var commonmethods = require('../lib/commonHelper.js');

/* GET Home page. */
router.get('/', function(req, res, next) {
  if(req.session.userdata != null){
  console.log(req.session.userdata);
    res.render('index', {Userdetails: req.session.userdata});
  }
    else
    { console.log('hi1');
      res.render('index');
    }
});
 
router.get('/index', function(req, res, next) {
  if(req.session.userdata != null){
    console.log(req.session.userdata);
    res.render('index', {Userdetails: req.session.userdata});
  }
 
  else{
    console.log('hi2');
    res.render('index');
  }
  });

/* GET registration page. */
router.get('/registration', function (req, res, next) {
    res.render('registration',{Userdetails: req.session.userdata});
  });
/* GET Login page. */
router.get('/login', function (req, res, next) {
  res.render('login',{Userdetails: req.session.userdata});
});
/* GET Login page. */
router.get('/logout', function (req, res, next) {
  req.session.userdata = null;
  console.log( req.session.userdata);
  res.render('index');
});
/* GET Product list. */
router.get('/products', function (req, res, next) {  
  commonmethods.getProductList(function(err,data){    
    if (err)
      res.json({status: 'ERROR',error:err});
     else{
       console.log(req.session.userdata);
     res.render('products', {productitems: data, Userdetails: req.session.userdata});
     }
  });  
});

/* GET Filtered Product list. */
router.post('/filteredproducts', function (req, res, next) {   
  var searchcontent =  req.body.txtsearch; 
  console.log(searchcontent);
  commonmethods.getFilteredProductList(searchcontent,function(err,data){    
    if (err)
      res.json({status: 'ERROR',error:err});
     else{      
     res.render('products', {productitems: data, Userdetails: req.session.userdata});
     }
  });  
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
      Status:"0"
    };
       console.log(user);
    commonmethods.writeFile(user,function(err,data){
      if (err)
      res.render('registration',{statuserror: 'ERROR',msg:'A problem has been occurred while submitting your data. please try again!!'});
       else
       {
         if(data=='success')
         res.render('registration',{statussuccess: 'success',msg:'Successfully saved data and send email on registered email id for Verifiaction. Kindly verify email id for activate your account',Userdetails: req.session.userdata});
         else
         res.render('registration',{statuserror: 'ERROR',msg:'record exist, please try with new userid and email', Userdetails: req.session.userdata});
       }  
    });
  }); 
router.post('/users/validatelogin', function (req, res, next) {
    var user = {
      UserId: req.body.userid,   
      Password: req.body.password
    };
    //console.log(user);
    commonmethods.ValidateLogin(user,function(err,data){
      if (err)
       res.render('registration',{statuserror: 'ERROR',msg:'A problem has been occurred in login. please try again!!'});
       /*res.json({status: 'ERROR',error:err});*/

       else{
         if(data == 'notfound')
         res.render('login',{statuserror: 'ERROR',msg:'LoginId/Password mismatch, please try again!!'});
         else {  
          
          var userdata = {
            UserId: data[0].UserId,   
            username: data[0].FName + ' ' + data[0].LName         
          };
          req.session.userdata = userdata; 
         //console.log(userdata);
        
          res.render('index', {Userdetails: userdata});        
         } 
         /*res.render('loginuser', { items: data});*/
       }
     });   
  });
  
router.post('/users/valdiateEmail', function (req, res, next) {
    var user = {
      id: req.body.id,   
      password: req.body.password
    };
    commonmethods.ValidateLogin(user,function(err,data){
      if (err)
        res.json({status: 'ERROR',error:err});
       else{
         if(data == 'notfound')
         res.json({status: 'INFO',info:'Login Id not found in record !!'});
         else      
         res.render('loginuser', { items: data},{Userdetails: req.session.userdata});
       }
     });   
  });

module.exports = router;