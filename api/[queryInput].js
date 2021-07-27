
module.exports = async(req, res) => {
console.log("inside [queryInput].js galllllllllll");
  const { action } = req.body;

  const {
    query: { queryInput }
  } = req;

  if (action === "name") {
    console.log("action Name", queryInput);
    console.log("req.query", req.query.queryInput);
    return res.json({message: "action Name was received " + queryInput});
  } else if (action === "id") {
    console.log("action ididididid");
    return res.json({message: "action ID received " + queryInput});
  }
}

