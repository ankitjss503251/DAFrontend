import React from 'react';
import { Link } from 'react-router-dom';
import Wallet from '../SVG/wallet';

function MintEvent() {
  return (
    <div className="mintevent text-center">
        <div className="start_btn">Start
            <span>Live</span>
        </div>
        <h4>Mint Event</h4>
        <p>150 / 500 Minted</p>
        <div className='da_img mb-3'><img src={'../img/mint/da.png'} alt="" /></div>
        <Link to={'#'} className="connect_wallet_btn mb-4"> <Wallet /> Connect Wallet</Link>
        <div className="mintprice">Mint Price 2000 HNTR</div>
        <div className="amount">
            <h5>Select Amount</h5>
            <p>Minimum for mint is 1*</p>
            <div className="qt_selector">
                <button>-</button>
                <input type="text" name="" required="" id="" value="1" />
                <button>+</button>
            </div>
            <div className="mint_btn mt-4"><button className="" type='button'>Mint</button></div>
        </div>  
    </div>
  )
}

export default MintEvent
