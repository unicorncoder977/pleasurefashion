const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Product = require('../models/product');



router.get('/', async (req, res) => {
    //get all the wishes of a user
    //find all the products that have a user id in their wishlist
    const wishlist = await Product.find({ wishlist: req.user._id }).exec();
    console.log(wishlist);
    res.render('wishlist/wishlist', { wishlist: wishlist });
    
});
router.post('/:action/:productId', async (req, res) => {

    //add or remove wishes

    var action = req.params.action;
    var productId = req.params.productId;

    if (action === 'add') {

        const response = await Product.updateOne({ _id: productId},{$push:{wishlist:req.user._id}}).exec();
      
        const updatedProduct = await Product.findOne({ _id: productId }).exec();
        console.log(updatedProduct);
    }
    else {
        const response = await Product.updateOne({ _id: productId }, { $pull: { wishlist: req.user._id } }).exec();

        const updatedProduct = await Product.findOne({ _id: productId }).exec();
        console.log(updatedProduct);
    }



});



module.exports = router;
