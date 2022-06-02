import React from "react";
import Reveal from "react-awesome-reveal";
import { keyframes } from "@emotion/react";
import "../components-css/sliderMain.css";
import { Link } from "react-router-dom";

const fadeInUp = keyframes`
  0% {
    opacity: 0;
    -webkit-transform: translateY(40px);
    transform: translateY(40px);
  }
  100% {
    opacity: 1;
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }
`;
const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const SliderMain = () => (
  <div className="container banner-container">
    <div className="row align-items-center">
      <div className="col-lg-6">
        <div className="spacer-single"></div>
        <Reveal
          className="onStep"
          keyframes={fadeInUp}
          delay={0}
          duration={600}
          triggerOnce
        >
          {/* <h6 className="hunter-market">HNTR TOKEN</h6> */}
        </Reveal>
        <div className="spacer-10"></div>
        <Reveal
          className="onStep"
          keyframes={fadeInUp}
          delay={300}
          duration={600}
          triggerOnce
        >
          <h1 className="main-title title_color text-uppercase">
            DIGItal ARMS
          </h1>
        </Reveal>
        <Reveal
          className="onStep"
          keyframes={fadeInUp}
          delay={600}
          duration={600}
          triggerOnce
        >
          <p className="lead description_color mt-3 mb-5">
            The only NFT marketplace where you can buy, sell and customize
            licensed firearms from the world's leading brands
          </p>
        </Reveal>
        <div className="spacer-10"></div>
        <Reveal
          className="onStep"
          keyframes={fadeInUp}
          delay={800}
          duration={900}
          triggerOnce
        >
          <Link className="btn-banner" to={"/marketplace"}>
            Explore
          </Link>
          <div className="mb-sm-30"></div>
        </Reveal>
      </div>
      <div className="col-lg-6 xs-hide mt-5 mt-lg-0">
        <Reveal
          className="onStep"
          keyframes={fadeIn}
          delay={900}
          duration={1500}
          triggerOnce
        >
          <img src="./img/misc/home.png" className="lazy img-fluid" alt="" />
        </Reveal>
      </div>
    </div>
  </div>
);
export default SliderMain;
