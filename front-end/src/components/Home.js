import React from "react";
import "../style/home.css";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-settings">
      <h1> Hello Mr. Dumpty</h1>
      <h2> Welcome and enjoy the system </h2>
      <h2>In the bar above you can reach and work on the folowing features:</h2>
      <div className = "list-position">
        <ul>
          <Link to = "/addProduct"><h2>1. Add a new Products</h2></Link>
          <Link to = "/listProducts"><h2>2. List, Edit and Delete a product</h2></Link>
        </ul>
      </div>
    </div>
  );
};

export default Home;