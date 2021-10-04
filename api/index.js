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
  try {
    mongoose.connect(process.env.DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true 
    });

      const { method } = req;
      switch (method) {

        // this option will process the queries
        case "GET":
          {
            try {
              const products = await Product
                .find();
          
              return res.status(200).json({
                message : "success",
                length  : products.length,
                content : products
              });

            } catch(error) {
              return res.status(400).json({ error: "something bad when getting data. :/"});
            }
          }

        // it will add products
        case "POST":
          {
            const { name, weight, height, width, depth } = req.body;
          
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
              return res.status(400).json({ error: "something bad when recording. :/"});
            }
          }

        // it updates product's data
        case "PATCH":
          try {
            let { _id, name, weight, height, width, depth } = req.body;

            weight = Number(weight) || undefined;
            height = Number(height) || undefined;
            width = Number(width) || undefined;
            depth = Number(depth) || undefined;
        
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
        
            return res.json(productToBeChanged.nModified ? {message: "Product updated!"} : {message: "No changes to be performed."});
          }catch(error){
            return res.json({error: "Error, please try again later."});
          }


        // it deletes product
        case "DELETE":
          const { productId } = req.body;

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

        default:
          res.setHeader("Allow", ["GET", "POST", "PATCH", "DELETE"]);
          res.status(405).end(`Method ${method} Not Allowed`);
      }

  } catch (err) {
    return res.json({ error: `CODE 78: ${err.message || err}`});
  } finally {
    mongoose.disconnect();
  }
};
