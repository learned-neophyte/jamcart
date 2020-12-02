const express= require( "express");
const mongoose= require( "mongoose");
const bodyParser= require( "body-parser");
const { User, Product}= require( __dirname+"/local_modules/schemas");
let user;

const app= express();
app.use( express.static( "Public"));
app.set( "view engine", "ejs");
app.use( bodyParser.urlencoded({ extended: true}));

// ================================ home route ================================

app.get( "/", ( req, res) => {
    res.render( "index", {});
})


// ================================ signup route ================================

app.route( "/signup").get(( req, res) => {
    res.render( "signup", {});
})
.post(( req, res) => {
    const newUser= new User({
        fName: req.body.fName,
        lName: req.body.lName,
        userName: req.body.userName,
        password: req.body.password,
        age: req.body.age,
        mobileNumber: req.body.mobileNumber,
    });

    User.findOne({ userName: req.body.userName}, ( err,found) => {
        if(!err){
          
            if( found === null){
                
                newUser.save( ( err) =>{
                    if(!err){
                        res.render( "login", {});
                    }else{
                        alert("oops!!!\nsomething went wrong.\nplease try again.");
                    }
                })
            }else{
                res.redirect("/signup");
            }
        }else{
            console.log( err);
        }
    })
});

// ================================ login route ================================

app.route( "/login")
    .get( ( req, res) => {
        res.render( "login", {});
    })
    .post( ( req, res) => {
        
        User.findOne({ userName: req.body.userName}, ( err, found) => {
            
            if( !err){
                if( found !== null && found.password === req.body.password){
                    user= req.body.userName;
                    Product.find({}, ( err, products) => {
                        if( !err){
                            res.render( "user_homepage", { products: products, userName: req.body.userName});
                        }else{
                            console.log( err);
                        }
                    })
                }
                else{
                    res.redirect( "/login");
                }
            }else{
                console.log(err);
            }
        })
});

app.get( "/user-homepage", ( req, res) => {
    if( user != undefined){
        Product.find({}, ( err, products) => {
            if( !err){
                res.render( "user_homepage", { products: products, userName: req.body.userName});
            }else{
                console.log( err);
            }
        })
    }else{
        res.redirect( "/login")
    }
});

// ================================ book route ================================

app.post( "/books", ( req, res) => {
    Product.find({}, ( err, products) => {
        if( !err){
            res.render( "books", { products: products});
        }else{
            console.log( err);
        }
    })
});

// ================================ clothing route ================================

app.post( "/clothing", ( req, res) => {
    Product.find({}, ( err, products) => {
        if( !err){
            res.render( "clothing", { products: products});
        }else{
            console.log( err);
        }
    })
});

// ================================ product details route ================================
let productId;

app.post( "/product-details", ( req, res) => {

    Product.findOne({ _id:req.body.productId}, ( err, foundProduct) =>{
        if( !err){
            productId= req.body.productId;
            res.render( "product_details", { product: foundProduct});
        }else{
            console.log( `error in loading product details from 
            product-details route`+err);
        }
    });
});
app.get( "/product-details", ( req, res) => {

    Product.findOne({ _id:productId}, ( err, foundProduct) =>{
        if( !err){
            res.render( "product_details", { product: foundProduct});
        }else{
            console.log( `error in loading product details from 
            product-details route`+err);
        }
    });
});

// ================================ add-to-cart route ================================

app.get( "/cart", ( req, res) => {
    
    User.findOne({ userName: user}, ( err, foundUser) => {
        if( !err){
            res.render( "cart", { user: foundUser});
        }else{
            console.log("error in finding user inside product from get('/cart') : "+ err);
        }
    });
});

app.post( "/cart", ( req, res) => {
    
    Product.findById( req.body.productId, ( err, foundProduct) => {
        if( !err){
            
            User.findOne( {userName: user}, ( err, foundUser) => {
                if( !err){
                    
                    foundUser.cart.push( foundProduct);
                    foundUser.save();
            
                    Product.find({}, ( err, products) => {
                        if( !err){
                            res.render( "user_homepage", { products: products, userName: user});
                        }else{
                            console.log( err);
                        }
                    });
                }else{
                    console.log("error in finding user inside product from post('/cart') : "+ err);
                }
            });
        }else{
            console.log("error in finding product from post('/cart') : "+ err);
        }
    });
});

app.post( "/delete-from-cart", ( req, res) => {

    User.findOne({ userName: user}, ( err, foundUser) => {
        if( !err){
            var i=0;
            foundUser.cart.forEach( cartItem => {
                
                if( cartItem._id == req.body.productId){

                    foundUser.cart.splice( i, 1);
                    foundUser.save();
                    res.redirect( "/cart");
                }
                i++;
            })
        }else{
            console.log("error in finding user from post('/delete-from-cart') : "+ err);
        }
    });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen( 3000, () => console.log("server started successfully."));