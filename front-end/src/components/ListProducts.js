import React, { useState, useEffect } from "react";
import axios from "axios";
import "../style/list-products.css";
import { FaTrash } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import EditModal from "./EditModal.js";


const url = "/api";
const noData = <tr><td colSpan="7" style = {{textAlign: "center"}}>No products right now.</td></tr>

const AddProduct = () => {

  const [products, setProducts] = useState("");

  const [dataTable, setDataTable] = useState("");

  const [message, setMessage] = useState("");

  const [callEditModal, setCallEditModal] = useState(false);

  const [productToEdit, setProductToEdit] = useState("");


  useEffect(() => {
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
console.log("receiving data = ", getData.data.content);



        if (getData.data.content)
          setProducts(getData.data.content);
        
        } catch (error) {
          console.log("### error post", error);
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
    const wannaDelete = window.confirm(`Are you sure you want to delete - ${product.name} - ?`);
    if (wannaDelete === true) {
      const data = { productId: product._id };
      try {
        const deleteProduct = await axios.delete( 
          url,
          {  
            headers: { 
              "Content-Type": "application/json"
            },
            data
        });

        if (deleteProduct.data.success) {
          setMessage(`Product "${product.name}" has been deleted successfully!`);

          const newProducts = updateProducts("remove", product._id);
          setProducts(newProducts);
        } else setMessage(deleteProduct.data.error);

        setTimeout(() => {
          setMessage("");
        }, 2500);
        
        } catch (error) {
          console.log("### error post", error);
        }
    }

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

      <div className = "message">
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
          { ( dataTable && dataTable.length ) ? dataTable : noData}
        </tbody>
      </table>
    </div>
  );
};

export default AddProduct;