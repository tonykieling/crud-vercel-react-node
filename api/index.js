const mongoose = require("mongoose");

// product schema
const Product = mongoose.model("Product", mongoose.Schema(
  {
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
  })
);


module.exports = async(req, res) => {
  console.log(" we get index.js!!!!!!!! ok");
  try {
    mongoose.connect(process.env.DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true 
    });

      const { method } = req;
      switch (method) {
        case "GET":
          {
            // console.log("receiving get");
            // const getProducts = require("./product/getProduct.js");
            // await getProducts(req, res);
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
              // console.log("GP01 error:", error.message || error);
              return res.status(400).json({ error: "something bad when getting data. :/"});
            }
          }
          // break;

        case "POST":
          {
            // console.log("receiving PoSt");
            // const postProducts = require("./product/addProduct.js");
            // await postProducts(req, res);
            const { name, weight, height, width, depth } = req.body;
          
            // it checks whether data is being received
            // *** FE does it, but here is a double checking
            if (!name) return res.status(400).json({ error: "name is mandatory, please" });
          
          // console.log("ADD PRODUCT: ", req.body);
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
          // console.log("newProduct:::", newProduct);
              return res.status(200).json({
                message : "success",
                content : newProduct
              });
          
            } catch(error) {
              // console.log("AP01 error:", error.message || error);
              return res.status(400).json({ error: "something bad when recording. :/"});
            }
            // break;
          }

        case "PATCH":
          console.log("receiving PATCH");
          // const patchProducts = require("./product/updateProduct.js");
          // await patchProducts(req, res);
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
          // break;

        case "DELETE":
          console.log("receiving deLEte");
          const removeProducts = require("./product/removeProduct.js");
          await removeProducts(req, res);
          break;

        default:
          res.setHeader("Allow", ["GET", "POST", "PATCH", "DELETE"]);
          res.status(405).end(`Method ${method} Not Allowed`);
      }

  } catch (err) {
    console.log("### error on MongoDB connection");
    console.log(err.message);
  } finally {
    console.log(" Ending DB");
    mongoose.disconnect();
  }
};
