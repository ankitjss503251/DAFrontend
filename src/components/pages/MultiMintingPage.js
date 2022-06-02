import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Footer from "../components/footer";
import MintEventSlider from "../components/MintEventSlider";
import { getAllCollections, getNFTList } from "../../apiServices";
import { useCookies } from "react-cookie";
import { convertToEth } from "../../helpers/numberFormatter";
import NotificationManager from "react-notifications/lib/NotificationManager";

const bgImgStyle = {
  backgroundImage: "url(./img/background.jpg)",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPositionX: "center",
  backgroundPositionY: "center",
  backgroundColor: "#000",
};

function MultiMintingPage(props) {
  const [currentUser, setCurrentUser] = useState();
  const [cookies, setCookie, removeCookie] = useCookies([]);
  const [collectionDetails, setCollectionDetails] = useState();

  const { id } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const bgImage = {
    backgroundImage: `url(${collectionDetails?.coverImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  useEffect(() => {
    if (cookies.selected_account) setCurrentUser(cookies.selected_account);
    else NotificationManager.error("Connect Yout Wallet", "", 800);

    // eslint-disable-next-line react-hooks/exhaustive-deps

    console.log("current user is---->", currentUser, cookies.selected_account);
  }, [currentUser]);

  useEffect(() => {
    const fetch = async () => {
      let reqBody = { page: 1, limit: 12, collectionID: id };
      // let nfts = await getNFTList(reqBody);
      // if (nfts && nfts.results && nfts.results.length > 0) setNfts(nfts);
      reqBody = {
        page: 1,
        limit: 12,
        collectionID: id,
        userID: "",
        categoryID: "",
        brandID: "",
        ERCType: "",
        searchText: "",
        filterString: "",
        isMinted: "",
        isHotCollection: "",
        isExclusive: "",
      };

      let collection = await getAllCollections(reqBody);

      if (collection && collection.results && collection.results.length > 0) {
        console.log("collections", collection?.results[0][0]);
        setCollectionDetails(collection.results[0][0]);
      }
    };
    fetch();
  }, []);

  return (
    <div style={bgImgStyle}>
      <section className="collection_banner pdd_8" style={bgImage}></section>
      <section className="collection_info">
        <div className="container">
          <div className="collection_pick">
            <img
              alt=""
              src={collectionDetails?.logoImage}
              class="img-fluid collection_profile"
            />
            <img
              alt=""
              src={"../img/mint/blue_check.png"}
              class="img-fluid check_img"
            />
          </div>
          <h1 className="collection_title text-center">
            {collectionDetails?.name}
          </h1>
          <ul class="collection_social mb-4">
            <li>
              <a href="/">
                <i class="fa fa-facebook fa-lg"></i>
              </a>
            </li>
            <li>
              <a href="/">
                <i class="fa fa-twitter fa-lg"></i>
              </a>
            </li>
            <li>
              <a href="/">
                <i class="fa fa-linkedin fa-lg"></i>
              </a>
            </li>
            <li>
              <a href="/">
                <i class="fa fa-pinterest fa-lg"></i>
              </a>
            </li>
            <li>
              <a href="/">
                <i class="fa fa-rss fa-lg"></i>
              </a>
            </li>
          </ul>
          <ul className="collection_status mt-5 mb-5">
            <li>
              <h4>{collectionDetails?.totalSupply}</h4>
              <p>items</p>
            </li>
            <li>
              <h4>
                {Number(
                  convertToEth(collectionDetails?.price.$numberDecimal)
                ).toFixed(4)}
              </h4>
              <p>HNTR</p>
            </li>
            <li>
              <h4>Open</h4>
              <p>Status</p>
            </li>
          </ul>
          <div className="collection_description text-center">
            <p>{collectionDetails?.description}</p>
            <span className="top_arrow">
              <img alt="" src={"../img/top_arrow.png"} class="img-fluid" />
            </span>
          </div>
        </div>
      </section>
      <section className="collection_list mb-5 pb-5">
        <div className="container">
          <div className="event_slider">
            <MintEventSlider
              id={id}
              price={Number(
                convertToEth(collectionDetails?.price.$numberDecimal)
              ).toFixed(4)}
              
            />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default MultiMintingPage;
