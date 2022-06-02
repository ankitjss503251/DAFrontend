import React from "react";
import { convertToEth } from "../../helpers/numberFormatter";

var mint_bg = {
  backgroundImage: "url(./img/mint/mint_bg.png)",
};

function MintLivetab(props) {
  console.log("props--->", props.ongoing);
  return (
    <div className="container">
      <ul className="nav nav-pills mb-5 mint_tab" id="pills-tab" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className="nav-link active"
            id="liveMint-tab"
            data-bs-toggle="live"
            data-bs-target="#liveMint"
            type="button"
            role="tab"
            aria-controls="liveMint"
            aria-selected="true"
          >
            Live
          </button>
        </li>
      </ul>
      <div className="tab-content" id="liveMintContent">
        <div
          className="tab-pane fade show active"
          id="liveMint"
          role="tabpanel"
          aria-labelledby="liveMint-tab"
        >
          <div className="row justify-content-center">
            {props.ongoing && props.ongoing.length > 0
              ? props.ongoing.map((card, i) => {
                  return (
                    <div className="col-lg-4 col-md-6 mb-4">
                      <a href={`/multimintingpage/${card._id}`}>
                        <div className="mint_box" style={mint_bg}>
                          <div className="mint_img">
                            <img alt="" src={card.coverImg} class="img-fluid" />
                            {/* <div className='mint_date'>
                            <span>16</span>May
                          </div> */}
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
                                {Number(convertToEth(card.price)).toFixed(4)}{" "}
                                HNTR
                              </li>
                              <li>
                                <img alt="" src={"../img/mint/items.svg"} />
                                &nbsp;&nbsp;{card.items} items
                              </li>
                            </ul>
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
                                    <stop offset="0.314" stop-color="#FF9800" />
                                    <stop offset="0.662" stop-color="#FF6D00" />
                                    <stop offset="0.972" stop-color="#F44336" />
                                  </radialGradient>
                                  <radialGradient
                                    id="paint1_radial_57_4693"
                                    cx="0"
                                    cy="0"
                                    r="1"
                                    gradientUnits="userSpaceOnUse"
                                    gradientTransform="translate(9.84805 10.0119) rotate(90.5787) scale(14.771 11.1163)"
                                  >
                                    <stop offset="0.214" stop-color="#FFF176" />
                                    <stop offset="0.328" stop-color="#FFF27D" />
                                    <stop offset="0.487" stop-color="#FFF48F" />
                                    <stop offset="0.672" stop-color="#FFF7AD" />
                                    <stop offset="0.793" stop-color="#FFF9C4" />
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
                          </div>
                        </div>
                      </a>
                    </div>
                  );
                })
              : ""}
          </div>
        </div>
        <div
          className="tab-pane fade"
          id="pills-profile"
          role="tabpanel"
          aria-labelledby="pills-profile-tab"
        >
          ...
        </div>
      </div>
    </div>
  );
}

export default MintLivetab;
