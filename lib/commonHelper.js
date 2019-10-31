var fs = require('fs');
var uscore = require("underscore");
var jsonQuery = require('json-query')

var commonmethods = {
	readFile: function (cb) {
		fs.readFile('./data/login.data', function (err, content) {
			if (err)
				cb(err, undefined);

			var data = JSON.parse(content.toString());
			cb(undefined, data.users);
		});
	},

	getProductList: function (req, cb) {

		fs.readFile('./data/products.data', function (err, content) {
			if (err)
				cb(err, undefined);

			var data = JSON.parse(content.toString());

			if (req.session.userdata != undefined) {
				if (req.session.userdata.selectedProducts != undefined || req.session.userdata.selectedProducts != '') {
					var PrdSelectedSplit = req.session.userdata.selectedProducts.split(",");

					data.ProductList.forEach(function (prd) {
						var PrdId = prd.pid;

						if (PrdSelectedSplit.includes(PrdId))
							prd.selected = "true";

					});
				}
			}
			cb(undefined, data.ProductList);
		});
	},

	getFilteredProductList: function (searchcontent, cb) {
		fs.readFile('./data/products.data', function (err, content) {
			if (err)
				cb(err, undefined);

			var data = JSON.parse(content.toString());


			/*var dataaa = {
				people: [
					{name: 'Matt', country: 'NZ'},
					{name: 'Pete', country: 'AU'},
					{name: 'Mikey', country: 'NZ'}
				]
				}
				 var dataaa ;
				jsonQuery('data.ProductList[ProdcutName=Head Phone]', {
				dataaa: dataaa
				})
				console.log('newf' + dataaa);*/


			var filterdata = uscore.where(data.ProductList, { ProdcutName: searchcontent });
			cb(undefined, filterdata);

		});
	},

	getReceipeList: function (cb) {

		fs.readFile('./data/receipe.data', function (err, content) {
			if (err)
				cb(err, undefined);

			var data = JSON.parse(content.toString());
			cb(undefined, data.recipes);

		});
	},

	getFilteredReceipe: function (searchcontent, cb) {

		fs.readFile('./data/receipe.data', function (err, content) {
			if (err)
				cb(err, undefined);

				var data = JSON.parse(content.toString());
				var filterdata = uscore.where(data.recipes, { id: searchcontent });
				cb(undefined, filterdata);

		});
	},

	getMenuList: function (cb) {

		fs.readFile('./data/menu.data', function (err, content) {
			if (err)
				cb(err, undefined);

			var data = JSON.parse(content.toString());
			cb(undefined, data.menus);

		});
	},

	getFilteredMenu: function (searchcontent, cb) {

		fs.readFile('./data/menu.data', function (err, content) {
			if (err)
				cb(err, undefined);

				var data = JSON.parse(content.toString());
				var filterdata = uscore.where(data.menus, { id: searchcontent });
				cb(undefined, filterdata);

		});
	},

	userSelectedProduct: function (userproduct, req,cartType, cb) {
		fs.readFile('./data/userproduct.data', function (err, content) {
			if (err)
				cb(err, undefined);
	
			var data = JSON.parse(content.toString());
            console.log('cartType  ' + cartType);
			//var filterdata = uscore.contains(userPrd.users, {pid: userproduct.pid, uid: userproduct.uid});

			var filterdata = uscore.filter(data.UserSelectedProduct,
				function (itm) {
					return itm.uid == userproduct.uid
				});

			if (filterdata.length == 0) { //New Record
				data.UserSelectedProduct.push(userproduct);

				fs.writeFile('./data/userproduct.data', JSON.stringify(data), function (err) {
					if (err)
						cb(err, undefined);

					cb(undefined, "success");
				})
				
				if (req.session!= null && req.session.userdata != null) {
					req.session.userdata.selectedProducts = userproduct.pids;
					var userproductsplit = userproduct.pids.split(",");
					req.session.userdata.selectedProductsCount = userproductsplit.length;
				}

			}
			else { // Updated Record
				//cb(undefined, "exist"); 
				if (filterdata.length > 0) {
					var updatedPrdlist = 0;
					
					if (userproduct.pids != '') {
						var DBprdsplit, Currentprdsplit;
						if (filterdata[0].pids.includes(','))
							DBprdsplit = filterdata[0].pids.split(",");
						else
							DBprdsplit = filterdata[0].pids;

						if (userproduct.pids.includes(',') && cartType=='ADD') {
							Currentprdsplit = userproduct.pids.split(",");
							updatedPrdlist = DBprdsplit.concat(Currentprdsplit.filter(function (item) {
								return DBprdsplit.indexOf(item) < 0;
							}));

							updatedPrdlist = updatedPrdlist.join(',')
						}
						else if(cartType=='REMOVE'){
							console.log('Remove ' + userproduct.pids)
							updatedPrdlist = userproduct.pids;
						}
						else {
							updatedPrdlist = DBprdsplit.concat(",", userproduct.pids);
						}
				
						//filterdata = filterdata.filter(function(el){ return el.uid != userproduct.uid; });
						filterdata = commonmethods.findAndRemove(data.UserSelectedProduct, "uid", userproduct.uid);
						var pushdata = {
							id: filterdata.id,
							uid: userproduct.uid,
							pids: updatedPrdlist, //userproduct.pids,
							status: userproduct.status
						}

						var maxRow = uscore.max(data.UserSelectedProduct, function (row) { return row.id; });

						pushdata.id = parseInt(maxRow.id) + 1;
						data.UserSelectedProduct.push(pushdata);

						if (req.session!= null && req.session.userdata != null) {
							req.session.userdata.selectedProducts = updatedPrdlist;
							console.log(updatedPrdlist);
							var updatedPrdlistsplit = updatedPrdlist.split(",");     
							req.session.userdata.selectedProductsCount = updatedPrdlistsplit.length;
						}

						fs.writeFile('./data/userproduct.data', JSON.stringify(data), function (err) {
							if (err)
								cb(err, undefined);
							cb(undefined, "success");
						})
					}
					else {
						if (req.session.userdata != null && filterdata[0].pids != '') {
							req.session.userdata.selectedProducts = filterdata[0].pids;

							var filterdatasplit = filterdata[0].pids.split(",");                            
							req.session.userdata.selectedProductsCount = filterdatasplit.length;
						}
					}
				}
			}
		})
	},

	writeFile: function (user, cb) {
		fs.readFile('./data/users.data', function (err, content) {
			if (err)
				cb(err, undefined);

			var data = JSON.parse(content.toString());

			var users = data.users;
			var filterdata = uscore.where(data.users, { Userid: user.UserId, Email: user.Email });

			if (filterdata.length == 0) {
				data.users.push(user);

				fs.writeFile('./data/users.data', JSON.stringify(data), function (err) {
					if (err)
						cb(err, undefined);

					cb(undefined, "success");
				})
			}
			else { cb(undefined, "exist"); }
		})
	},

	ValidateLogin: function (user, cb) {
		fs.readFile('./data/users.data', function (err, content) {
			if (err)
				cb(err, undefined)

			var data = JSON.parse(content.toString());

			var filterdatabyUserid = uscore.where(data.users, { UserId: user.UserId, Password: user.Password });
			var filterdatabyEmail = uscore.where(data.users, { Email: user.Email, Password: user.Password });

			if (filterdatabyUserid.length > 0)
				cb(undefined, filterdatabyUserid);
			else if (filterdatabyEmail.length > 0)
				cb(undefined, filterdatabyEmail);
			else
				cb(undefined, 'notfound');
		});

	},

	CheckAvaialbility: function (user, cb) {
		fs.readFile('./data/users.data', function (err, content) {
			if (err)
				cb(err, undefined)

			var data = JSON.parse(content.toString());
			var filterdata = uscore.where(data.users, { id: user.id });
			//res.render('loginuser', { items: filterdata});
			if (filterdata.length > 0)
				cb(undefined, 'found');
			else
				cb(undefined, 'notfound');

		});
	},
	findAndRemove: function (array, property, value) {
		array.forEach(function (result, index) {
			if (result[property] === value) {
				//Remove from array
				array.splice(index, 1);
			}
		});

		return array;
	}
} //End

module.exports = commonmethods;