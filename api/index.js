const mongoose = require("mongoose");

module.exports = async(req, res) => {
  console.log(" we get index.js!!!!!!!!");
  try {
    mongoose.connect(process.env.DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true 
    });

      const { method } = req;
      switch (method) {
        case "GET":
          console.log("receiving get");
          const getProducts = require("./product/getProduct.js");
          await getProducts(req, res);
          break;

        case "POST":
          console.log("receiving PoSt");
          const postProducts = require("./product/addProduct.js");
          await postProducts(req, res);
          break;

        case "PATCH":
          console.log("receiving PATCH");
          const patchProducts = require("./product/updateProduct.js");
          await patchProducts(req, res);
          break;

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
