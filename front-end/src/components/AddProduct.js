import React, { useState, useRef } from "react";
import "../style/add-product.css";
import axios from "axios";

const initialState = {
  name: "",
  weight: "",
  height: "",
  width: "",
  depth: ""
};

const butonLabel = "Save Product";
const originalButonColorClass = "bt-style-green";

const AddProduct = () => {
  const [product, setState] = useState(initialState);
  const refName   = useRef(null);


  const handleChangeData = event => {
    const { name, value } = event.target;

    setState(prevState => ({ 
      ...prevState, 
      [name]: value
    }));

    setBtLabel(butonLabel);
    setBtColor(originalButonColorClass);
  };


  // disable form controller
  const [disableFormController, setDisableForm] = useState(false);

  const disableFormFunction = (newState = false) => {
    setDisableForm(newState);
  }


  const [ btLabel, setBtLabel ] = useState(butonLabel);
  const [ btColor, setBtColor ] = useState(originalButonColorClass);


  const saveProduct = async(event) => {
    event.preventDefault();

    if (!product.name) {
      setBtLabel("Please, fill name");
      setBtColor("bt-style-yellow");
      refName.current.focus();
    } else {
      disableFormFunction(true);
      const url = "/api";
      const data = product;

      try {
        setBtLabel("Processing...");
        const record = await axios.post( 
          url,
          data,
          {  
            headers: { 
              "Content-Type": "application/json"
            }
        });
        
        if (record.data.message)
          setBtLabel(butonLabel);
        
        else setBtLabel("Try again, please");
        
        } catch (error) {
          console.log("### error post", error);
        }

      setState(initialState);
      setBtLabel("Product has been Added succesfully!");
      setBtColor("bt-style-blue");

      // set 2.5 seconds showing the message the product was added successfully
      setTimeout(() => {
        setBtLabel(butonLabel);
        setBtColor(originalButonColorClass);
        disableFormFunction();
        refName.current.focus();
      }, 2500);
    }
  }

  return (
    <div className="main">
      <h2 className = "main-title"> Add Product page</h2>

      <form>
        <div>
          <span className = "label-form"> Name </span> 
          <input 
            autoFocus = { true }
            required
            id        = "name"
            className = "text-form" 
            type      = "text"
            name      = "name"
            value     = { product.name }
            onChange  = { handleChangeData }
            ref       = { refName }
            disabled  = { disableFormController }
          />
        </div>

        <div>
          <span className = "label-form"> Weight </span>
          <input 
            id          = "weight"
            className   = "text-form" 
            type        = "number"
            name        = "weight"
            value       = { product.weight }
            onChange    = { handleChangeData}
            disabled    = { disableFormController }
          />
          <span className = "units">Kg</span>
        </div>


      <p className = "label-form"> Dimensions </p>

        <div className = "dimensions">
          <span className = "dimensions-title"> Height </span>
          <input 
            id          = "height"
            type        = "number"
            className   = "dimensions-fields" 
            name        = "height"
            value       = { product.height }
            onChange    = { handleChangeData}
            disabled    = { disableFormController }
          />
          <span className = "units">cm</span>
        </div>

        <div className   = "dimensions" >
          <span className = "dimensions-title"> Width </span>
          <input 
            id          = "width"
            type        = "number"
            className   = "dimensions-fields" 
            name        = "width"
            value       = { product.width }
            onChange    = { handleChangeData}
            disabled    = { disableFormController }
          />
          <span className = "units">cm</span>
        </div>

        <div className = "dimensions">
          <span className   = "dimensions-title" > Depth </span>
          <input 
            id          = "depth"
            type        = "number"
            className   = "dimensions-fields" 
            name        = "depth"
            value       = { product.depth }
            onChange    = { handleChangeData}
            disabled    = { disableFormController }
          />
          <span className = "units">cm</span>
        </div>

        <div style = {{textAlign: "center"}}>
          <button
            type = "submit"
            className = { btColor }
            onClick = { saveProduct }
            disabled    = { disableFormController }
          > { btLabel }
          </button>
        </div>

      </form>
    </div>
  );
};

export default AddProduct;