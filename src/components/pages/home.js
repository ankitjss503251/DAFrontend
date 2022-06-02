import React, { useState, useEffect } from "react";
import SliderMain from "../components/SliderMain";
// import FeatureBox from "../components/FeatureBox";
import CarouselCollection from "../components/CarouselCollection";
import CarouselNew from "../components/CarouselNew";
import AuthorList from "../components/AuthorList";
// import Category from "../components/Category";
import Footer from "../components/footer";
import Reveal from "react-awesome-reveal";
import { keyframes } from "@emotion/react";
import { Link } from "react-router-dom";
import Clock from "./../components/Clock";
import { getCollections } from "../../helpers/getterFunctions";
import moment from "moment";
import { convertToEth } from "../../helpers/numberFormatter";

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
// const fadeIn = keyframes`
//   0% {
//     opacity: 0;
//   }
//   100% {
//     opacity: 1;
//   }
// `;

var bgImgStyle = {
  backgroundImage: "url(./img/background.jpg)",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPositionX: "center",
  backgroundPositionY: "center",
  backgroundColor: "#000",
};
var bgImgStylesec1 = {
  backgroundImage: "url(./img/background/banner-home.jpg)",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPositionX: "center",
  backgroundPositionY: "center",
  backgroundColor: "#000",
};

var mint_bg = {
  backgroundImage: "url(./img/mint/mint_bg.png)",
};

// var bgImgStyle2 = {
//   backgroundImage: "url(./img/bg-img-2.png)",
//   backgroundRepeat: "no-repeat",
//   backgroundSize: "40%",
//   backgroundPositionX: "0%",
//   backgroundPositionY: "30vh",
// };

