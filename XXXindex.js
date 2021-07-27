const express     = require("express");
const PORT        = process.env.PORT || 3333;
const path        = require('path');
const app         = express();
const bodyParser  = require("body-parser");
const mongoose    = require("mongoose");
require('dotenv').config();

const productsRoutes = require("./server/routes/product.js");


const cors = require('cors');
app.use(cors());

/**
 * still analyzing the communication behaviour.
 * using also Wireshark
 * the route below was inserted to check how FF and Chromium handles it.
 * FF doesnt get the second, as it would suffice by the line in express.static("public")
 * Chromium executes the second, because, I think it doesnt execute the express.static expression
 * why
 */
// FIRST
// app.get("*", (req, res, next) => {
//   console.log("IP=====>", req.ip);
//   next();
// });

// settings related to CORS
// it allows other clients (other than the SPA provided for this app) access these APIs
app.use((req, res, next) => {
  // console.log(" checking headers")  
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
  // console.log(" logging OPTIONS");
      res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
      return res.status(200).json({});
    }
    next();
  });

// settings related to boy-parser, which allows extended urlencoder and enables to receive json format
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.use((req, res, next) => {
//   // console.log(res.header('x-forwarded-for'), " - ", req.connection.remoteAddress, " - ", req.ip, " - ", req.connection.remoteAddress);
//   // console.log(res.header('x-forwarded-for'));
//   console.log("req.body===>", req.body);
//   next();

//   /**
//    * on FF it is working
//    * if I wann record info about an access I can
//    * DOubt: why does it get 7 times the, apparently, same info??
//    * but in chromium, it gest manifest.json instead of the much file
//    * trying to understand why...
//    * 
//    * SUMARY: not quite sure to implement in clockinJS yet because:
//    * 1- it has a not expected behaviour in Chromium
//    * 2- it gets 7 line of result instead of 1
//    */
// });

app.use(express.static("public"));

// it seems to work fine, at least on FireFox - Chrome is not working, cleaned data and cookies, but nothing
// const fn = express.static("./public");
// app.use((req, res, next) => {
//   console.log("---kkkkkkkkkkkkkkkkkkkkkkkkkkinside index.js");
//   fn(req, res, next);
// });


// it checks JSON malformatted messages
app.use((err, req, res, next) => {
  if (err) {
    return res.status(409).json({
      error: err.message
    });
  }
  else
  next();
});


try {
  mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true 
  });
} catch (err) {
  console.log("### error on MongoDB connection");
  console.log(err.message);
}


// SECOND
// app.get("*", (req, res, next) => {
//   console.log("IP=====>", req.ip);
//   next();
// });


// calls the route regarding contact, which allows add or get contacts
app.use("/product", productsRoutes);


// it deliveres front-end files to the client/browser
app.get("*", (req, res) => {
//     console.log("***************************** new request");
    return res.sendFile(path.join(__dirname, './public', 'index.html'));
    // return res.sendFile(path.join(__dirname, './public'));
  });


app.listen(PORT, () => console.log(`Server is running at ${PORT}`));
