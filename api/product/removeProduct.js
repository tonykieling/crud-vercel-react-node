
// function to remove a particular product
module.exports = async(req, res) => {
  console.log("### insed delete product");
  const { productId } = req.body;

  const Product = require("../models/product.js");
  
  // check whether product exists
  try {
    const productToBeDeleted = await Product
      .findById(productId);

    if (!productToBeDeleted || productToBeDeleted.length < 1)
      throw (`RP01: Product NOT found.`);
  } catch(err) {
    return res.json({
      error: err
    });
  }
  
  // delete product
  try {
    const productDeleted = await Product.deleteOne({ _id: productId});

    if (productDeleted.deletedCount) {      
      return res.json({
        success: "Product has been deleted"
      });
    } else
      throw (`RP02: Something bad with Product id <${productId}>`);

  } catch (err) {
    return res.json({
      error: err
    });
  }
};
