const express = require('express');
const route = express.Router();
const User = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


route.post('/signUp', (req,res,next)=>{
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