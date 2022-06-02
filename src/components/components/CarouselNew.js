import React, { useState, useEffect} from 'react';
import Slider from "./slick-loader/slider";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from 'react-router-dom';
import { getNFTs } from "./../../helpers/getterFunctions";
import "./../components-css/App.css";

function ItemsList() {
   
  const [putOnSaleItems, setPutOnSaleItems] = useState([]);
  useEffect(async() => {
    try{
      const reqData = {
        page: 1,
        limit: 12,
        nftID: "",
      collectionID: "",
      userID: "",
      categoryID: "",
      brandID: "",
      ERCType: "",
      searchText: "",
      isMinted: "",
      }
      const res = await getNFTs(reqData);
      console.log("result of getPutOnSaleItems helper fn--->",res);
      setPutOnSaleItems(res);
    }
   catch(e){
     console.log("Error in fetching all collections list",e);
   }
  },[])

  var settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1900,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: false,
        },
      },
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: false,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: false,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
        },
      },
    ],
  };

  return (
    <div className="nft">
      <Slider {...settings}>

        {
          putOnSaleItems ? putOnSaleItems.map((card, key) => {
            return (
              <a href={`/NFTdetails/${card.id}`}>
              <div className='items_slide'>
              <div className='items_profileimg'>
                <div className='profile_left'>
                  <img alt='' className='profile_img' src={'../img/profile/profile1.png'} />
                  <img alt='' className='icheck_img' src={'../img/collections/check.png'} />
                </div>
                {/* <div className='profile_right'>
                  <span>514d 18h 42m 39s</span>
                </div> */}
              </div>
              <div className='coverImg_cont'>

            <img alt='' src={card.image} class="img-fluid items_img" />
              </div>
            <div className='items_text'>
              <div className='items_info'>
                <div className='items_left'>
                  <h3 className=''>{card.name}</h3>
                  <p>{card.desc}</p>
                </div>
                <div className='items_right justify-content-end d-flex'>
                  <span> 
                    <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15.1062 2.75379C14.866 2.21491 14.5197 1.72658 14.0866 1.31613C13.6532 0.904465 13.1422 0.577318 12.5814 0.352482C11.9998 0.118416 11.3761 -0.00139215 10.7464 1.22043e-05C9.86295 1.22043e-05 9.00102 0.234414 8.25198 0.677172C8.07278 0.783086 7.90255 0.899419 7.74127 1.02617C7.57999 0.899419 7.40976 0.783086 7.23056 0.677172C6.48152 0.234414 5.61959 1.22043e-05 4.73615 1.22043e-05C4.10001 1.22043e-05 3.48357 0.118081 2.90118 0.352482C2.33851 0.578202 1.83138 0.902892 1.39594 1.31613C0.962277 1.72611 0.615857 2.21456 0.376312 2.75379C0.127229 3.31462 0 3.91017 0 4.52309C0 5.10128 0.121853 5.70378 0.363768 6.31669C0.56626 6.82891 0.856557 7.36021 1.22749 7.89673C1.81526 8.74579 2.62343 9.6313 3.62693 10.529C5.28987 12.017 6.93668 13.0449 7.00657 13.0866L7.43126 13.3505C7.61942 13.4668 7.86133 13.4668 8.04949 13.3505L8.47418 13.0866C8.54407 13.0431 10.1891 12.017 11.8538 10.529C12.8573 9.6313 13.6655 8.74579 14.2533 7.89673C14.6242 7.36021 14.9163 6.82891 15.117 6.31669C15.3589 5.70378 15.4808 5.10128 15.4808 4.52309C15.4825 3.91017 15.3553 3.31462 15.1062 2.75379Z" fill="#AAAAAA"/>
                    </svg>
                    99
                  </span>
                </div>
              </div>
              <Link to={`/NFTdetails/${card.id}`} className='border_btn width-100 title_color'>Buy</Link>
            </div>
          </div>
          </a>
            )
          }) : ""
        } 
        {putOnSaleItems?.length !== 0 ? 
        <div className='items_slide last_slide'>
          <Link to={'/marketplace'} className='view_slide align-items-center justify-content-center d-flex'>View All</Link>
        </div> : ""}
      </Slider>
    </div>
  )
}

export default ItemsList
