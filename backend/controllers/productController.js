const ProductModel = require('../models/productModel');

// Get all products
exports.getProducts = async (req, res) => {
  const query = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: 'i' } }
    : {};
  const products = await ProductModel.find(query);
  res.json({
    success: true,
    products,
  });
};

// Get single product
exports.getSingleProduct = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Convert relative image paths to full URLs
    const fullImages = product.images.map(img => ({
      image: `${req.protocol}://${req.get('host')}${img.image}`
    }));

    const productWithFullImages = { ...product._doc, images: fullImages };

    res.status(200).json({ success: true, product: productWithFullImages });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid product ID' });
  }
};
