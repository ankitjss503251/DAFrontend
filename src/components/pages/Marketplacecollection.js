import React, { useState, useEffect } from "react";
import Footer from "../components/footer";
import { Link } from "react-router-dom";
import { getCollections } from "../../helpers/getterFunctions";
import { marketPlaceCollection } from "../../Data/dummyJSON";

var register_bg = {
  backgroundImage: "url(../img/marketplace/marketplace-bg.jpg)",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPositionX: "center",
  backgroundPositionY: "center",
};
var bgImgStyle = {
  backgroundImage: "url(./img/background.jpg)",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPositionX: "center",
  backgroundPositionY: "center",
  backgroundColor: "#000",
};

function Marketplacecollection() {
  console.log("window location", window.location.pathname);

  const [allCollections, setAllCollections] = useState([]);

  useEffect(async () => {
    try {
      const reqData = {
        page: 1,
        limit: 12,
      };
      const res = await getCollections(reqData);
      console.log("result of getALLCollections helper fn--->", res);
      setAllCollections(res);
    } catch (e) {
      console.log("Error in fetching all collections list", e);
    }
  }, []);

  return (
    <div>
      <section className="register_hd pdd_12" style={register_bg}>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1>Marketplace</h1>
            </div>
          </div>
        </div>
      </section>
      <section className="marketplace-tab pdd_8" style={bgImgStyle}>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <ul
                className="tab_btn mb-5 nav nav-pills1"
                id="pills-tab"
                role="tablist"
              >
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
                    Trending
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button
                    class="nav-link"
                    id="pills-profile-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-profile"
                    type="button"
                    role="tab"
                    aria-controls="pills-profile"
                    aria-selected="true"
                  >
                    Top
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button
                    class="nav-link"
                    id="pills-Firearms-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-Firearms"
                    type="button"
                    role="tab"
                    aria-controls="pills-Firearms"
                    aria-selected="true"
                  >
                    Firearms
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button
                    class="nav-link"
                    id="pills-Soldiers-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-Soldiers"
                    type="button"
                    role="tab"
                    aria-controls="pills-Soldiers"
                    aria-selected="true"
                  >
                    Soldiers
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button
                    class="nav-link"
                    id="pills-Hot-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-Hot"
                    type="button"
                    role="tab"
                    aria-controls="pills-Hot"
                    aria-selected="true"
                  >
                    Hot List
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button
                    class="nav-link"
                    id="pills-Ranking-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-Ranking"
                    type="button"
                    role="tab"
                    aria-controls="pills-Ranking"
                    aria-selected="true"
                  >
                    NFT Ranking
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button
                    class="nav-link"
                    id="pills-Auctions-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-Auctions"
                    type="button"
                    role="tab"
                    aria-controls="pills-Auctions"
                    aria-selected="true"
                  >
                    Live Auctions
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div class="tab-content" id="pills-tabContent">
            <div
              class="tab-pane fade show active"
              id="pills-home"
              role="tabpanel"
              aria-labelledby="pills-home-tab"
            >
              <div className="row">
                {allCollections.map((card) => (
                  <div className="col-lg-4 col-md-6 mb-5">
                    <Link to={"/collection"}>
                      <div className="collection_slide">
                        <img className="img-fluid" src={card.logoImg} alt="" />
                        <div className="collection_text">
                          <div className="coll_profileimg">
                            <img
                              alt=""
                              className="profile_img"
                              src={card.coverImg}
                            />
                            <img
                              alt=""
                              className="check_img"
                              src={"../img/collections/check.png"}
                            />
                          </div>
                          <h4 className="collname">{card.name}</h4>
                          <p>{card.desc}</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
                ;
                <div class="col-md-12 text-center mt-0 mt-lg-5 mt-xl-5 mt-md-5">
                  <a class="view_all_bdr" href="/">
                    Load More
                  </a>
                </div>
              </div>
            </div>
            <div
              class="tab-pane fade"
              id="pills-profile"
              role="tabpanel"
              aria-labelledby="pills-profile-tab"
            >
              <div className="row">
                {marketPlaceCollection.map((card) => (
                  <div className="col-lg-4 col-md-6 mb-5">
                    <Link to={"/collection"}>
                      <div className="collection_slide">
                        <img className="img-fluid" src={card.img} alt="" />
                        <div className="collection_text">
                          <div className="coll_profileimg">
                            <img
                              alt=""
                              className="profile_img"
                              src={"../img/collections/profile1.png"}
                            />
                            <img
                              alt=""
                              className="check_img"
                              src={"../img/collections/check.png"}
                            />
                          </div>
                          <h4 className="collname">{card.heading}</h4>
                          <p>ERC-73</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
                <div class="col-md-12 text-center mt-0 mt-lg-5 mt-xl-5 mt-md-5">
                  <a class="view_all_bdr" href="/">
                    Load More
                  </a>
                </div>
              </div>
            </div>
            <div
              class="tab-pane fade"
              id="pills-Firearms"
              role="tabpanel"
              aria-labelledby="pills-Firearms-tab"
            >
              <div className="row">
                {marketPlaceCollection.map((card) => (
                  <div className="col-lg-4 col-md-6 mb-5">
                    <Link to={"/collection"}>
                      <div className="collection_slide">
                        <img className="img-fluid" src={card.img} alt="" />
                        <div className="collection_text">
                          <div className="coll_profileimg">
                            <img
                              alt=""
                              className="profile_img"
                              src={"../img/collections/profile1.png"}
                            />
                            <img
                              alt=""
                              className="check_img"
                              src={"../img/collections/check.png"}
                            />
                          </div>
                          <h4 className="collname">{card.heading}</h4>
                          <p>ERC-73</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
                <div class="col-md-12 text-center mt-0 mt-lg-5 mt-xl-5 mt-md-5">
                  <a class="view_all_bdr" href="/">
                    Load More
                  </a>
                </div>
              </div>
            </div>
            <div
              class="tab-pane fade"
              id="pills-Soldiers"
              role="tabpanel"
              aria-labelledby="pills-Soldiers-tab"
            >
              <div className="row">
                {marketPlaceCollection.map((card) => (
                  <div className="col-lg-4 col-md-6 mb-5">
                    <Link to={"/collection"}>
                      <div className="collection_slide">
                        <img className="img-fluid" src={card.img} alt="" />
                        <div className="collection_text">
                          <div className="coll_profileimg">
                            <img
                              alt=""
                              className="profile_img"
                              src={"../img/collections/profile1.png"}
                            />
                            <img
                              alt=""
                              className="check_img"
                              src={"../img/collections/check.png"}
                            />
                          </div>
                          <h4 className="collname">{card.heading}</h4>
                          <p>ERC-73</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
                <div class="col-md-12 text-center mt-0 mt-lg-5 mt-xl-5 mt-md-5">
                  <a class="view_all_bdr" href="/">
                    Load More
                  </a>
                </div>
              </div>
            </div>
            <div
              class="tab-pane fade"
              id="pills-Hot"
              role="tabpanel"
              aria-labelledby="pills-Hot-tab"
            >
              <div className="row">
                {marketPlaceCollection.map((card) => (
                  <div className="col-lg-4 col-md-6 mb-5">
                    <Link to={"/collection"}>
                      <div className="collection_slide">
                        <img className="img-fluid" src={card.img} alt="" />
                        <div className="collection_text">
                          <div className="coll_profileimg">
                            <img
                              alt=""
                              className="profile_img"
                              src={"../img/collections/profile1.png"}
                            />
                            <img
                              alt=""
                              className="check_img"
                              src={"../img/collections/check.png"}
                            />
                          </div>
                          <h4 className="collname">{card.heading}</h4>
                          <p>ERC-73</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
                <div class="col-md-12 text-center mt-0 mt-lg-5 mt-xl-5 mt-md-5">
                  <a class="view_all_bdr" href="/">
                    Load More
                  </a>
                </div>
              </div>
            </div>
            <div
              class="tab-pane fade"
              id="pills-Ranking"
              role="tabpanel"
              aria-labelledby="pills-Ranking-tab"
            >
              <div className="row">
                {marketPlaceCollection.map((card) => (
                  <div className="col-lg-4 col-md-6 mb-5">
                    <Link to={"/collection"}>
                      <div className="collection_slide">
                        <img className="img-fluid" src={card.img} alt="" />
                        <div className="collection_text">
                          <div className="coll_profileimg">
                            <img
                              alt=""
                              className="profile_img"
                              src={"../img/collections/profile1.png"}
                            />
                            <img
                              alt=""
                              className="check_img"
                              src={"../img/collections/check.png"}
                            />
                          </div>
                          <h4 className="collname">{card.heading}</h4>
                          <p>ERC-73</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
                <div class="col-md-12 text-center mt-0 mt-lg-5 mt-xl-5 mt-md-5">
                  <a class="view_all_bdr" href="/">
                    Load More
                  </a>
                </div>
              </div>
            </div>
            <div
              class="tab-pane fade"
              id="pills-Auctions"
              role="tabpanel"
              aria-labelledby="pills-Auctions-tab"
            >
              <div className="row">
                {marketPlaceCollection.map((card) => (
                  <div className="col-lg-4 col-md-6 mb-5">
                    <Link to={"/collection"}>
                      <div className="collection_slide">
                        <img className="img-fluid" src={card.img} alt="" />
                        <div className="collection_text">
                          <div className="coll_profileimg">
                            <img
                              alt=""
                              className="profile_img"
                              src={"../img/collections/profile1.png"}
                            />
                            <img
                              alt=""
                              className="check_img"
                              src={"../img/collections/check.png"}
                            />
                          </div>
                          <h4 className="collname">{card.heading}</h4>
                          <p>ERC-73</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
                <div class="col-md-12 text-center mt-0 mt-lg-5 mt-xl-5 mt-md-5">
                  <a class="view_all_bdr" href="/">
                    Load More
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Marketplacecollection;
