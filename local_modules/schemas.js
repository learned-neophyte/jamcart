const mongoose= require( "mongoose");
mongoose.connect( "mongodb://localhost:27017/jamcart", { useNewUrlParser: true, useUnifiedTopology: true});

const productSchema= new mongoose.Schema({
    name: {
        type: String,
        rquired: true,
    },
    images:[ 
        url= String,
    ],
    category: {
        name: {
            type: String,
            rquired: true,
        },
        type: {
            type: String,
            rquired: true,
        },
    },
    price: {
        type: Number,
        required: true,
    },
    rating:Number,
});

const userSchema= new mongoose.Schema({
    fName: String,
    lName: String,
    userName:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    age: Number,
    mobileNumber: Number,
    cart:[ list= productSchema ],
});

module.exports.User= new mongoose.model( "User", userSchema);
module.exports.Product= new mongoose.model( "Product", productSchema);
