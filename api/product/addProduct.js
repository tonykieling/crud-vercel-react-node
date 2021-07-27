
// function to add a new product
module.exports = async(req, res) => {
  console.log("\n### add product")

  const { name, weight, height, width, depth } = req.body;

  const Product = require("../models/product.js");


  // it checks whether data is being received
  // *** FE does it, but here is a double checking
  if (!name) return res.status(400).json({ error: "name is mandatory, please" });


  //go to record into database
  try {
    const newProduct = new Product({
      _id: new mongoose.Types.ObjectId(),
      name,
      weight  : weight || "",
      height  : height || "",
      width   : width || "",
      depth   : depth || "",
    });

    await newProduct.save();

    return res.status(200).json({
      message : "success",
      content : newProduct
    });

  } catch(error) {
    console.log("AP01 error:", error.message || error);
    return res.status(400).json({ error: "something bad when recording. :/"});
  }
};
