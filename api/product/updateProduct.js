
// function to update a particular product
module.exports = async(req, res) => {
  console.log("### inside update product");

  const Product = require("../models/product.js");
  
  try {
    let { _id, name, weight, height, width, depth } = req.body;
  // console.log("req.body", typeof req.body.depth)
    weight = Number(weight) || undefined;
    height = Number(height) || undefined;
    width = Number(width) || undefined;
    depth = Number(depth) || undefined;

    console.log("===>", _id, name, weight, height, width, depth);

    const productToBeChanged = await Product
    .updateOne(
      {
      _id
      }, 
      {
        name,
        weight  : weight || "",
        height  : height || "",
        width   : width || "",
        depth   : depth || "",
      },
      {
        // runValidators: true,
        // ignoreUndefined: true
      }
    );

      console.log("productToBeChanged", productToBeChanged.nModified)
    return res.json(productToBeChanged.nModified ? {message: "Product updated!"} : {message: "No changes to be performed."});
  }catch(error){
    console.log("ERRROR", error.message || error);
    return res.json({error: "Error, please try again later."});
  }
}