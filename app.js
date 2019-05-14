const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoute = require('./api/routes/product');
const orderRoute = require('./api/routes/order');
const userRoute = require('./api/routes/user');

const app = express();
app.use(bodyParser.urlencoded({ extended:false }));
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://avik:avik@1994@node-api-u1d0z.mongodb.net/test?retryWrites=true',
    {
        useNewUrlParser: true
    }
);

// cors error handle setup here
// ...
//

app.use('/product',productRoute);
app.use('/order',orderRoute);
app.use('/user', userRoute)

// handling Errors
app.use((req,res,next)=>{
    const err = new Error("Not Found!!");
    res.json({
        error:{
            message:err.message
        }        
    });
    next(err);
});

app.use((err,req,res,next)=>{     
    res.json({
        error:{
            message:err.message
        }        
    });    
});



module.exports = app;