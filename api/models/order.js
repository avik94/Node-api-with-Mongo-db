const mongoose = require('mongoose');

const Order = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId(),
    product : { type: mongoose.Schema.Types.ObjectId(), ref: 'Product' },
    quantity : { types: Number, default: 1 }
});

 