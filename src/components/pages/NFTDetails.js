import React, { useState, useEffect } from "react";
import Footer from "../components/footer";
import FirearmsCollection from "../components/FirearmsCollection";
import NFTlisting from "../components/NFTlisting";
import NFToffer from "../components/NFToffer";
import NFThistory from "../components/NFThistory";
import { getNFTs } from "../../helpers/getterFunctions";
import { useParams } from "react-router-dom";
import { convertToEth } from "../../helpers/numberFormatter";

var bgImgStyle = {
  backgroundImage: "url(./img/background.jpg)",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPositionX: "center",
  backgroundPositionY: "center",
  backgroundColor: "#000",
};
var textColor = {
  textColor: "#EF981D",
};

function NFTDetails() {
  const { id } = useParams();

  const [NFTDetails, setNFTDetails] = useState([]);
  const [allNFTs, setAllNFTs] = useState([]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(async () => {
    try {
      const reqData = {
        page: 1,
        limit: 12,
        nftID: id,
      };

      const res = await getNFTs(reqData);
      console.log("result--->", res);
      setNFTDetails(res[0]);
      const reqData1 = {
        page: 1,
        limit: 12,
        collectionID: res[0].collection?._id,
      };
      const nfts = await getNFTs(reqData1);
      setAllNFTs(nfts);
    } catch (e) {
      console.log("Error in fetching nft Details", e);
    }
  }, []);

  return (
    <div>
      <section style={bgImgStyle} className="pdd_8">
        <div className="container">
          <div className="row mb-5">
            <div className="col-lg-6 mb-xl-5 mb-lg-5 mb-5">
              <img src={NFTDetails.image} class="img-fluid nftimg" alt="" />
            </div>
            <div className="col-lg-6 nft_details">
              <p className="mb-0">
                {NFTDetails.collection?.name} Collection{" "}
                <img src={"../img/check.png"} class="img-fluid" alt="" />
              </p>
              <h1 className="mb-3">{NFTDetails.name}</h1>
              <div className="owner_by mb-4">
                <p>
                  Owned by{" "}
                  <span style={textColor}>
                    {NFTDetails.collection?.createdBy}
                  </span>
                </p>
                <span className="add_wishlist">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21.6328 6.64689C21.3187 5.91947 20.8657 5.2603 20.2992 4.70626C19.7323 4.15058 19.064 3.70898 18.3305 3.40548C17.5699 3.08953 16.7541 2.92781 15.9305 2.9297C14.775 2.9297 13.6477 3.24611 12.668 3.84377C12.4336 3.98673 12.2109 4.14376 12 4.31486C11.7891 4.14376 11.5664 3.98673 11.332 3.84377C10.3523 3.24611 9.225 2.9297 8.06953 2.9297C7.2375 2.9297 6.43125 3.08908 5.66953 3.40548C4.93359 3.71017 4.27031 4.14845 3.70078 4.70626C3.13359 5.25967 2.6805 5.919 2.36719 6.64689C2.04141 7.40392 1.875 8.20782 1.875 9.03516C1.875 9.81563 2.03438 10.6289 2.35078 11.4563C2.61563 12.1477 2.99531 12.8648 3.48047 13.5891C4.24922 14.7352 5.30625 15.9305 6.61875 17.1422C8.79375 19.1508 10.9477 20.5383 11.0391 20.5945L11.5945 20.9508C11.8406 21.1078 12.157 21.1078 12.4031 20.9508L12.9586 20.5945C13.05 20.5359 15.2016 19.1508 17.3789 17.1422C18.6914 15.9305 19.7484 14.7352 20.5172 13.5891C21.0023 12.8648 21.3844 12.1477 21.6469 11.4563C21.9633 10.6289 22.1227 9.81563 22.1227 9.03516C22.125 8.20782 21.9586 7.40392 21.6328 6.64689Z"
                      fill="#9E9E9E"
                    />
                  </svg>{" "}
                  {NFTDetails.like} favourites
                </span>
              </div>
              <ul class="nav nav-pills mb-4" id="pills-tab" role="tablist">
                <li class="nav-item" role="presentation">
                  <button
                    class="nav-link active"
                    id="pills-home-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-home"
                    type="button"
                    role="tab"
                    aria-controls="pills-home"
                    aria-selected="true"
                  >
                    Details
                  </button>
                </li>
              </ul>
              <div class="tab-content" id="pills-tabContent">
                <div
                  class="tab-pane fade show active"
                  id="pills-home"
                  role="tabpanel"
                  aria-labelledby="pills-home-tab"
                >
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <div className="tab_label">
                        <p>
                          Background <span className="big_text">Bunker</span>
                        </p>
                        <p>
                          85% <span>have this traits</span>
                        </p>
                      </div>
                      <div class="progress">
                        <div
                          class="progress-bar w-75"
                          role="progressbar"
                          aria-valuenow="75"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                    </div>
                    <div className="col-md-6 mb-4">
                      <div className="tab_label">
                        <p>
                          Eyes <span>Alert</span>
                        </p>
                        <p>
                          14% <span>have this traits</span>
                        </p>
                      </div>
                      <div class="progress">
                        <div
                          class="progress-bar w-25"
                          role="progressbar"
                          aria-valuenow="25"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                    </div>
                    <div className="col-md-6 mb-4">
                      <div className="tab_label">
                        <p>
                          Camouflage <span className="big_text">Jungle</span>
                        </p>
                        <p>
                          45% <span>have this traits</span>
                        </p>
                      </div>
                      <div class="progress">
                        <div
                          class="progress-bar w-50"
                          role="progressbar"
                          aria-valuenow="50"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                    </div>
                    <div className="col-md-6 mb-4">
                      <div className="tab_label">
                        <p>
                          Mouth <span>Neutral</span>
                        </p>
                        <p>
                          61% <span>have this traits</span>
                        </p>
                      </div>
                      <div class="progress">
                        <div
                          class="progress-bar w-50"
                          role="progressbar"
                          aria-valuenow="50"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                    </div>
                    <div className="col-md-6 mb-4">
                      <div className="tab_label">
                        <p>
                          Weapon <span className="big_text">Pistol</span>
                        </p>
                        <p>
                          27% <span>have this traits</span>
                        </p>
                      </div>
                      <div class="progress">
                        <div
                          class="progress-bar w-25"
                          role="progressbar"
                          aria-valuenow="25"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                    </div>
                    <div className="col-md-6 mb-4">
                      <div className="tab_label">
                        <p>
                          Hair <span>Short</span>
                        </p>
                        <p>
                          35% <span>have this traits</span>
                        </p>
                      </div>
                      <div class="progress">
                        <div
                          class="progress-bar w-50"
                          role="progressbar"
                          aria-valuenow="50"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                    </div>
                    <div className="col-md-6 mb-4">
                      <div className="tab_label">
                        <p>
                          Accessories <span className="big_text">Grenade</span>
                        </p>
                        <p>
                          33% <span>have this traits</span>
                        </p>
                      </div>
                      <div class="progress">
                        <div
                          class="progress-bar w-25"
                          role="progressbar"
                          aria-valuenow="25"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                    </div>
                    <div className="col-md-6 mb-4">
                      <div className="tab_label">
                        <p>
                          Hat <span>None</span>
                        </p>
                        <p>
                          63% <span>have this traits</span>
                        </p>
                      </div>
                      <div class="progress">
                        <div
                          class="progress-bar w-50"
                          role="progressbar"
                          aria-valuenow="50"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                    </div>
                    <div className="col-md-6 mb-4">
                      <div className="tab_label">
                        <p>
                          Accessories{" "}
                          <span className="big_text">Ammo mags</span>
                        </p>
                        <p>
                          95% <span>have this traits</span>
                        </p>
                      </div>
                      <div class="progress">
                        <div
                          class="progress-bar w-75"
                          role="progressbar"
                          aria-valuenow="75"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="price_box">
                <h4>Price</h4>
                <div className="price_div">
                  <img src={"../img/favicon.png"} class="img-fluid" alt="" />
                  {Number(
                    convertToEth(NFTDetails.collection?.price.$numberDecimal)
                  ).toFixed(4)}{" "}
                  HNTR
                </div>
                <button type="button" className="yellow_btn mr-3 mb-3">
                  Buy Now
                </button>
                <button type="button" className="border_btn title_color">
                  Bid / Offer
                </button>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6 mb-5 width_45 auto_right">
              <h3 className="title_36 mb-4">Description</h3>
              <p className="textdes">{NFTDetails.desc} </p>
            </div>
            <div className="col-lg-6 mb-5">
              <h3 className="title_36 mb-4">
                About {NFTDetails.collection?.name} Collection
              </h3>
              <div className="row">
                <div className="col-md-4 nftDetails_img_con">
                  <img
                    src={NFTDetails.collection?.logoImage}
                    alt=""
                    class="img-fluid"
                  />
                </div>
                <div className="col-md-8">
                  <p className="textdes">
                    {NFTDetails.collection?.description}{" "}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-6 mb-5 width_45 auto_right">
              <h3 className="title_36 mb-4">Asset Details</h3>
              <ul className="nft_detaillist">
                <li>
                  <span className="asset_title">Size</span>
                  <span className="asset_detail">
                    {NFTDetails.assetsInfo?.size} KB
                  </span>
                </li>
                <li>
                  <span className="asset_title">Dimension</span>
                  <span className="asset_detail">
                    {NFTDetails.assetsInfo?.dimension} px
                  </span>
                </li>
                <li>
                  <span className="asset_title">Format</span>
                  <span className="asset_detail">
                    {NFTDetails.assetsInfo?.type}
                  </span>
                </li>
              </ul>
            </div>
            <div className="col-lg-6 mb-5">
              <h3 className="title_36 mb-4">Blockchain Details</h3>
              <ul className="nft_detaillist">
                <li>
                  <span className="asset_title">Contact Address</span>
                  <span className="asset_detail">
                    {NFTDetails.collection?.contractAddress?.slice(0, 4) +
                      "..." +
                      NFTDetails.collection?.contractAddress?.slice(38, 42)}
                  </span>
                </li>
                <li>
                  <span className="asset_title">Token ID</span>
                  <span className="asset_detail">{NFTDetails.tokenId}</span>
                </li>
                <li>
                  <span className="asset_title">Blockchain</span>
                  <span className="asset_detail">Binance Smart Chain</span>
                </li>
              </ul>
            </div>
            <div className="col-lg-6 mb-5 width_45 auto_right">
              <h3 className="title_36 mb-4">Properties</h3>
              <ul className="nft_detaillist">
                <li>
                  <span className="asset_title">SERIAL</span>
                  <span className="asset_detail">{NFTDetails.tokenId}</span>
                </li>
                <li>
                  <span className="asset_title">TYPE</span>
                  <span className="asset_detail">
                    {NFTDetails.catergoryInfo?.name}
                  </span>
                </li>
              </ul>
            </div>
            <div className="col-lg-6 mb-5">
              <h3 className="title_36 mb-4">Levels</h3>
              <ul className="nft_detailnumber">
                <li>
                  <span>1</span>Generation
                </li>
                <li>
                  <span>3</span>PPM
                </li>
              </ul>
            </div>
            <div className="col-md-12 mb-5">
              <h3 className="title_36 mb-4">
                Trading History for Meta Marines
              </h3>
              <img
                src={"../img/nftdetails/graf.png"}
                alt=""
                class="img-fluid box_shadow"
              />
            </div>
            <div className="col-md-12 mb-5">
              <h3 className="title_36 mb-4">Listings</h3>
              <div className="table-responsive">
                <NFTlisting />
              </div>
            </div>
            <div className="col-md-12 mb-5">
              <h3 className="title_36 mb-4">Offers</h3>
              <div className="table-responsive">
                <NFToffer />
              </div>
            </div>
            <div className="col-md-12 mb-5">
              <h3 className="title_36 mb-4">Histoy</h3>
              <div className="table-responsive">
                <NFThistory />
              </div>
            </div>

            <div className="col-md-12">
              <h3 className="title_36 mb-4">
                More from Barrett Firearms Collection
              </h3>
              <FirearmsCollection />
            </div>
            <div class="col-md-12 text-center mt-5">
              <a class="view_all_bdr" href="/">
                View All
              </a>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default NFTDetails;
