// function to get products
module.exports = async(req, res) => {
  console.log("   ### getProducts");
  
  const Product = require("../models/product.js");

  try {
    const products = await Product
      .find();

    return res.status(200).json({
      message : "success",
      length  : products.length,
      content : products
    });
// return res.json({});
  } catch(error) {
    console.log("GP01 error:", error.message || error);
    return res.status(400).json({ error: "something bad when getting data. :/"});
  }
};
