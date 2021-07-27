
// example of path segment
// whether app is querying for /api/testXYZ
// it will run [queryInput].js and fill req.query.queryInput with "testXYZ"
// it is possible to have a directory, for instance code, which will be api/code/testXYZ

// the getaway is that the app's query should follow the directory strucutre 
// and the req.query is gonna be named as follows inside brackets [code].js, for example

module.exports = async(req, res) => {
console.log("inside [code].js");
  const { action } = req.body;

  const {
    query: { code }
  } = req;

  if (action === "name") {
    console.log("action Name", code);
    console.log("req.query", req.query.code);
    return res.json({message: "action Name was received " + code});
  } else if (action === "id") {
    console.log("action ididididid");
    return res.json({message: "action ID received " + code});
  }
}

