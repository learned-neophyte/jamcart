const express= require( "express");
const mongoose= require( "mongoose");
const bodyParser= require( "body-parser");
const { User, Product}= require( __dirname+"/local_modules/schemas")

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

app.route( "/login")
    .get( ( req, res) => {
        res.render( "login", {});
    })
    .post( ( req, res) => {
        
        User.findOne({ userName: req.body.userName}, ( err, found) => {
            
            if( !err){
                if( found !== null && found.password === req.body.password){
                    Product.find({}, ( err, products) => {
                        if( !err){
                            res.render( "user_homepage", { products: products});
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

app.listen( 3000, () => console.log("http://localhost:3000"))