import { Link } from "react-router-dom";
import "../style/header.css";

const Header = () => {
  return (
    <div className="topnav">
      <Link to = "/">Home</Link>
      <Link to = "addProduct">Add Product</Link>
      <Link to = "listProducts">List Products</Link>
    </div>
  );
};

export default Header;