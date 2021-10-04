import React, { useState, useEffect } from "react";
import axios from "axios";
import "../style/list-products.css";
import { FaTrash } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { RiDatabase2Line } from "react-icons/ri";
import { FcSearch } from "react-icons/fc";
import EditModal from "./EditModal.js";
import { Link } from "react-router-dom";


const url = "/api";

const properStyle = {
  textAlign: "center",  
  fontWeight: "bold",
  padding: "1rem"
}

const noData = (
  <tr>
    <td 
      colSpan="7" 
      style = {
        {
          ...properStyle, 
          color: "red"
        }
      }
    >
      <p>DB is empty. <RiDatabase2Line color = "gray"/></p>
      <p>Add new products by clicking in </p>
      <p><Link to = "/addProduct"><span style={{color: "blue"}}>Add Product</span></Link></p>
    </td>
  </tr>
);

const processing = (
  <tr>
    <td
      colSpan = "7"
      style = {
        {
          ...properStyle,
          color: "green",
          padding: "2rem"
        }
      }
    >
      <FcSearch /> Processing DB query...
    </td>
  </tr>
);


const ListProduct = () => {

  const [products, setProducts] = useState("");

  const [dataTable, setDataTable] = useState("");

  const [message, setMessage] = useState("");
  const [colorMessage, setColorMessage] = useState("");

  const [callEditModal, setCallEditModal] = useState(false);

  const [productToEdit, setProductToEdit] = useState("");


  useEffect(() => {
    setDataTable(processing);

    const fetchData = async() => {
  
      try {
        const getData = await axios.get( 
          url,
          {  
            headers: { 
              "Content-Type": "application/json"
            },
            data: {
              action: "name"
            }
        });

        if (getData.data.content)
          setProducts(getData.data.content);
        else
          throw new Error();
          
        } catch (error) {
          // console.log("### error post", error.message);
          setDataTable(null);
        }
    }

    fetchData();
    return () => {
      setProducts({});
      setDataTable({});
      setMessage("");
      setCallEditModal("");
      setProductToEdit("");
    };
    //eslint-disable-next-line
  }, []);


  useEffect(() => {
    products && products.length && setDataTable(renderDataTable(products));
    //eslint-disable-next-line
  }, [products]);


  const updateProducts = (action = "update", incomingProduct) => {
    if (action === "remove")
      return (products.filter(e => e._id !== incomingProduct));
    else {
      const tempArray = products.filter(e => e._id !== incomingProduct._id);
      return [...tempArray, incomingProduct];
    }
  }


  const deleteProduct = async(product) => {
    const wannaDelete = window.prompt(`Type product's name (${product.name}) to confirm you wanna delete it:`);

    if (wannaDelete === product.name) {
      const data = { productId: product._id };
      try {
        setMessage("Deleting...");
        setColorMessage("message-green");
        const deleteProduct = await axios.delete( 
          url,
          {  
            headers: { 
              "Content-Type": "application/json"
            },
            data
        });

        if (deleteProduct.data.success) {
          setColorMessage("message-blue");
          setMessage(`Product "${product.name}" has been deleted successfully!`);

          const newProducts = updateProducts("remove", product._id);
          setProducts(newProducts);
        } else 
          throw new Error(deleteProduct.data.error);
          // setMessage(deleteProduct.data.error);

        setTimeout(() => {
          setMessage("");
        }, 4000);
        
        } catch (error) {
          setColorMessage("message-red");
          setMessage(error.message || "Something bad happened, please try again later. ;)");
        }
    } else
      window.alert(`\nWrong product's name.\n\n  You typed: ${wannaDelete || "<empty>"}\n  It has to be: ${product.name}`);
  };


  const editProduct = product => {
    setProductToEdit(product);
    setCallEditModal(true);
  }


  const renderDataTable = products => {
    return products.map((product, index) => {
      const { _id, name, weight, height, width, depth } = product;

      return (
        <tr key = { _id }>
          <td className = "set-center" onClick = {() => editProduct(product)}>{ index + 1 }</td>
          <td className = "set-left" onClick = {() => editProduct(product)}>{ name}</td>
          <td className = "set-center" onClick = {() => editProduct(product)}>{ weight}</td>
          <td className = "set-center" onClick = {() => editProduct(product)}>{ height}</td>
          <td className = "set-center" onClick = {() => editProduct(product)}>{ width}</td>
          <td className = "set-center" onClick = {() => editProduct(product)}>{ depth}</td>

          <td 
            className = "icons" 
            onClick = {() => editProduct(product)}
          >
            <div className = "tooltip">
              <span className = "tooltip-text">Edit product</span>
              <FaEdit color = "green" />
            </div>
          </td>
          <td 
            className   = "icons" 
            onClick     = { () => deleteProduct(product)}
          >
            <div className = "tooltip">
              <span className = "tooltip-text">Delete product</span>
              <FaTrash color = "darkred" />
            </div>
          </td>
        </tr>
      )
    })
  }


  const updateScreen = product => {
    const newProducts = updateProducts("update", product);
    setProducts(newProducts);
  }



  return (
    <div className="main">
      {callEditModal && 
        <EditModal
          openModal   = { callEditModal }
          closeModal  = { () => setCallEditModal(false) }
          product     = { productToEdit }
          changeProduct = { (productChanged) => updateScreen(productChanged)}
        />
      }

      <h2 className = "main-title"> List Products page</h2>

      <div className = {`message ${colorMessage}`}>
          <p> { message }</p>
      </div>

      <table>
        <thead id = "color-head">
          <tr style={{align:"center"}} >
            <th rowSpan="2" className = "num-head"> #</th>
            <th rowSpan="2" className = "name-head" >Name</th>
            <th rowSpan="2" className = "others-head" >Weight (Kg)</th>
            <th rowSpan="1" colSpan="3">Dimensions (cm)</th>
            <th rowSpan="2" colSpan="2">Actions</th>
          </tr>
          <tr>
            <th className = "others-head">Height</th>
            <th className = "others-head">Width</th>
            <th className = "others-head">Depth</th>
          </tr>
        </thead>
        <tbody>
          { dataTable || noData }
        </tbody>
      </table>
    </div>
  );
};

export default ListProduct;