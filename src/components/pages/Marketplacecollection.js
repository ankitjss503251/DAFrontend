import React, { useState, useEffect } from "react";
import Footer from "../components/footer";
import { getCategory, getCollections } from "../../helpers/getterFunctions";
import { useParams } from "react-router-dom";
import { NotificationManager } from "react-notifications";
import BGImg from "./../../assets/images/background.jpg";
import MarketplaceBGIamge from "../../assets/marketplace-bg.jpg";



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
  const [currPage, setCurrPage] = useState(1);
  const [loadMore, setLoadMore] = useState(false);
  const [loadMoreDisabled, setLoadMoreDisabled] = useState("");
  const [categories, setCategories] = useState([]);
  const [showTab, setShowTab] = useState("");
  const [activeCat, setActiveCat] = useState([]);
  const { searchedText } = useParams();

  useEffect(async () => {
    let temp = allCollections;
    try {
      const res1 = await getCategory();
      setCategories(res1);
      let t = [];
      res1.map((r) => {
        t = [...t, r.name];
      });

      if (!t.includes(searchedText)) {
        const reqData = {
          page: currPage,
          limit: 1,
          searchText: searchedText ? searchedText : "",
          isOnMarketplace: 1,
        };
        const res = await getCollections(reqData);
        if (res.length > 0) {
          setLoadMoreDisabled("");
          temp = [...temp, res];
          setAllCollections(temp);
          setCurrPage(currPage + 1);
        }
        if (allCollections && res.length <= 0) {
          setLoadMoreDisabled("disabled");
        }
      } else {
        try {
          setShowTab("show active");
          document.getElementById(searchedText).classList.add("active");
          const res1 = await getCategory({
            name: searchedText,
          });
          handleCategoryChange(res1[0]);
        } catch (e) {
          console.log("Error", e);
        }
      }
    } catch (e) {
      console.log("Error in fetching all collections list", e);
    }
  }, [loadMore, searchedText]);

  const handleCategoryChange = async (category) => {
    try {
      const reqBody = {
        page: 1,
        limit: 12,
        categoryID: category._id,
        isOnMarketplace: 1,
      };
      const ind = await getCollections(reqBody);
      setActiveCat(ind);
    } catch (e) {
      console.log("Error", e);
    }
  };

  return (
    <div>
      {loadMoreDisabled && !showTab
        ? NotificationManager.info("No more items to load")
        : ""}
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
                <li class='nav-item' role='presentation'>
                  <button
                    class={!showTab ? "nav-link active" : "nav-link"}
                    id='all'
                    data-bs-toggle='pill'
                    data-bs-target='#all'
                    type='button'
                    role='tab'
                    aria-controls='#all'
                    aria-selected='true'
                    onClick={() => {
                      setShowTab("");
                      window.location.href = '/marketplacecollection'
                    }}>
                    All
                  </button>
                </li>
                {categories?.length > 0
                  ? categories.map((cat, key) => {
                      return (
                        <li class='nav-item' role='presentation' key={key}>
                          <button
                            class='nav-link'
                            id={cat.name}
                            data-bs-toggle='pill'
                            data-bs-target={`#${cat.name}`}
                            type='button'
                            role='tab'
                            aria-controls={`#${cat.name}`}
                            aria-selected='true'
                            onClick={() => {
                              handleCategoryChange(cat);
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
          <div class='tab-content' id='pills-tabContent'>
            <div
              class={!showTab ? "tab-pane fade show active" : "tab-pane fade"}
              id='all'
              role='tabpanel'
              aria-labelledby='all'>
              <div className='row'>
                {allCollections && allCollections.length > 0
                  ? allCollections.map((oIndex) => {
                      return oIndex.map((card) => (
                        <div className='col-lg-4 col-md-6 mb-5'>
                          <div className='collection_slide'>
                            <a href={`/collection/${card._id}`}>
                              <img
                                className='img-fluid w-100'
                                src={card?.logoImg}
                                alt=''
                              />
                            </a>
                            <div className='collection_text'>
                              <a
                                href={`/collectionwithcollection/${card?.brand?._id}`}>
                                <div className='coll_profileimg'>
                                  <img
                                    alt=''
                                    className='profile_img'
                                    src={card.brand?.logoImage}
                                  />
                                  <img
                                    alt=''
                                    className='check_img'
                                    src={"../img/collections/check.png"}
                                  />
                                </div>
                              </a>
                              <a href={`/collection/${card._id}`}>
                                <h4 className='collname'>{card.name}</h4>
                                <p>{card.desc}</p>
                              </a>
                            </div>
                          </div>
                        </div>
                      ));
                    })
                  : ""}
                {allCollections?.length > 0 ? (
                  <div class='col-md-12 text-center mt-0 mt-lg-5 mt-xl-5 mt-md-5'>
                    <button
                      type='button'
                      className={`btn view_all_bdr ${loadMoreDisabled}`}
                      onClick={() => setLoadMore(!loadMore)}>
                      Load More
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>

            {activeCat ? (
              <div
                class={`tab-pane fade ${showTab}`}
                id={`#${activeCat.name}`}
                role='tabpanel'
                aria-labelledby={activeCat.name}>
                <div className='row'>
                  {activeCat.length > 0
                    ? activeCat.map((card, key) => (
                        <div className='col-lg-4 col-md-6 mb-5' key={key}>
                          <div className='collection_slide'>
                            <a href={`/collection/${card._id}`}>
                              <img
                                className='img-fluid w-100'
                                src={card.logoImg}
                                alt=''
                              />
                            </a>
                            <div className='collection_text'>
                              <a
                                href={`/collectionwithcollection/${card.brand._id}`}>
                                <div className='coll_profileimg'>
                                  <img
                                    alt=''
                                    className='profile_img'
                                    src={card.brand.logoImage}
                                  />
                                  <img
                                    alt=''
                                    className='check_img'
                                    src={"../img/collections/check.png"}
                                  />
                                </div>
                              </a>
                              <a href={`/collection/${card._id}`}>
                                <h4 className='collname'>{card.name}</h4>
                                <p>{card.desc}</p>
                              </a>
                            </div>
                          </div>
                        </div>
                      ))
                    : ""}
                  {activeCat?.length > 12 ? (
                    <div class='col-md-12 text-center mt-0 mt-lg-5 mt-xl-5 mt-md-5'>
                      <button
                        type='button'
                        className={`btn view_all_bdr ${loadMoreDisabled}`}
                        onClick={() => setLoadMore(!loadMore)}>
                        Load More
                      </button>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Marketplacecollection;
