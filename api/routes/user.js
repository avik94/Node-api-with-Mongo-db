const express = require('express');
const route = express.Router();
const User = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


route.post('/signUp', async(req,res,next)=>{

    // test =(pass)=>{
    //     return new Promise((resolve,reject)=>{
    //         bcrypt.hash(pass, 10, (err,hash)=>{
    //             if(err){
    //                 reject({errorNew: err})
    //             }else{
    //                 resolve(hash)
    //             }
    //         });
    //     })
    // }
    // const password = await test(req.body.password);
    // const user = new User({
    //     _id : new mongoose.Types.ObjectId(),
    //     email: req.body.email,
    //     password: password
    // });
    // try{
    //     const save = await user.save();
    //     res.json({msg:save})
    // }catch(err){
    //     res.status(500).json({error:err})
    // }

    bcrypt.hash(req.body.password, 10, (err, hash)=>{
        if(err){
            res.status(500).json({error: err})
        }else{
            User.find({
                email: req.body.email
            })
            .then(result => {
                const user = new User({
                    _id : new mongoose.Types.ObjectId(),
                    email: req.body.email,
                    password: hash
                });
                if(result.length > 0){
                    console.log(result)
                    res.status(409).json({msg: "Email Exits"});        
                }else{
                    user.save()
                    
                    .then(result =>{
                        res.status(200).json({
                            msg: "User Created"
                        });
                    })
                    .catch(err=>{
                        res.status(500).json({err: err});
                    })
                }
            })
            .catch(err => {
                res.status(500).json({err: err});    
            })
                        
        }
    })   
});

route.post('/login', (req,res)=>{
    User.find({email: req.body.email})
    .exec()
    .then(result => {
        if(result.length >= 1){
            console.log(result)
            bcrypt.compare(req.body.password, result[0].password, (err,passResult)=>{
                if(err){
                    res.status(401).json({msg: "Auth Fail!"});         
                }
                if(passResult){
                    const token = jwt.sign({
                        email:result[0].email,   //payload
                        id: result[0]._id
                    },
                    
                    process.env.Private_Key,     // private-key
                    {
                        expiresIn: '1h'          //option
                    } 
                    
                    )
                    res.status(200).json({
                        msg: "Welcome",
                        token: token
                    })
                }else{
                    res.status(401).json({msg: "Auth Fail!"});
                }                
            })
        }else{
           res.status(401).json({msg: "Auth Fail!"})     
        }
    })
    .catch(err => {
        res.status(500).json({err: err});
    })
});

















route.get('/', async(req,res)=>{
    try{
        const user = await User.find().select('_id email password');
        res.status(202).json(user)
    }catch(err){
        res.status(500).json({err: err})
    }
});

route.delete('/:id', (req,res)=>{
    const id = req.params.id;
    User.remove({_id:id})
    .then(() => {
        res.status(200).json({
            message:"User is Deleted"
        })
    })
    .catch(err => {
        res.status(500).json(err)
    })
});

module.exports = route