const Home = () => {
  const [upcomingMints, setUpcomingMints] = useState([]);
  useEffect(async () => {
    try {
      const res = await getCollections({
        page: 1,
        limit: 12,
        isExclusive: 1,
      });
      console.log("result of getUpcomingMints helper fn--->", res);
      setUpcomingMints(res);
    } catch (e) {
      console.log("Error in fetching all upcoming mints list", e);
    }
  }, []);

  return (
    <div style={bgImgStyle}>
      <section
        style={bgImgStylesec1}
        className="jumbotron breadcumb no-bg h-vh pdd_8"
      >
        <SliderMain />
      </section>

      {/* <section className="container no-top no-bottom">
      <FeatureBox />
    </section> */}

      <section className="wallet_section pdd_8">
        <div className="container">
          <Reveal
            className="onStep"
            keyframes={fadeInUp}
            delay={0}
            duration={1000}
            triggerOnce
          >
            <div className="row">
              <div className="col-lg-4 col-md-6 col-sm-12 mb-lg-0 mb-xl-0 mb-4">
                <div className="wallet_box">
                  <div className="svg_icon">
                    <svg
                      width="44"
                      height="40"
                      viewBox="0 0 44 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M37.7888 9.49825H4.76313V8.22735L33.8257 5.99055V8.22735H37.7888V4.41463C37.7888 1.61863 35.4347 -0.343646 32.5602 0.0503348L6.03131 3.69529C3.15412 4.09182 0.800049 6.70226 0.800049 9.49825V34.9164C0.800049 36.2646 1.35677 37.5577 2.34773 38.511C3.33869 39.4644 4.68272 40 6.08415 40H37.7888C39.1902 40 40.5343 39.4644 41.5252 38.511C42.5162 37.5577 43.0729 36.2646 43.0729 34.9164V14.5819C43.0729 13.2336 42.5162 11.9406 41.5252 10.9872C40.5343 10.0338 39.1902 9.49825 37.7888 9.49825ZM33.8257 27.3062C33.3051 27.306 32.7896 27.2072 32.3087 27.0154C31.8278 26.8236 31.3908 26.5425 31.0228 26.1882C30.6548 25.8339 30.363 25.4134 30.1639 24.9506C29.9648 24.4878 29.8625 23.9918 29.8626 23.4909C29.8628 22.9901 29.9655 22.4941 30.1649 22.0315C30.3643 21.5688 30.6565 21.1484 31.0247 20.7944C31.393 20.4404 31.8301 20.1596 32.3111 19.968C32.7922 19.7765 33.3077 19.678 33.8284 19.6782C34.8798 19.6785 35.888 20.0807 36.6312 20.7962C37.3744 21.5117 37.7918 22.4819 37.7914 23.4935C37.7911 24.505 37.3731 25.475 36.6293 26.19C35.8856 26.905 34.8771 27.3065 33.8257 27.3062Z"
                        fill="#EF981D"
                      />
                    </svg>
                  </div>
                  <h4>#1 Buy NFT’s </h4>
                  <p className="textdes">
                    Be the first to mint a new collection, with a chance to
                    score a “Legendary“ firearm
                  </p>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 col-sm-12 mb-lg-0 mb-xl-0 mb-4">
                <div className="wallet_box">
                  <div className="svg_icon">
                    <svg
                      width="45"
                      height="40"
                      viewBox="0 0 45 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M39.431 25H16.5291L17.0404 27.5H38.0105C39.2137 27.5 40.1055 28.6173 39.8389 29.7905L39.4079 31.6871C40.8681 32.3959 41.875 33.8928 41.875 35.625C41.875 38.0627 39.8813 40.0347 37.4356 39.9995C35.1057 39.966 33.1895 38.0752 33.1266 35.7459C33.0923 34.4734 33.602 33.3202 34.4394 32.4999H18.0606C18.8713 33.2941 19.375 34.4005 19.375 35.625C19.375 38.1104 17.3025 40.1118 14.7914 39.9952C12.5617 39.8916 10.7484 38.0901 10.6312 35.861C10.5407 34.1396 11.4465 32.6223 12.8227 31.8309L7.33461 5H1.875C0.839453 5 0 4.16055 0 3.125V1.875C0 0.839453 0.839453 0 1.875 0H9.88508C10.7758 0 11.5435 0.626641 11.722 1.49922L12.4381 5H43.1242C44.3274 5 45.2192 6.11727 44.9526 7.29055L41.2594 23.5405C41.0654 24.3942 40.3065 25 39.431 25ZM31.4866 15H28.125V10.3125C28.125 9.79477 27.7052 9.375 27.1875 9.375H25.3125C24.7948 9.375 24.375 9.79477 24.375 10.3125V15H21.0134C20.1781 15 19.7598 16.0098 20.3505 16.6004L25.5871 21.837C25.9532 22.2031 26.5468 22.2031 26.913 21.837L32.1496 16.6004C32.7402 16.0098 32.3219 15 31.4866 15Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                  <h4>#2 Customize NFT’s (coming soon) </h4>
                  <p className="textdes">
                    Win, earn or purchase accessories and exclusive skins. Forge
                    them to your NFT firearms increasing the rarity and value. 
                  </p>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 col-sm-12 mb-lg-0 mb-xl-0 mb-4">
                <div className="wallet_box">
                  <div className="svg_icon">
                    <svg
                      width="45"
                      height="45"
                      viewBox="0 0 45 45"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M23.5988 4.84875C22.8957 4.14544 21.942 3.75021 20.9475 3.75H7.5C6.50544 3.75 5.55161 4.14509 4.84835 4.84835C4.14509 5.55161 3.75 6.50544 3.75 7.5V20.9475C3.75021 21.942 4.14544 22.8957 4.84875 23.5988L19.8488 38.5988C20.552 39.3018 21.5056 39.6967 22.5 39.6967C23.4944 39.6967 24.448 39.3018 25.1512 38.5988L38.5988 25.1512C39.3018 24.448 39.6967 23.4944 39.6967 22.5C39.6967 21.5056 39.3018 20.552 38.5988 19.8488L23.5988 4.84875ZM13.125 16.875C12.1302 16.8748 11.1762 16.4793 10.473 15.7757C9.7697 15.0721 9.37475 14.1179 9.375 13.1231C9.37525 12.1283 9.77067 11.1743 10.4743 10.4711C11.1779 9.76783 12.1321 9.37288 13.1269 9.37313C14.1217 9.37337 15.0757 9.7688 15.7789 10.4724C16.4822 11.176 16.8771 12.1302 16.8769 13.125C16.8766 14.1198 16.4812 15.0738 15.7776 15.777C15.074 16.4803 14.1198 16.8752 13.125 16.875Z"
                        fill="#EF981D"
                      />
                    </svg>
                  </div>
                  <h4>#3 Sell NFT’s </h4>
                  <p className="textdes">
                    List your NFT’s on the secondary market place
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mint_section">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h2 className="text-center second_hd color-light mb-5">
                Exclusive Sales
                <div className="border_div">
                  <span className="title_bottom_border"></span>
                </div>
              </h2>
            </div>
            {upcomingMints
              ? upcomingMints.slice(0, 3).map((card, key) => {
                  const st = card.saleStartTime;
                  const et = card.saleEndTime;
                  const ct = moment()
                    .add({
                      hours: 5,
                      minutes: 30,
                    })
                    .toISOString();
                    const redirectTo = (card.items === card.totalSupply) ? "/collection" : `/multimintingpage/${card._id}`
                  return (
                    <div
                      className="col-lg-4 col-md-6 col-sm-12 mb-lg-0 mb-xl-0 mb-4"
                      key={key}
                    >
                      <Link to={redirectTo}>
                        <div className="mint_box" style={mint_bg}>
                          <div className="mint_img">
                            <img alt="" src={card.coverImg} class="img-fluid" />
                            {ct >= st && ct < et ? (
                              ""
                            ) : (
                              <div className="mint_date">
                                <span>
                                  {moment(card.saleStartTime).format("DD")}
                                </span>{" "}
                                {moment(card.saleStartTime).format("MMM")}
                              </div>
                            )}
                          </div>
                          <div className="mint_text p-4">
                            <div className="logoImg_con">
                              <img
                                alt=""
                                src={card.logoImg}
                                className="mc_img"
                              />
                            </div>
                            <h4>{card.name}</h4>
                            <ul className="m-0 p-0">
                              <li>
                                <img alt="" src={"../img/mint/hntr.svg"} />{" "}
                                {`${Number(convertToEth(card.price)).toFixed(
                                  4
                                )} HNTR`}{" "}
                              </li>
                              <li>
                                <img alt="" src={"../img/mint/items.svg"} />{" "}
                                {`${card.items} items`}
                              </li>
                            </ul>
                            {ct < st ? (
                              <span className="mint_time mt-4">
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M12.0399 23.6399C17.6069 23.6399 22.1199 19.1091 22.1199 13.52C22.1199 7.93086 17.6069 3.39999 12.0399 3.39999C6.47292 3.39999 1.95996 7.93086 1.95996 13.52C1.95996 19.1091 6.47292 23.6399 12.0399 23.6399Z"
                                    fill="#428BC1"
                                  />
                                  <path
                                    d="M12.0399 21.4C16.3698 21.4 19.8799 17.872 19.8799 13.52C19.8799 9.168 16.3698 5.64001 12.0399 5.64001C7.71003 5.64001 4.19995 9.168 4.19995 13.52C4.19995 17.872 7.71003 21.4 12.0399 21.4Z"
                                    fill="white"
                                  />
                                  <path
                                    d="M3.59997 18.52L2.71997 24H3.47997C3.95997 24 4.11997 23.44 4.43997 22.76C4.83996 21.88 5.79996 19.6 5.79996 19.6L3.59997 18.52ZM20.4399 18.52L21.3599 24H20.5999C20.1199 24 19.9599 23.44 19.6399 22.76C19.2399 21.88 18.2799 19.6 18.2799 19.6L20.4399 18.52ZM4.51996 3.28006L6.87996 5.64005L5.63996 6.92005L3.27997 4.52006L4.51996 3.28006ZM19.5599 3.28006L17.1999 5.64005L18.4399 6.92005L20.7999 4.52006L19.5599 3.28006Z"
                                    fill="#428BC1"
                                  />
                                  <path
                                    d="M1.48 8.63997L8.51997 1.48C7.63997 0.559998 6.39998 0 4.99998 0C2.23999 0 0 2.27999 0 5.03998C0 6.43998 0.559998 7.71997 1.48 8.63997ZM15.4 1.52L22.5199 8.59997C23.4399 7.67998 23.9999 6.43998 23.9999 5.03998C23.9999 2.27999 21.7599 0 18.9599 0C17.5599 0.0399999 16.3199 0.599998 15.4 1.52Z"
                                    fill="#B0B8B8"
                                  />
                                  <path
                                    d="M7.43994 17.84L11.5599 13.64L12.0399 14.12L7.91994 18.28L7.43994 17.84Z"
                                    fill="#ED4C5C"
                                  />
                                  <path
                                    d="M12.0401 15.0002C12.8574 15.0002 13.52 14.3375 13.52 13.5202C13.52 12.7028 12.8574 12.0402 12.0401 12.0402C11.2227 12.0402 10.5601 12.7028 10.5601 13.5202C10.5601 14.3375 11.2227 15.0002 12.0401 15.0002Z"
                                    fill="#428BC1"
                                  />
                                  <path
                                    d="M11.28 7.88022H12.76V13.8802H11.28V7.88022ZM12.76 12.7602H15.76V14.2402H12.76V12.7602Z"
                                    fill="#428BC1"
                                  />
                                </svg>
                                <Clock
                                  deadline={moment(st)
                                    .subtract({
                                      hours: 5,
                                      minutes: 30,
                                    })
                                    .toISOString()}
                                ></Clock>
                              </span>
                            ) : ct >= st && ct < et ? (
                              <span className="mint_time mt-4">
                                <svg
                                  width="19"
                                  height="24"
                                  viewBox="0 0 19 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M3.72412 7.34624C3.61012 8.56222 3.53012 10.7142 4.24811 11.6302C4.24811 11.6302 3.91012 9.26621 6.94006 6.30026C8.16004 5.10628 8.44204 3.48231 8.01605 2.26433C7.77405 1.57434 7.33206 1.00435 6.94806 0.60636C6.72407 0.372364 6.89606 -0.0136293 7.22206 0.000370507C9.19403 0.088369 12.39 0.636359 13.7479 4.0443C14.3439 5.54028 14.3879 7.08625 14.1039 8.65822C13.9239 9.6622 13.284 11.8942 14.7439 12.1682C15.7859 12.3642 16.2899 11.5362 16.5159 10.9402C16.6099 10.6922 16.9359 10.6302 17.1119 10.8282C18.8719 12.8301 19.0219 15.1881 18.6579 17.2181C17.9539 21.142 13.9799 23.998 10.032 23.998C5.1001 23.998 1.17416 21.176 0.15618 16.0681C-0.253812 14.0061 -0.0458156 9.9262 3.13413 7.04625C3.37013 6.83025 3.75612 7.02225 3.72412 7.34624Z"
                                    fill="url(#paint0_radial_57_4693)"
                                  />
                                  <path
                                    d="M11.834 14.6842C10.0161 12.3442 10.83 9.67425 11.276 8.61027C11.336 8.47027 11.176 8.33827 11.05 8.42427C10.2681 8.95626 8.66608 10.2082 7.92009 11.9702C6.91011 14.3522 6.98211 15.5181 7.5801 16.9421C7.94009 17.8001 7.5221 17.9821 7.3121 18.0141C7.10811 18.0461 6.92011 17.9101 6.77011 17.7681C6.3386 17.3538 6.0311 16.8275 5.88213 16.2481C5.85013 16.1241 5.68813 16.0901 5.61413 16.1921C5.05414 16.9661 4.76415 18.2081 4.75015 19.0861C4.70615 21.8 6.94811 24 9.66006 24C13.078 24 15.568 20.2201 13.604 17.0601C13.034 16.1401 12.498 15.5381 11.834 14.6842Z"
                                    fill="url(#paint1_radial_57_4693)"
                                  />
                                  <defs>
                                    <radialGradient
                                      id="paint0_radial_57_4693"
                                      cx="0"
                                      cy="0"
                                      r="1"
                                      gradientUnits="userSpaceOnUse"
                                      gradientTransform="translate(9.05518 24.0601) rotate(-179.751) scale(14.1173 23.1636)"
                                    >
                                      <stop
                                        offset="0.314"
                                        stop-color="#FF9800"
                                      />
                                      <stop
                                        offset="0.662"
                                        stop-color="#FF6D00"
                                      />
                                      <stop
                                        offset="0.972"
                                        stop-color="#F44336"
                                      />
                                    </radialGradient>
                                    <radialGradient
                                      id="paint1_radial_57_4693"
                                      cx="0"
                                      cy="0"
                                      r="1"
                                      gradientUnits="userSpaceOnUse"
                                      gradientTransform="translate(9.84805 10.0119) rotate(90.5787) scale(14.771 11.1163)"
                                    >
                                      <stop
                                        offset="0.214"
                                        stop-color="#FFF176"
                                      />
                                      <stop
                                        offset="0.328"
                                        stop-color="#FFF27D"
                                      />
                                      <stop
                                        offset="0.487"
                                        stop-color="#FFF48F"
                                      />
                                      <stop
                                        offset="0.672"
                                        stop-color="#FFF7AD"
                                      />
                                      <stop
                                        offset="0.793"
                                        stop-color="#FFF9C4"
                                      />
                                      <stop
                                        offset="0.822"
                                        stop-color="#FFF8BD"
                                        stop-opacity="0.804"
                                      />
                                      <stop
                                        offset="0.863"
                                        stop-color="#FFF6AB"
                                        stop-opacity="0.529"
                                      />
                                      <stop
                                        offset="0.91"
                                        stop-color="#FFF38D"
                                        stop-opacity="0.209"
                                      />
                                      <stop
                                        offset="0.941"
                                        stop-color="#FFF176"
                                        stop-opacity="0"
                                      />
                                    </radialGradient>
                                  </defs>
                                </svg>
                                Ongoing
                              </span>
                            ) : (
                              <span className="mint_time mt-4">
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M3.55401 18.6487C5.15135 17.0513 5.31108 16.652 6.30942 17.6503C7.30776 18.6487 6.90842 18.7685 5.31108 20.4058C4.11308 21.6038 2.59561 21.3642 2.59561 21.3642C2.59561 21.3642 2.35601 19.8467 3.55401 18.6487Z"
                                    fill="#FF9D27"
                                  />
                                  <path
                                    d="M6.5889 20.286C7.22783 18.6088 7.4275 18.4091 6.50903 17.89C5.59056 17.3709 5.59056 17.7303 4.99156 19.4075C4.51236 20.6454 5.07143 21.7635 5.07143 21.7635C5.07143 21.7635 6.14963 21.5639 6.5889 20.286Z"
                                    fill="#FF9D27"
                                  />
                                  <path
                                    d="M5.67052 18.7288C6.02993 17.8104 6.02993 17.6107 6.50913 17.8902C7.02826 18.1698 6.90846 18.2896 6.54906 19.208C6.30946 19.8869 5.71046 20.0466 5.71046 20.0466C5.71046 20.0466 5.43092 19.4476 5.67052 18.7288Z"
                                    fill="#FDF516"
                                  />
                                  <path
                                    d="M6.02992 17.4509C5.51078 16.5324 5.31111 16.7321 3.63391 17.371C2.39597 17.8502 2.15637 18.8885 2.15637 18.8885C2.15637 18.8885 3.27451 19.4476 4.51245 18.9684C6.18965 18.3294 6.54905 18.3294 6.02992 17.4509Z"
                                    fill="#FF9D27"
                                  />
                                  <path
                                    d="M5.19134 18.2897C6.10981 17.9303 6.30948 17.9303 6.02994 17.4511C5.75041 16.932 5.63061 17.0518 4.71214 17.4112C4.03327 17.6508 3.87354 18.2498 3.87354 18.2498C3.87354 18.2498 4.51247 18.5293 5.19134 18.2897Z"
                                    fill="#FDF516"
                                  />
                                  <path
                                    d="M4.75208 18.2098C5.63062 17.3313 5.71049 17.0917 6.26955 17.6508C6.82862 18.2098 6.58902 18.2897 5.71048 19.1682C5.03162 19.8471 4.19301 19.6874 4.19301 19.6874C4.19301 19.6874 4.11315 18.8887 4.75208 18.2098Z"
                                    fill="#FDF516"
                                  />
                                  <path
                                    d="M6.58902 14.3761C4.11314 10.223 0 11.9401 0 11.9401C0 11.9401 5.87022 6.0699 9.82363 10.0233L6.58902 14.3761Z"
                                    fill="#3BAACF"
                                  />
                                  <path
                                    d="M8.50582 11.3012L9.78369 10.0233C5.87022 6.06991 0 11.9401 0 11.9401C0 11.9401 5.15141 8.26624 8.50582 11.3012Z"
                                    fill="#428BC1"
                                  />
                                  <path
                                    d="M9.58398 17.371C13.7371 19.8469 12.0199 23.96 12.0199 23.96C12.0199 23.96 17.8901 18.0898 13.9367 14.1364L9.58398 17.371Z"
                                    fill="#3BAACF"
                                  />
                                  <path
                                    d="M12.6588 15.4542L13.9367 14.1764C17.8901 18.1298 12.0199 24 12.0199 24C12.0199 24 15.6938 18.8087 12.6588 15.4542Z"
                                    fill="#428BC1"
                                  />
                                  <path
                                    d="M18.6888 11.5409C14.0166 16.1731 8.86519 18.6889 7.06818 16.8919C5.27118 15.0949 7.78698 9.94352 12.4193 5.27131C17.8502 -0.159641 23.8802 0.0799596 23.8802 0.0799596C23.8802 0.0799596 24.0798 6.10991 18.6888 11.5409Z"
                                    fill="#C5D0D8"
                                  />
                                  <path
                                    d="M17.4908 10.223C12.8585 14.8552 8.22627 17.8902 7.14807 16.812C6.06986 15.7338 9.10481 11.1015 13.7371 6.46922C19.168 1.03827 23.96 0 23.96 0C23.96 0 22.9218 4.79201 17.4908 10.223Z"
                                    fill="#DAE3EA"
                                  />
                                  <path
                                    d="M8.90518 18.1696C8.70552 18.3693 8.38605 18.3693 8.18638 18.1696L5.79038 15.7736C5.59071 15.574 5.59071 15.2146 5.79038 15.0149L6.50918 14.2961L9.62399 17.4109L8.90518 18.1696Z"
                                    fill="#C94747"
                                  />
                                  <path
                                    d="M8.22627 17.4509C8.0266 17.6506 7.787 17.7304 7.6672 17.6106L6.30946 16.2529C6.18966 16.1331 6.26953 15.8935 6.4692 15.6938L7.188 14.975L8.94507 16.7321L8.22627 17.4509Z"
                                    fill="#F15744"
                                  />
                                  <path
                                    d="M7.54743 18.4492C7.42763 18.569 7.1481 18.569 7.0283 18.4492L5.47089 16.8918C5.35109 16.772 5.39103 16.5324 5.51083 16.4126L5.99003 15.9334L8.02664 17.97L7.54743 18.4492Z"
                                    fill="#3E4347"
                                  />
                                  <path
                                    d="M7.22794 18.1299C7.10814 18.2497 6.86854 18.2896 6.78867 18.2097L5.71047 17.1315C5.6306 17.0517 5.67053 16.852 5.83027 16.7322L6.30947 16.253L7.70714 17.6507L7.22794 18.1299Z"
                                    fill="#62727A"
                                  />
                                  <path
                                    d="M23.8801 0.0798307C23.8801 0.0798307 21.7237 -3.61502e-05 18.8086 1.1181L22.8419 5.15138C23.96 2.23624 23.8801 0.0798307 23.8801 0.0798307Z"
                                    fill="#C94747"
                                  />
                                  <path
                                    d="M23.8802 0.0799408C23.8802 0.0799408 22.1631 0.439342 19.5674 1.91688L22.0433 4.39275C23.5208 1.79708 23.8802 0.0799408 23.8802 0.0799408Z"
                                    fill="#F15744"
                                  />
                                  <path
                                    d="M16.5724 9.38437C17.6751 9.38437 18.569 8.49043 18.569 7.38769C18.569 6.28496 17.6751 5.39102 16.5724 5.39102C15.4696 5.39102 14.5757 6.28496 14.5757 7.38769C14.5757 8.49043 15.4696 9.38437 16.5724 9.38437Z"
                                    fill="#EDF4F9"
                                  />
                                  <path
                                    d="M16.5723 8.70557C17.3001 8.70557 17.8901 8.11557 17.8901 7.38776C17.8901 6.65996 17.3001 6.06996 16.5723 6.06996C15.8445 6.06996 15.2545 6.65996 15.2545 7.38776C15.2545 8.11557 15.8445 8.70557 16.5723 8.70557Z"
                                    fill="#3BAACF"
                                  />
                                  <path
                                    d="M12.5791 13.3777C13.6818 13.3777 14.5757 12.4838 14.5757 11.381C14.5757 10.2783 13.6818 9.38435 12.5791 9.38435C11.4763 9.38435 10.5824 10.2783 10.5824 11.381C10.5824 12.4838 11.4763 13.3777 12.5791 13.3777Z"
                                    fill="#EDF4F9"
                                  />
                                  <path
                                    d="M12.579 12.6989C13.3068 12.6989 13.8968 12.1089 13.8968 11.3811C13.8968 10.6533 13.3068 10.0633 12.579 10.0633C11.8512 10.0633 11.2612 10.6533 11.2612 11.3811C11.2612 12.1089 11.8512 12.6989 12.579 12.6989Z"
                                    fill="#3BAACF"
                                  />
                                  <path
                                    d="M18.7287 1.95678C18.6089 2.07658 18.3693 2.07658 18.2495 1.95678C18.1297 1.83698 18.1297 1.59738 18.2495 1.47758C18.3693 1.35778 18.6089 1.35778 18.7287 1.47758C18.8485 1.59738 18.8485 1.83698 18.7287 1.95678Z"
                                    fill="white"
                                  />
                                  <path
                                    d="M19.4076 2.95522C19.584 2.95522 19.7271 2.81219 19.7271 2.63575C19.7271 2.45931 19.584 2.31628 19.4076 2.31628C19.2312 2.31628 19.0881 2.45931 19.0881 2.63575C19.0881 2.81219 19.2312 2.95522 19.4076 2.95522Z"
                                    fill="white"
                                  />
                                  <path
                                    d="M20.3661 3.91359C20.5425 3.91359 20.6856 3.77056 20.6856 3.59413C20.6856 3.41769 20.5425 3.27466 20.3661 3.27466C20.1897 3.27466 20.0466 3.41769 20.0466 3.59413C20.0466 3.77056 20.1897 3.91359 20.3661 3.91359Z"
                                    fill="white"
                                  />
                                  <path
                                    d="M21.2846 4.87195C21.461 4.87195 21.604 4.72892 21.604 4.55248C21.604 4.37605 21.461 4.23302 21.2846 4.23302C21.1081 4.23302 20.9651 4.37605 20.9651 4.55248C20.9651 4.72892 21.1081 4.87195 21.2846 4.87195Z"
                                    fill="white"
                                  />
                                  <path
                                    d="M22.2429 5.79035C22.4194 5.79035 22.5624 5.64732 22.5624 5.47088C22.5624 5.29444 22.4194 5.15141 22.2429 5.15141C22.0665 5.15141 21.9235 5.29444 21.9235 5.47088C21.9235 5.64732 22.0665 5.79035 22.2429 5.79035Z"
                                    fill="white"
                                  />
                                </svg>
                                Launched
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })
              : ""}
            {upcomingMints.length > 0 ? (
              <div class="col-md-12 text-center mt-5">
                <Link to={"/mintcollectionlive"} className="view_all_bdr">
                  View All
                </Link>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </section>

      <section className="container no-bottom pdd_8">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2 className="text-center second_hd color-light mb-5">
                Hot Collections
                <div class="border_div">
                  <span class="title_bottom_border"></span>
                </div>
              </h2>
            </div>
          </div>
          <div className="col-lg-12">
            <CarouselCollection />
          </div>
        </div>
      </section>

      <section className="pdd_8 about_learnmore">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 col-md-12">
              <div className="row">
                <div className="col-lg-4 mb-4 mb-lg-0 mb-xl-0">
                  <div className="about_col">
                    <h3>The future of DigitalArms</h3>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. A
                      lectus sit tellus massa praesent porttitor mattis.
                    </p>
                  </div>
                </div>
                <div className="col-lg-4 mb-4 mb-lg-0 mb-xl-0">
                  <div className="about_col">
                    <h3>Pioneering digital firearms marketplace</h3>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. A
                      lectus sit tellus massa praesent porttitor mattis.
                    </p>
                  </div>
                </div>
                <div className="col-lg-4 mb-4 mb-lg-0 mb-xl-0">
                  <div className="about_col">
                    <h3>Designed for longevity</h3>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. A
                      lectus sit tellus massa praesent porttitor mattis.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-md-12 d-flex align-items-end mt-4 mt-lg-0 mt-xl-0">
              <Link to="" className="border_btn title_color">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container pdd_8 Most-recent">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2 className="text-center second_hd color-light mb-5">
                Most recent items put on sale per
                <br /> Collection
                <div class="border_div">
                  <span class="title_bottom_border"></span>
                </div>
              </h2>
            </div>
          </div>
          <div className="col-lg-12">
            <CarouselNew />
          </div>
          <div class="col-md-12 text-center mt-5">
            <Link to={"/marketplace"} className="view_all_bdr">
              View All
            </Link>
          </div>
        </div>
      </section>

      <section className="pdd_8 pt-0">
        <div className="container no-bottom">
          <div className="row">
            <div className="col-lg-12">
              <div className="text-center">
                <h2 className="text-center second_hd color-light mb-5">
                  Top Sellers
                  <div class="border_div">
                    <span class="title_bottom_border"></span>
                  </div>
                </h2>
              </div>
            </div>
          </div>
          <AuthorList />
        </div>
      </section>

      {/* <section className="category_sec pdd_8">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2 className="text-center second_hd color-light mb-5">Browse by Category
              <div class="border_div"><span class="title_bottom_border"></span></div>
              </h2>
            </div>
          </div>
        </div>
          <Category />
      </div>
    </section> */}

      <Footer />
    </div>
  );
};
export default Home;
