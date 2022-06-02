import React from 'react';
import Footer from '../components/footer';
import { Link } from '@reach/router';
import { createGlobalStyle } from 'styled-components';


var bgImgStyle = {
  backgroundImage: "url(./img/background.jpg)",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPositionX: "center",
  backgroundPositionY: "center",
  backgroundColor: "#000",
};

const GlobalStyles = createGlobalStyle`
  .background {
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
`;

const Helpcenter= () => (
<div style={bgImgStyle}>
<GlobalStyles/>

  <section className="jumbotron pdd_12 background" style={{backgroundImage: `url(${'./img/background/bg.jpg'})`}}>
      <div className='container'>
        <div className='row'>
          <div className="col-md-8 offset-md-2 text-center">
              <h1 className="h1 mb-3">Help Center</h1>
              <form className="help_form" id='form_sb' name="myForm">
                <input className="form-control" id='name_1' name='name_1' placeholder="type your question here" type='text'/>
                <button id="btn-submit"><i className="arrow_right"></i></button>
              </form>              
              <p className="mt-3 font_24">eg. create item, create wallet.</p>
              
          </div>
        </div>
      </div>
  </section>

  <section className=' pdd_8'>
  <div className='container'>
    <div className="row">
      <div className="col-lg-4 col-md-6 mb-5">
        <div className="feature-box f-boxed style-3 text-center">
          <h4 className="mb-4">Getting Started</h4>
          <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam.</p>
          <Link to="" className="hlp-btn mt-4">Read more</Link>
        </div>
      </div>    

      <div className="col-lg-4 col-md-6 mb-5">
          <div className="feature-box f-boxed style-3 text-center">
              <div className="text">
                  <h4 className="mb-4">Buying</h4>
                  <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam.</p>
                  <Link to="" className="hlp-btn mt-4">Read more</Link>
              </div>
          </div>
      </div>  

      <div className="col-lg-4 col-md-6 mb-5">
          <div className="feature-box f-boxed style-3 text-center">
              <div className="text">
                  <h4 className="mb-4">Selling</h4>
                  <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam.</p>
                  <Link to="" className="hlp-btn mt-4">Read more</Link>
              </div>
          </div>
      </div>  

      <div className="col-lg-4 col-md-6 mb-5">
          <div className="feature-box f-boxed style-3 text-center">
              <div className="text">
                  <h4 className="mb-4">Creating</h4>
                  <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam.</p>
                  <Link to="" className="hlp-btn mt-4">Read more</Link>
              </div>
          </div>
      </div>  

      <div className="col-lg-4 col-md-6 mb-5">
          <div className="feature-box f-boxed style-3 text-center">
              <div className="text">
                  <h4 className="mb-4">Partners</h4>
                  <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam.</p>
                  <Link to="" className="hlp-btn mt-4">Read more</Link>
              </div>
          </div>
      </div>  

      <div className="col-lg-4 col-md-6 mb-5">
          <div className="feature-box f-boxed style-3 text-center">
              <div className="text">
                  <h4 className="mb-4">Developers</h4>
                  <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam.</p>
                  <Link to="" className="hlp-btn mt-4">Read more</Link>
              </div>
          </div>
      </div>  
    </div>
  </div>
  </section>
  <section className="promoted_div pdd_8 pt-0">
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <h4 className="mb-5">Promoted articles</h4>
        </div>
        <div className="col-lg-4 mb-3">
          <p>How do I set my NFT as my Twitter profile picture ?</p>
        </div>
        <div className="col-lg-4 mb-3">
          <p>How do I create an Hunter Token Account?</p>
        </div>
        <div className="col-lg-4 mb-3">
          <p>Which Blockchain does Hunter Token support ?</p>
        </div>
        <div className="col-lg-4 mb-3">
          <p>What are the key terms to know in NFTs and Web3 ?</p>
        </div>
        <div className="col-lg-4 mb-3">
          <p>How do creators earnings work on Hunter Token ?</p>
        </div>
        <div className="col-lg-4 mb-3">
          <p>How to I Sell an NFT ?</p>
        </div>
        <div className="col-lg-4 mb-3">
          <p>How do it Create an NFT on Hunter Token ?</p>
        </div>
        <div className="col-lg-4 mb-3">
          <p>How do I find my funs on Polygon ?</p>
        </div>
        <div className="col-lg-4 mb-3">
          <p>Where can I find my NFT sales ?</p>
        </div>
        <div className="col-lg-4 mb-3">
          <p>What can I do if my art, or Other IP is sold without my permission ?</p>
        </div>
        <div className="col-lg-4 mb-3">
          <p>How can I revoke access to delisted items ?</p>
        </div>
        <div className="col-lg-4 mb-3">
          <p>How can I stay safe and protect my NFTs ?</p>
        </div>
        <div className="col-lg-4 mb-3">
          <p>What can I do if I think my account is compromised ?</p>
        </div>
        <div className="col-lg-4 mb-3">
          <p>How do I stay safe on the Hunter Token Discord ?</p>
        </div>
        <div className="col-lg-4 mb-3">
          <p>How can I report fraudulent content on Hunter Token ?</p>
        </div>
      </div>
    </div>
  </section>

  <Footer />
</div>

);
export default Helpcenter;