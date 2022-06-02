import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getNFTs } from "../../helpers/getterFunctions";

function Marketplacecart() {
  const [allNFTs, setAllNFTs] = useState([]);
  const { id } = useParams();
  useEffect(async () => {
    try {
      const reqData = {
        page: 1,
        limit: 12,
        nftID: "",
        collectionID: "",
        isLazyMinted: false,
        userID: "",
        categoryID: "",
        brandID: "",
        ERCType: "",
        searchText: "",
        isMinted: "",
      };
      const res = await getNFTs(reqData);
      console.log("result of getAllNFTs helper fn--->", res);
      setAllNFTs(res);
    } catch (e) {
      console.log("Error in fetching all NFTs list", e);
    }
  }, []);
  return (
    <div className="items_slide">
      {allNFTs
        ? allNFTs.map((card, key) => {
            return (
              <>
              <a href={`/NFTdetails/${card.id}`}>
                <div className="items_profileimg" key={key}>
                  <div className="profile_left">
                    <img alt="" className="profile_img" src={card.logoImage} />
                    <img alt="" className="icheck_img" src={card.logoImage} />
                  </div>
                  <div className="profile_right">
                    <span>sfs</span>
                  </div>
                </div>
                <img alt="" src={card.image} class="img-fluid items_img" />
                <div className="items_text">
                  <div className="items_info">
                    <div className="items_left">
                      <h3 className="">{card.name}</h3>
                      <p>{card.desc}</p>
                    </div>
                    <div className="items_right justify-content-end d-flex">
                      <span>
                        <svg
                          width="16"
                          height="14"
                          viewBox="0 0 16 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M15.1062 2.75379C14.866 2.21491 14.5197 1.72658 14.0866 1.31613C13.6532 0.904465 13.1422 0.577318 12.5814 0.352482C11.9998 0.118416 11.3761 -0.00139215 10.7464 1.22043e-05C9.86295 1.22043e-05 9.00102 0.234414 8.25198 0.677172C8.07278 0.783086 7.90255 0.899419 7.74127 1.02617C7.57999 0.899419 7.40976 0.783086 7.23056 0.677172C6.48152 0.234414 5.61959 1.22043e-05 4.73615 1.22043e-05C4.10001 1.22043e-05 3.48357 0.118081 2.90118 0.352482C2.33851 0.578202 1.83138 0.902892 1.39594 1.31613C0.962277 1.72611 0.615857 2.21456 0.376312 2.75379C0.127229 3.31462 0 3.91017 0 4.52309C0 5.10128 0.121853 5.70378 0.363768 6.31669C0.56626 6.82891 0.856557 7.36021 1.22749 7.89673C1.81526 8.74579 2.62343 9.6313 3.62693 10.529C5.28987 12.017 6.93668 13.0449 7.00657 13.0866L7.43126 13.3505C7.61942 13.4668 7.86133 13.4668 8.04949 13.3505L8.47418 13.0866C8.54407 13.0431 10.1891 12.017 11.8538 10.529C12.8573 9.6313 13.6655 8.74579 14.2533 7.89673C14.6242 7.36021 14.9163 6.82891 15.117 6.31669C15.3589 5.70378 15.4808 5.10128 15.4808 4.52309C15.4825 3.91017 15.3553 3.31462 15.1062 2.75379Z"
                            fill="#AAAAAA"
                          />
                        </svg>
                        {card.like}
                      </span>
                    </div>
                  </div>
                  <Link to={`/NFTdetails/${card.id}`} className="border_btn width-100 title_color">
                    Place bids
                  </Link>
                </div>
                </a>
              </>
            );
          })
        : ""}
    </div>
  );
}

export default Marketplacecart;
