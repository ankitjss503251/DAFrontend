import React from 'react';
import { Link } from "react-router-dom";

function Error404() {
  return (
    <div className='wrapper landing'>
      <div className="connect_wallet">
        <div className="connect_wallet_col">
          <img src="../images/404-error.png" className="img-fluid d-block" alt="" />
          <h4 className="text-light text-center font-24 text-uppercase font-700 my-2">We can't find that page</h4>
          <p className='text-light font-400'>We're fairly sure that page used to be here, but seems to have gone missing. We do apologise on it's behalf.</p>
          <Link to={"/"} className='round-btn montserrat text-light text-decoration-none connect_wallet_btn mt-3' >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Error404
