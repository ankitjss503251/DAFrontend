import React, { useState, useEffect } from 'react';
import imagess from  '../../components/images/check-mark.png';

const ModelMint = ({ onRequestClose }) => {

    const datas = [
        {
            id: 1,
            img:  require("../../components/images/ether.png"),
            des: "The only NFT marketplace where you can buy, sell and customize licensed firearms from the world's leading brands"
        },
        {
          id: 2,
          img:  require("../../components/images/ether.png"),
          des: "The only NFT marketplace where you can buy, sell and customize licensed firearms from the world's leading brands"
        }
    ]


    	// Use useEffect to add an event listener to the document
	useEffect(() => {
		function onKeyDown(event) {
			if (event.keyCode === 27) {
				// Close the modal when the Escape key is pressed
				onRequestClose();
			}
		}

		// Prevent scolling
		document.body.style.overflow = "hidden";
		document.addEventListener("keydown", onKeyDown);

		// Clear things up when unmounting this component
		return () => {
			document.body.style.overflow = "visible";
			document.removeEventListener("keydown", onKeyDown);
		};
	});

  return (
    <div className="modal__backdrop">
			<div className="modal__container">
        <button type="button" className="custom_close" onClick={onRequestClose}>x</button>
        <ul className='minting'>
          {datas.map(data => 
            <li key={data.id}>
              <img src={imagess} alt="" />{data.des}
            </li>
          )}
        </ul>
			</div>
		</div>
  )
}

export default ModelMint
