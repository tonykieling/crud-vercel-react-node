import { useState } from "react";
import ReactModal from "react-modal";
import "../style/modal.css";
import axios from "axios";
import { GiSandsOfTime } from "react-icons/gi";

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

const savingData = (
  <b> Saving data... <GiSandsOfTime /></b>
);

const EditModal = props => {
  const [{ _id, name, weight, height, width, depth }, setState] = useState(props.product);
  const [message, setMessage] = useState("");
  const [saveBtDisabled, setSaveBtDisabled] = useState(false);

  const [colorMessage, setColorMessage] = useState("");

  const handleChangeData = event => {
    const { name, value } = event.target;

    setState(prevState => ({ 
      ...prevState, 
      [name]: value
    }));

    setMessage("");
  };

  // function to check whether there is data modification
  const checkDataChanged = () => {
    return (
      (
        name !== props.product.name || 
        weight !== props.product.weight ||
        height !== props.product.height ||
        width !== props.product.width ||
        depth !== props.product.depth
      )
        ? true
        : false
    );
  };


  const saveNewData = async() => {
    
    const changes = checkDataChanged();
    if (!changes) {
      setColorMessage("message-blue");
      setMessage("No data to be changed");
      return;
    }
    
    setMessage(savingData);
    setSaveBtDisabled(true);
    setColorMessage("message-green");

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

      setSaveBtDisabled(false);
      if (changeProduct.data.message) {
        setColorMessage("message-blue");
        setMessage(changeProduct.data.message);
      } else {
        setColorMessage("message-red");
        setMessage(changeProduct.data.error);
      } 

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
              disabled = { saveBtDisabled }
            />
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
              disabled = { saveBtDisabled }
            />
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
              disabled = { saveBtDisabled }
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
              value       = { width }
              onChange    = { handleChangeData}
              disabled = { saveBtDisabled }
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
              value       = { depth }
              onChange    = { handleChangeData}
              disabled = { saveBtDisabled }
            />
            <span className = "units">cm</span>
          </div>
        </form>

        <div className="d-flex flex-column bt-position">
          <button 
            className = {`${ saveBtDisabled ? "disabled-bt-style" : "bt-style close" }`}
            onClick = {() => props.closeModal()} 
            disabled = { saveBtDisabled }
          >
            Close
          </button>
          <button 
            className = {`${ saveBtDisabled ? "disabled-bt-style" : "bt-style save" }`}
            onClick = {() => saveNewData()}
            disabled = { saveBtDisabled }
          >
            Save
          </button>
        </div>

        <div className = {`message ${colorMessage}`}>
          <p> { message }</p>
        </div>
      </>
    </ReactModal>
  );
};

export default EditModal;