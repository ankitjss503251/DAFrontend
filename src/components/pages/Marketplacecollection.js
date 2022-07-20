import React, { useState, useEffect } from "react";
import Footer from "../components/footer";
import { getCategory, getCollections } from "../../helpers/getterFunctions";
import { useParams } from "react-router-dom";
import { NotificationManager } from "react-notifications";
import BGImg from "./../../assets/images/background.jpg";
import MarketplaceBGIamge from "../../assets/marketplace-bg.jpg";
import CollectionSkeletonCard from "../components/Skeleton/CollectionSkeletonCard";
import { Link } from "@reach/router";

function Marketplacecollection() {
  var register_bg = {
    backgroundImage: `url(${MarketplaceBGIamge})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPositionX: "center",
    backgroundPositionY: "center",
  };
  var bgImgStyle = {
    backgroundImage: `url(${BGImg})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPositionX: "center",
    backgroundPositionY: "center",
    backgroundColor: "#000",
  };

  const [allCollections, setAllCollections] = useState([]);
  const [currPageAll, setCurrPageAll] = useState(1);
  const [currPage, setCurrPage] = useState(1);
  const [loadMore, setLoadMore] = useState(false);
  const [loadMoreDisabled, setLoadMoreDisabled] = useState("");
  const [loadMoreDisabledAll, setLoadMoreDisabledAll] = useState("");
  const [categories, setCategories] = useState([]);
  const [showTab, setShowTab] = useState("");
  const [activeCat, setActiveCat] = useState([]);
  const { searchedText } = useParams();
  const [loader, setLoader] = useState(false);
  const [cardCount, setCardCount] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      setLoader(true);
      let temp = allCollections;
      try {
        const res1 = await getCategory();
        setCategories(res1);
        let t = [];
        res1?.map((r) => {
          t = [...t, r.name];
        });
        if (!t.includes(searchedText) && !showTab) {
          const reqData = {
            page: currPageAll,
            limit: 12,
            searchText: searchedText ? searchedText : "",
            isOnMarketplace: 1,
          };
          const res = await getCollections(reqData);
          setCardCount(cardCount + res.length);
          if (res.length > 0) {
            setLoadMoreDisabledAll("");
            temp = [...temp, res];
            setAllCollections(temp);
          }

          if (allCollections && res.length <= 0) {
            setLoader(false);
            setLoadMoreDisabledAll("disabled");
            return;
          }
        } else {
          setLoader(true);
          try {
            setShowTab("show active");
            if (searchedText) {
              document.getElementById(searchedText).classList.add("active");
            }
            const res1 = await getCategory({
              name: searchedText,
            });
            handleCategoryChange(res1[0]);
          } catch (e) {
            console.log("Error", e);
          }
          setLoader(false);
        }
      } catch (e) {
        console.log("Error in fetching all collections list", e);
      }
      setLoader(false);
    };
    fetch();
  }, [loadMore, searchedText, showTab]);

  const handleCategoryChange = async (category) => {
    setLoader(true);
    let temp2 = activeCat;
    try {
      const reqBody = {
        page: currPage,
        limit: 12,
        categoryID: category._id,
        isOnMarketplace: 1,
      };
      const ind = await getCollections(reqBody);
      setCardCount(cardCount + ind.length);
      if (ind.length > 0) {
        setLoadMoreDisabled("");
        temp2 = [...temp2, ind];
        setActiveCat(temp2);
      }
      if (ind?.length <= 0 && activeCat) {
        setLoader(false);
        setLoadMoreDisabled("disabled");
        return;
      }
    } catch (e) {
      console.log("Error", e);
    }
    setLoader(false);
  };

  return (
    <div>
      {/* {(loadMoreDisabled && activeCat.length > 0) ||
      (allCollections.length > 0 && loadMoreDisabledAll)
        ? NotificationManager.info("No more items to load")
        : ""} */}
      <section className='register_hd pdd_12' style={register_bg}>
        <div className='container'>
          <div className='row'>
            <div className='col-md-12'>
              <h1>Marketplace</h1>
            </div>
          </div>
        </div>
      </section>

      <section className='marketplace-tab pdd_8' style={bgImgStyle}>
        <div className='container'>
          <div className='row'>
            <div className='col-md-12'>
              <ul
                className='tab_btn mb-5 nav nav-pills1'
                id='pills-tab'
                role='tablist'>
                {categories?.length > 0 ? (
                  <li className='nav-item' role='presentation'>
                    <button
                      className={!showTab ? "nav-link active" : "nav-link"}
                      id='all'
                      data-bs-toggle='pill'
                      data-bs-target='#all'
                      type='button'
                      role='tab'
                      aria-controls='#all'
                      aria-selected='true'
                      onClick={() => {
                        setLoadMoreDisabledAll("")
                        setLoadMoreDisabled("");
                        setShowTab("");
                        setAllCollections([]);
                        setCardCount(0);
                        setCurrPageAll(1);
                      }}>
                      All
                    </button>
                  </li>
                ) : (
                  ""
                )}
                {categories?.length > 0
                  ? categories.map((cat, key) => {
                      return (
                        <li className='nav-item' role='presentation' key={key}>
                          <button
                            className='nav-link'
                            id={cat.name}
                            data-bs-toggle='pill'
                            data-bs-target={`#${cat.name}`}
                            type='button'
                            role='tab'
                            aria-controls={`#${cat.name}`}
                            aria-selected='true'
                            onClick={() => {
                              setLoader(true);
                              setCurrPage(1);
                              setActiveCat([]);
                              setCardCount(0);
                              handleCategoryChange(cat);
                              setLoadMoreDisabledAll("")
                              setLoadMoreDisabled("");
                              setShowTab("show active");
                            }}>
                            {cat.name}
                          </button>
                        </li>
                      );
                    })
                  : ""}
              </ul>
            </div>
          </div>
          <div className='tab-content' id='pills-tabContent'>
            <div
              className={!showTab ? "tab-pane fade show active" : "tab-pane fade"}
              id='all'
              role='tabpanel'
              aria-labelledby='all'>
              <div className='row'>
                {loader ? (
                  <CollectionSkeletonCard cards={cardCount} />
                ) : allCollections?.length > 0 ? (
                  allCollections.map((oIndex) => {
                    return oIndex.map((card, key) => (
                      <div className='col-lg-4 col-md-6 mb-5' key={key}>
                        <div className='collection_slide'>
                          <a href={`/collection/${card?._id}`}>
                            <div className="mint_img">
                              <img
                                className='img-fluid w-100'
                                src={card?.logoImg}
                                onError={(e) => {
                                  e.target.src = "../img/collections/list4.png";
                                }}
                                alt=''
                              />
                            </div>
                          </a>
                          <div className='collection_text'>
                          <div className='coll_profileimg'>
                            <div className="rotater_border profile_img">
                              <a className="rounded-circle"
                                href={`/collectionwithcollection/${card?.brand?._id}`}>
                                
                                  <img
                                    alt=''
                                    className=''
                                    src={card.brand?.logoImage}
                                    onError={(e) => {
                                      e.target.src =
                                        "../img/collections/list4.png";
                                    }}
                                  />
                                  {/* <img
                                    alt=''
                                    className='check_img'
                                    src={"../img/collections/check.png"}
                                  /> */}
                              </a>
                            </div>
                          </div>
                            
                              <h4 className='collname'>

                                {card.name?.length > 15
                                  ? card.name?.slice(0, 15)
                                  : card.name}

                              </h4>
                              <p>
                                {card.desc?.length > 15
                                  ? card.desc?.slice(0, 15) + "..."
                                  : card.desc}
                              </p>
                            
                          </div>
                        </div>
                      </div>
                    ));
                  })
                ) : (
                  <h2 className='text-white text-center'>
                    No Collection Found
                  </h2>
                )}
                {allCollections[0]?.length > 12 ? (
                  <div className='col-md-12 text-center mt-0 mt-lg-5 mt-xl-5 mt-md-5'>
                    <button
                      type='button'
                      className={`btn view_all_bdr ${loadMoreDisabledAll}`}
                      onClick={() => {
                        setCurrPageAll(currPageAll + 1);
                        setLoadMore(!loadMore);
                      }}>
                      Load More
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div
              className={`tab-pane fade ${showTab}`}
              id={`#${activeCat.name}`}
              role='tabpanel'
              aria-labelledby={activeCat.name}>
              <div className='row'>
                {loader ? (
                  <CollectionSkeletonCard cards={cardCount} />
                ) : activeCat?.length > 0 ? (
                  activeCat.map((oIndex) => {
                    return oIndex.map((card, key) => (
                      <div className='col-lg-4 col-md-6 mb-5' key={key}>
                        <div className='collection_slide'>
                          <a href={`/collection/${card._id}`}>
                            <div className="mint_img">
                              <img
                                className='img-fluid w-100'
                                src={card.logoImg}
                                alt=''
                                onError={(e) => {
                                  e.target.src = "../img/collections/list4.png";
                                }}
                              />
                            </div>
                          </a>
                          <div className='collection_text'>
                            <div className='coll_profileimg'>
                              <div className="rotater_border profile_img">
                                <a className="rounded-circle"
                                href={`/collectionwithcollection/${card.brand._id}`}>
                                  <img
                                    alt=''
                                    className=''
                                    src={card.brand.logoImage}
                                    onError={(e) => {
                                      e.target.src =
                                        "../img/collections/list4.png";
                                    }}
                                  />
                                  {/* <img
                                  alt=''
                                  className='check_img'
                                  src={"../img/collections/check.png"}
                                  /> */}
                                </a>
                              </div>
                            </div>
                            
                            <h4 className='collname'>
                              <a href={`/collection/${card._id}`}>
                                {card.name?.length > 8
                                  ? card.name?.slice(0, 8)
                                  : card.name}
                              </a>
                            </h4>
                            <p>
                              {card.desc?.length > 8
                                ? card.desc?.slice(0, 8)
                                : card.desc.slice(0, 8)}
                            </p>
                            
                          </div>
                          :
                        </div>
                      </div>
                    ));
                  })
                ) : (
                  <h2 className='text-white text-center'>
                    No Collection Found
                  </h2>
                )}
                {activeCat[0]?.length > 12 ? (
                  <div className='col-md-12 text-center mt-0 mt-lg-5 mt-xl-5 mt-md-5'>
                    <button
                      type='button'
                      className={`btn view_all_bdr ${loadMoreDisabled}`}
                      onClick={() => {
                        setCurrPage(currPage + 1);
                        setLoadMore(!loadMore);
                      }}>
                      Load More
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
            )
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Marketplacecollection;
