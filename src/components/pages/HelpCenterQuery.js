import React from 'react';
import Footer from '../components/footer';
import Star from '../SVG/Star';
import { Link } from 'react-router-dom';


var bgImgStyle = {
    backgroundImage: "url(./img/background.jpg)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPositionX: "center",
    backgroundPositionY: "center",
    backgroundColor: "#000",
  };

function HelpCenterQuery() {
  return (
    <div style={bgImgStyle}>
        <section className="pdd_8">
            <div className="container">
                <div className="row">
                    <div className='col-md-6 mb-4'>
                        <ul className="breadcrumb_div">
                            <li>Digital Arms</li>
                            <li>Getting Started</li>
                        </ul>
                    </div>
                    <div className="col-md-6">
                        <form class="d-flex navbar_form width_search">
                            <input className="form-control me-2" type="search" placeholder="Search item here..." aria-label="Search" />
                            <button className="search_btn" type="submit"><img src="../img/search.svg" alt="" /></button>
                        </form>
                    </div>
                    <div className="col-md-12">
                        
                        <h1 className='text-light second_hd'>Getting Started</h1>
                        <p className="lead text-light">Learn how to list your NFTs fro sale and understand the different ways to list your NFTs</p>
                        <ul className="help_qt">
                            <li><Link to=""><Star /> How do I set my NFT as my Twitter profile picture?</Link></li>
                            <li><Link to=""><Star /> How do I create a DigitalArms account?</Link></li>
                            <li><Link to=""><Star /> Which blockchains does DigitalArms support?</Link></li>
                            <li><Link to=""><Star /> What are the key terms to know in NFTs and Web3?</Link></li>
                            <li><Link to="">How do I add a collection to my watchlist?</Link></li>
                            <li><Link to="">What is a crypto wallet?</Link></li>
                            <li><Link to="">What crypto wallet can I use with DigitalArms?</Link></li>
                            <li><Link to="">How do I convert crypto to my local currency?</Link></li>
                            <li><Link to="">How do I purchase Hunter Token (HNTR)?</Link></li>
                            <li><Link to="">What currencies can I use on DigitalArms?</Link></li>
                            <li><Link to="">How do I hide items from my DigitalArms profile?</Link></li>
                            <li><Link to="">How do I add funds using Moonpay?</Link></li>
                            <li><Link to="">How do I log out of my DigitalArms account or switch crypto wallets?</Link></li>
                            <li><Link to="">Wht can’t I see my NFT in my account?</Link></li>
                            <li><Link to="">How do I search for NFTs?</Link></li>
                            <li><Link to="">How do I manage my account notifications?</Link></li>
                            <li><Link to="">What is a Non-Fungible Token (NFT)?</Link></li>
                            <li><Link to="">Will ERC-1155 NFTs appear in wallet?</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
      <Footer />
    </div>
  )
}

export default HelpCenterQuery
