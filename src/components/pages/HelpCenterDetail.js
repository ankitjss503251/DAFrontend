import React from 'react';
import Footer from '../components/footer';
import { Link } from '@reach/router';


var bgImgStyle = {
    backgroundImage: "url(./img/background.jpg)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPositionX: "center",
    backgroundPositionY: "center",
    backgroundColor: "#000",
  };

function HelpCenterDetail() {
  return (
    <div style={bgImgStyle}>
        <section className="pdd_8">
          <div className="container">
            <div className="row mb-5">
              <div className='col-md-6'>
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
            </div>
            <div className="row">
                <div className='hepl-detail-left'>
                  <h4 className='lead title_color'>Articles in this section</h4>
                  <ul>
                    <li><Link to={'/'}>How do I set my NFT as my twitter profile picture?</Link></li>
                    <li><Link to={'/'}>How do I create an DigitalArms account?</Link></li>
                    <li><Link to={'/'}>Which blockchains does DigitalArms support?</Link></li>
                    <li><Link to={'/'}>What are the key terms to know in NFTs and Web3?</Link></li>
                    <li><Link to={'/'}>How can I add a cllection to my watchlist?</Link></li>
                    <li><Link to={'/'}>What is a crypto wallet?</Link></li>
                    <li><Link to={''}>What crypto wallets can I use with DigitalArms?</Link></li>
                    <li><Link to={''}>How do i convert crypto to my local currency?</Link></li>
                    <li><Link to={''}>How do I purchase Hunter Token(HNTR)</Link></li>
                  </ul>
                  <Link to={'/'} className="lead title_color">See more</Link>
                </div>
                <div className="Hepl-details">
                  <h4 className='second_hd mb-4'>How do I set my NFT as my Twitter profile Picture?</h4>
                  <p className='text-light text-24 pb-3'>This article introduces how to set an NFT profile picture on your Twitter profile.</p>
                  <h6 className='text-light text-36 mt-5 mb-3'>What is an NFT profile picture?</h6>
                  <p className='text-light text-24'>NFT profile pictures are a way to show off the NFTs you own on your Twitter profile. Adding your NFT to your Twitter profile requires a temporary connection to your crypto wallet.</p>
                  <p className='text-light text-24'>After confirming this connection request in your crypto wallet, your NFT displays in a special hexagon shape that identifies you as the owner of that NFT (see below).</p>
                  <div className="helpimg text-center my-5">
                    <img src={'../img/helpcenter/mceclip01.png'} alt="" />
                  </div>
                  <p className='text-light text-24'>Please note, this feature only supports static image NFTs (formatted as JPEG, PNG) minted on the Ethereum blockchain (for example <Link to='' className='title_color'>ERC-721 and ERC-1155 tokens).</Link></p>
                  <h6 className='text-light text-36 mt-5 mb-4'>How do I use this feature?</h6>
                  <p className='text-light text-24'>This feature is currently available <Link to='' className='title_color'>for Twitter Blue subscribers</Link> on iOS (iPhone) only.</p>
                  <p className='text-light text-24'>You will need a mobile crypto wallet app to connect to Twitter. For this tutorial, we are using the MetaMask mobile crypto wallet. To add your NFT profile picture, please follow the instructions below.</p>
                  <ul>
                    <li className='text-light text-24'>Sign into Twitter on iOS.</li>
                    <li className='text-light text-24'>Go to your profile.</li>
                    <li className='text-light text-24'>Press Edit profile, then tap on the profile picture icon and select Choose NFT.</li>
                    <li className='text-light text-24'>Select your crypto wallet from a list of supported wallets.</li>
                    <li className='text-light text-24'>Twitter will generate a verification request message to your wallet address. You'll be asked to confirm that you hold the private keys of your crypto wallet by signing a transaction. This can be done within your crypto wallet app or by scanning the QR code on the screen.</li>
                  </ul>
                </div>
              </div>
            </div>
        </section>
      <Footer />
    </div>
  )
}

export default HelpCenterDetail
