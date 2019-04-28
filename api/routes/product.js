const express = require('express');
const route = express.Router();
const Product = require('../models/product');
const mongoose = require('mongoose');

route.get('/',(req,res)=>{
    Product.find()
    .select('_id name price')
    .exec()
    .then(result=>{
        const response = {
            count:result.count,
            product:result.map(el =>{
                return {
                    _id : el._id,
                    name:el.name,
                    price: el.price,
                    info:{
                        url : "http://localhost:3000/product/"+el._id,
                        method: "GET"
                    }
                }
            })
        }
        res.status(200).json(response)
    })
    .catch(err =>{
        console.log(err)
        res.status(500).json({
            message:err
        })
    })
    
});
route.post('/',(req,res)=>{   
    const product = new Product({
        _id : new mongoose.Types.ObjectId(),
        name : req.body.name,
        price : req.body.price
    })
    product.save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message:"Product Created Successfully",
            product:{
                _id:result.id,
                name:result.name,
                price:result.price,
                info:{
                    method:"GET",
                    url:'http://localhost:3000/product/'+result.id
                }
            }
            
        })
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            message:err
        })
    })
    
});
route.get('/:productId',(req,res)=>{
    const id = req.params.productId;
    Product.findById(id)
    .exec()
    .then(result => {
        if(result){
            const response = {
                _id:result.id,
                name:result.name,
                price:result.price
            }
            res.status(200).json(response)
        }else{
            res.status(200).json({
                message:"No Product Found"
            })
        }
        
    })
    .catch(err => {
        res.status(500).json({
            errMessage:err
        })
    })
})

route.delete('/:productId',(req,res)=>{
    const id = req.params.productId;
    Product.remove({_id:id})
    .then(() => {
        res.status(200).json({
            message:"Product is Deleted"
        })
    })
    .catch(err => {
        res.status(500).json(err)
    })
});
route.patch('/:productId',(req,res)=>{
    const id = req.params.productId;

    const updateObj = {}
    for (const ops of req.body){
        updateObj[ops.propName] = ops.value
    }
    Product.updateMany({_id:id},{$set : updateObj}) //{$set : { name : res.body.newName , price :res.body.newPrice}}
    .then(result=>{
        res.status(200).json({
            message:"product Updated Successfully",
            info:{
                methode:"GET",
                url:'http://localhost:3000/product/'+id
            }
        })
    })
    .catch(err =>{
        res.status(500).json(err)
    })
});


module.exports = route;
