// this is the definition/shape that a product should like in the application
const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  
  name: {
    type    : String,
    required: true
  },
  weight: {
    type    : String
  },
  height: {
    type    : String
  }, 
  width: {
    type    : String
  },
  depth: {
    type    : String
  }
  
});

module.exports = mongoose.model("Product", productSchema);
