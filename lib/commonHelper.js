var fs = require('fs');
var uscore = require("underscore");

var commonmethods = {
readFile : function(cb) {
	fs.readFile('./data/login.data', function (err, content) {
		if (err) 
		cb(err,undefined);
		
		var data = JSON.parse(content.toString());
		cb(undefined,data.users);
	  });	 
},
getProductList : function(cb) {
	fs.readFile('./data/products.data', function (err, content) {		
		if (err) 
		cb(err,undefined);
		
		var data = JSON.parse(content.toString());
		cb(undefined,data.ProductList);
	  });	 
},
getFilteredProductList : function(searchcontent, cb) {
	fs.readFile('./data/products.data', function (err, content) {		
		if (err) 
		cb(err,undefined);		
		
		var data = JSON.parse(content.toString());		
		var filterdata = uscore.where(data.ProductList, {ProdcutName: searchcontent});		
		cb(undefined, filterdata);
	  });	 
},
writeFile : function(user, cb) {
	fs.readFile('./data/users.data', function (err, content) {
		if (err)  	
		cb(err,undefined);
    
		var data = JSON.parse(content.toString());	
		console.log("1 - " + data);	
		var users = data.users;	
	 var filterdata = uscore.where(data.users, {Userid: user.UserId, Email: user.Email});
	 console.log("2");	
	   if(filterdata.length == 0){
			data.users.push(user);
			console.log("3");	
		fs.writeFile('./data/users.data', JSON.stringify(data), function (err) {
		  if (err)
		   cb(err,undefined);

		   cb(undefined,"success");
		})
	  }  
	   else{  cb(undefined,"exist"); } 
	  })
},
ValidateLogin : function(user,cb) {
	fs.readFile('./data/users.data', function (err, content) {
	   if (err) 
		cb(err,undefined)		 
	
		var data = JSON.parse(content.toString());  
			var filterdatabyUserid = uscore.where(data.users, {UserId: user.UserId, Password:user.Password});
			var filterdatabyEmail = uscore.where(data.users, {Email: user.Email, Password:user.Password});
		
			if(filterdatabyUserid.length > 0)
			 cb(undefined,filterdatabyUserid);
			 else if(filterdatabyEmail.length > 0)
			 cb(undefined,filterdatabyEmail);
			 else
			 cb(undefined,'notfound');		
		  });
	
},
CheckAvaialbility : function(user,cb) {
	fs.readFile('./data/users.data', function (err, content) {
	   if (err) 
		cb(err,undefined)		 
	
		var data = JSON.parse(content.toString());  
	    var filterdata = uscore.where(data.users, {id: user.id});
			//res.render('loginuser', { items: filterdata});
			if(filterdata.length > 0)		
			 cb(undefined,'found');			
			 else
			 cb(undefined,'notfound');
			 
		  });	
}
} //End

module.exports = commonmethods;