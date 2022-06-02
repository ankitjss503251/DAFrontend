import React from "react";
 
const PopupModal = props => {
  return (
    <div className="popup-box">
         <div className="box">
        {props.content}
      </div>
    </div>

    
  );
};
 
export default PopupModal;