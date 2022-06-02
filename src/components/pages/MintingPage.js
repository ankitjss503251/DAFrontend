import React from 'react';
import Footer from '../components/footer';
import MintEvent from "../components/MintEvent"


const bgImgStyle = {
    backgroundImage: "url(./img/background.jpg)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPositionX: "center",
    backgroundPositionY: "center",
    backgroundColor: "#000",
  };
  
  const bgImage = {
    backgroundImage: "url(./img/collections/collection_bg.jpg)",
    backgroundSize: "cover",
    backgroundPosition: "center", 
  }

  
function MintingPage() {
  return (
    <div style={bgImgStyle}>
        <section className="collection_banner pdd_8" style={bgImage}>
        
        </section>
        <section className="collection_info" >
        <div className="container">
          <div className="collection_pick">
            <img alt='' src={'../img/collections/barrett.png'} class="img-fluid collection_profile" />
            <img alt='' src={'../img/mint/blue_check.png'} class="img-fluid check_img" />
          </div>
          <h1 className="collection_title text-center">Barrett Firarms</h1>
          <ul class="collection_social mb-4">
            <li><a href="/"><i class="fa fa-facebook fa-lg"></i></a></li>
            <li><a href="/"><i class="fa fa-twitter fa-lg"></i></a></li>
            <li><a href="/"><i class="fa fa-linkedin fa-lg"></i></a></li>
            <li><a href="/"><i class="fa fa-pinterest fa-lg"></i></a></li>
            <li><a href="/"><i class="fa fa-rss fa-lg"></i></a></li>
          </ul>
          <ul className="collection_status mt-5 mb-5">
            <li>
              <h4>10.0k</h4>
              <p>items</p>
            </li>
            <li>
              <h4>2000</h4>
              <p>HNTR</p>
            </li>
            <li>
              <h4>Open</h4>
              <p>Status</p>
            </li>
          </ul>
          <div className="collection_description text-center">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Massa fringilla eget quam fringilla pharetra scelerisque arcu aliquam lacus. Non, tortor et lobortis facilisi nam. Adipiscing non feugiat ultrices natoque a. Imperdiet eget tellus tempor ultricies ipsum vitae. Felis elit nisi nunc sagittis morbi arcu, sed. Diam diam ligula aliquet sollicitudin diam et pellentesque. Tempor turpis nunc turpis ornare facilisis porttitor morbi tellus nullam.</p>
            <span className="top_arrow"><img alt='' src={'../img/top_arrow.png'} class="img-fluid" /></span>
          </div>
        </div>
      </section>
      <section className="collection_list mb-5 pb-5">
        <div className="container">
          <MintEvent />
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default MintingPage
