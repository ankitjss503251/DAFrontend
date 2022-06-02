import React, { useState, useEffect } from 'react';
import Footer from '../components/footer';
import CollectionList from '../components/CollectionList';
import Relatedcollection from '../components/Relatedcollection';
import { NavLink } from 'react-router-dom';
import { CollectionCard } from '../../Data/dummyJSON';
import ItemSVG from '../SVG/ItemSVG';
import ActivitySVG from '../SVG/ActivitySVG';
import Threegrid from '../SVG/Threegrid';
import Twogrid from '../SVG/Twogrid';


const bgImgStyle = {
    backgroundImage: "url(./img/background.jpg)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPositionX: "center",
    backgroundPositionY: "center",
    backgroundColor: "#000",
  };
  
  const bgImage = {
    backgroundImage: "url(./img/collections/collection_bg.jpg)",
    backgroundSize: "cover",
    backgroundPosition: "center", 
  }
  var bgImgarrow = {
    backgroundImage: "url(./img/ep_arrow-right-bold.png)",
    backgroundRepeat: "no-repeat",
  };

function CollectionWithCollection() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, []);

  const gridtwo =()=>{
    setgrid("col-md-6 mb-4");
    document.getElementById("gridtwo").classList.add("active");
    document.getElementById("gridthree").classList.remove("active");
  }
  const gridthree =()=>{
    setgrid("col-md-4 mb-4");
    document.getElementById("gridthree").classList.add("active");
    document.getElementById("gridtwo").classList.remove("active");
  }

  const [grid, setgrid] = useState("col-md-3 mb-4");




  return (
    <div style={bgImgStyle}>
      <section className="collection_banner pdd_8" style={bgImage}>
        
      </section>
      <section className="collection_info" >
        <div className="container">
          <div className="collection_pick">
            <img alt='' src={'../img/collections/barrett.png'} class="img-fluid collection_profile" />
            <img alt='' src={'../img/collections/check.png'} class="img-fluid check_img" />
          </div>
          <h1 className="collection_title text-center">Barrett Firarms</h1>
          <ul class="collection_social mb-4">
            <li><a href="/"><i class="fa fa-facebook fa-lg"></i></a></li>
            <li><a href="/"><i class="fa fa-twitter fa-lg"></i></a></li>
            <li><a href="/"><i class="fa fa-linkedin fa-lg"></i></a></li>
            <li><a href="/"><i class="fa fa-pinterest fa-lg"></i></a></li>
          </ul>
          <div className="coppycode text-center">
            <span><img alt='' src={'../img/favicon.png'} class="img-fluid" /> 0xa1ahjkfga...19cda 
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 4.5V0H12.75C11.5073 0 10.5 1.00734 10.5 2.25V15.75C10.5 16.9927 11.5073 18 12.75 18H21.75C22.9927 18 24 16.9927 24 15.75V6H19.5422C18.675 6 18 5.325 18 4.5ZM19.5 0V4.5H24L19.5 0ZM9 16.5V6H2.25C1.00734 6 0 7.00734 0 8.25V21.75C0 22.9927 1.00734 24 2.25 24H11.25C12.4927 24 13.5 22.9927 13.5 21.75V19.5H12C10.3453 19.5 9 18.1547 9 16.5Z" fill="white"/>
              </svg>
            </span>
          </div>
          <ul className="collection_status mt-5 mb-5">
            <li>
              <h4>10.0k</h4>
              <p>items</p>
            </li>
            <li>
              <h4>1.2k</h4>
              <p>owners</p>
            </li>
            <li>
              <h4>498</h4>
              <p>floor price</p>
            </li>
            <li>
              <h4>1.3M</h4>
              <p>volume traded</p>
            </li>
          </ul>
          <div className="collection_description text-center">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Massa fringilla eget quam fringilla pharetra scelerisque arcu aliquam lacus. Non, tortor et lobortis facilisi nam. Adipiscing non feugiat ultrices natoque a. Imperdiet eget tellus tempor ultricies ipsum vitae. Felis elit nisi nunc sagittis morbi arcu, sed. Diam diam ligula aliquet sollicitudin diam et pellentesque. Tempor turpis nunc turpis ornare facilisis porttitor morbi tellus nullam.</p>
            <span className="top_arrow"><img alt='' src={'../img/top_arrow.png'} class="img-fluid" /></span>
          </div>

        <div className="row">
            <div className="col-md-12">
                <h4 className="second_hd text-center mb-3">Collection</h4>
            </div>
        </div>
            <Relatedcollection />
        
          <div className="row mb-5">
            <div className="col-md-12 text-center item_active">
              <NavLink activeclassname="active-link" to={'/collection'} className="mr-3 active">
              <span className='mr-3'><ItemSVG /></span> Items</NavLink>
              <NavLink to={'/collectionActivity'} >
              <span className='mr-3'><ActivitySVG /></span> Activity</NavLink>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12  mb-5">
              <div className="market_search_form">
                <form class="d-flex marketplace_form">
                  <input class=" me-2" type="search" placeholder="Search item here..." aria-label="Search" />
                  <button class="market_btn" type="submit"><img src="../img/search.svg" alt="" /></button>
                </form>
                <select class="market_select_form form-select" aria-label="Default select example" style={bgImgarrow}>
                  <option selected>Single Items</option>
                  <option value="1">Single Items 1</option>
                  <option value="2">Single Items 2</option>
                  <option value="3">Single Items 3</option>
                </select>
                <select class="market_select_form form-select" aria-label="Default select example" style={bgImgarrow}>
                  <option selected>Price: Low to High</option>
                  <option value="1">$2000</option>
                  <option value="2">$4000</option>
                  <option value="3">$6000</option>
                </select>
                {/* <div className="market_div"> */}
                  <div id="gridtwo" className="market_grid" onClick={gridtwo}>
                    <Twogrid />
                  </div>
                  <div id="gridthree" className="market_grid" onClick={gridthree}>
                    <Threegrid />
                  </div>
                {/* </div> */}
                <button type="button" className="filter_btn">Adv.Filter</button>
              </div>
              <div className="search_qt mt-3">10,000 items</div>
              
            </div>
          </div>
        </div>
      </section>
      <section className="collection_list mb-5 pb-5">
        <div className="container">
          <div className='row'>
            {CollectionCard.map(card =>(
              <div className={grid} key={card.id}>
                <CollectionList image={card.img} submenu={card.Subheading} heading={card.Heading} price={card.price} date={card.Date}
                button={card.Slug} link={card.Like} />
              </div>
            ))};
            <div class="col-md-12 text-center mt-5"><a class="view_all_bdr" href="/">Load More</a></div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default CollectionWithCollection
