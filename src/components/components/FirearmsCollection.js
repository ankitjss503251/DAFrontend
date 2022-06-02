import React from 'react';
import Slider from "./slick-loader/slider";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


function FirearmsCollection(props) {

  var settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1300,
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
          infinite: false,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
    ],
  };

  return (
    <div className="nftdetails">
      <Slider {...settings}>
        {
          props.nfts ? props.nfts.map((card, key) => {
            return (
             
              <div className='nft_slide' key={key}>
                 <a href={`/NFTdetails/${card.id}`}>
              <img alt='' src={card.image} class="img-fluid mb-3 nftslide_img" />
    
                <div className='nft_info'>
                  
                    <span>{props.collectionName} Collection &nbsp;<img alt='' src={'../img/check.png'} class="img-fluid" /></span>
                    <h3 className=''>{card.name}</h3>
                    <p className='justify-content-start'><img alt='' src={'../img/favicon.png'} class="img-fluid" />{props.price} HNTR</p>
                  
                </div>
                </a>
            </div>
           
            )
          }) : ""
        }
      
      </Slider>
    </div>
  )
}

export default FirearmsCollection
