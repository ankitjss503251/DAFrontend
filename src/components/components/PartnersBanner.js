import React from 'react';
import Reveal from "react-awesome-reveal";
import { keyframes } from "@emotion/react";
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

function PartnersBanner() {
  return (
    <div className="container">
    <div className="row align-items-center">
      <div className="col-md-8">
        <div className="spacer-single"></div>
        <Reveal
          className="onStep"
          keyframes={fadeInUp}
          delay={0}
          duration={600}
          triggerOnce
        >
        </Reveal>
        <div className="spacer-10"></div>
        <Reveal
          className="onStep"
          keyframes={fadeInUp}
          delay={300}
          duration={600}
          triggerOnce
        >
          <h1 className="partner_title title_color text-uppercase">
          Welcome to the world’s largest NFT marketplace
          </h1>
        </Reveal>
        <Reveal
          className="onStep"
          keyframes={fadeInUp}
          delay={600}
          duration={600}
          triggerOnce
        >
          <p className="text-24 text-light mt-3 mb-5">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Auctor elementum dui risus in volutpat. Risus malesuada arcu habitant sed. Adipiscing ac sodales vitae nunc amet tempus nibh elit elit. At at odio varius ac viverra lacus et, orci commodo. Duis mollis arcu, sed vivamus. Interdum porta ut arcu, orci, cursus.
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
          <Link className="btn-banner" to={'/marketplace'}>
          Learn more
          </Link>
          <div className="mb-sm-30"></div>
        </Reveal>
      </div>
      <div className="col-md-4">
        <Reveal
          className="onStep"
          keyframes={fadeIn}
          delay={900}
          duration={1500}
          triggerOnce
        >
          <img
            src="./img/partner/DA-Armory.png"
            className="lazy img-fluid"
            alt=""
          />
        </Reveal>
      </div>
    </div>
  </div>
  )
}

export default PartnersBanner
