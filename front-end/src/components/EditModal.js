import { useState } from "react";
import ReactModal from "react-modal";
import "../style/modal.css";
import axios from "axios";

const customStyle = {
  content : {
    top              : '40%',
    left             : '50%',
    right            : 'auto',
    bottom           : 'auto',
    marginRight      : '-50%',
    transform        : 'translate(-50%, -50%)',
    backgroundColor  : "lightcyan"
  }
};


const EditModal = props => {
  const [{ _id, name, weight, height, width, depth }, setState] = useState(props.product);
  const [message, setMessage] = useState("");

  const handleChangeData = event => {
    const { name, value } = event.target;

    setState(prevState => ({ 
      ...prevState, 
      [name]: value
    }));
  }


  const saveNewData = async() => {
    const data = {
      _id,
      name,
      weight  : weight || undefined,
      height  : height || undefined,
      width   : width || undefined,
      depth   : depth || undefined
    };
    
    const url = "/api";

    try {
      const changeProduct = await axios.patch( 
        url,
        data,
        {  
          headers: { 
            "Content-Type": "application/json"
          }
      });

      props.changeProduct(data);

      if (changeProduct.data.message)
        setMessage(changeProduct.data.message);
      else setMessage(changeProduct.data.error);

      setTimeout(() => {
        setMessage("");
      }, 2500);

    }catch(error){
      console.log("error:", error.message || error);
    }
  
  }


  return(
    <ReactModal
      ariaHideApp ={ false }
      isOpen  = { props.openModal }
      style   = { customStyle}
    >
      <>
        <h2 className = "modal-title">Edit product</h2>
        <form>
          <div>
            <span className = "modal-label"> Name </span> 
            <input 
              required
              id        = "name"
              className = "text-form" 
              type      = "text"
              name      = "name"
              value     = { name }
              onChange  = { handleChangeData }
            ></input>
          </div>

          <div>
            <span className = "modal-label"> Weight </span>
            <input 
              id          = "weight"
              className   = "text-form" 
              type        = "number"
              name        = "weight"
              value       = { weight }
              onChange    = { handleChangeData}
            ></input>
            <span className = "units">Kg</span>
          </div>


        <p className = "modal-label"> Dimensions </p>

          <div className = "dimensions">
            <span className = "dimensions-title"> Height </span>
            <input 
              id          = "height"
              type        = "number"
              className   = "dimensions-fields" 
              name        = "height"
              value       = { height }
              onChange    = { handleChangeData}
            >
            </input>
            <span className = "units">cm</span>
          </div>

          <div className   = "dimensions" >
            <span className = "dimensions-title"> Width </span>
            <input 
              id          = "width"
              type        = "number"
              className   = "dimensions-fields" 
              name        = "width"
              value       = { width }
              onChange    = { handleChangeData}
            >
            </input>
            <span className = "units">cm</span>
          </div>

          <div className = "dimensions">
            <span className   = "dimensions-title" > Depth </span>
            <input 
              id          = "depth"
              type        = "number"
              className   = "dimensions-fields" 
              name        = "depth"
              value       = { depth }
              onChange    = { handleChangeData}
            >
            </input>
            <span className = "units">cm</span>
          </div>
        </form>

        <div className = "message">
          <p> { message }</p>
        </div>

        <div className="d-flex flex-column bt-position">
          <button className = "bt-style close" onClick = {() => props.closeModal()} >Close</button>
          <button className = "bt-style save" onClick = {() => saveNewData()}>Save</button>
        </div>
      </>
    </ReactModal>
  );
};

export default EditModal;