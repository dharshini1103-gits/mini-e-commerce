const orderModel = require('../models/orderModel');
const productModel = require('../models/productModel');

exports.createOrder = async (req, res, next) => {
    try {
        const cartItems = req.body;
        const amount = Number(cartItems.reduce((acc, item) => (acc + item.product.price * item.qty), 0)).toFixed(2);
        const status = 'pending';  
        
        // Update product stock for each item in the order
        for (const item of cartItems) {
            const productId = item.product._id;
            const orderedQty = item.qty;
            
            // Find the product and update its stock
            const product = await productModel.findById(productId);
            if (product) {
                const currentStock = parseInt(product.stock) || 0;
                const newStock = Math.max(0, currentStock - orderedQty);
                product.stock = newStock.toString();
                await product.save();
            }
        }
        
        const order = await orderModel.create({cartItems, amount, status});

        res.json(
            {
                success: true,
                order
            }
        );
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
