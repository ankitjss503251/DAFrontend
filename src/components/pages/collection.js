import React, { useState, useEffect, Component } from "react";
import Footer from "../components/footer";
import CollectionList from "../components/CollectionList";
import ItemSVG from "../SVG/ItemSVG";
import ActivitySVG from "../SVG/ActivitySVG";
import { Link, NavLink } from "react-router-dom";
import { CollectionCard } from "../../Data/dummyJSON";
import Dropdown from "../SVG/dropdown";
import { useCookies } from "react-cookie";
import { NotificationManager } from "react-notifications";
import Threegrid from '../SVG/Threegrid';
import Twogrid from '../SVG/Twogrid';
import AllNFTs from "../SVG/AllNFTs";
import Firearmsvg from "../SVG/Firearmsvg";
import Soldierssvg from "../SVG/Soldierssvg";

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
};
var bgImgarrow = {
  backgroundImage: "url(./img/ep_arrow-right-bold.png)",
  backgroundRepeat: "no-repeat",
};

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
]

function Collection() {

  const gridtwo =()=>{
    setgrid("col-xl-6 col-lg-6 col-md-6 col-sm-12 mb-4");
    document.getElementById("gridtwo").classList.add("active");
    document.getElementById("gridthree").classList.remove("active");
  }
  const gridthree =()=>{
    setgrid("col-xl-4 col-lg-4 col-md-6 col-sm-12 mb-4");
    document.getElementById("gridthree").classList.add("active");
    document.getElementById("gridtwo").classList.remove("active");
  }
  useEffect(() => {
    window.scrollTo(0, 0)
  }, []);

  const [grid, setgrid] = useState("col-xl-3 col-lg-4 col-md-6 col-sm-12 mb-4");

  const [currentUser, setCurrentUser] = useState("");
  const [cookies, setCookie, removeCookie] = useCookies([]);

  useEffect(() => {
    if (cookies.selected_account) setCurrentUser(cookies.selected_account);
    else NotificationManager.error("Connect Yout Wallet", "", 800);
    console.log("current user is---->", currentUser, cookies.selected_account);
  }, [currentUser]);


   
  const [togglemode, setTogglemode] = useState('filterhide');
  const filterToggle = ()=> { 
    if(togglemode === 'filterhide'){ 
      setTogglemode('filtershow');
      document.getElementsByClassName("filter_btn")[0].classList.add("active");
    }else{
      setTogglemode('filterhide');
      document.getElementsByClassName("filter_btn")[0].classList.remove("active");
    } 
  }; 


  return (
    <div style={bgImgStyle}>
      <section className='collection_banner pdd_8' style={bgImage}></section>
      <section className='collection_info'>
        <div className='container'>
          <div className='collection_pick'>
            <img
              alt=''
              src={"../img/collections/barrett.png"}
              class='img-fluid collection_profile'
            />
            <img
              alt=''
              src={"../img/collections/check.png"}
              class='img-fluid check_img'
            />
          </div>
          <h1 className="collection_title text-center">Barrett Firarms</h1>
          <ul class="collection_social mb-4">
            <li><Link to={"/"}><i class="fa fa-facebook fa-lg"></i></Link></li>
            <li><Link to={"/"}><i class="fa fa-twitter fa-lg"></i></Link></li>
            <li><Link to={"/"}><i class="fa fa-linkedin fa-lg"></i></Link></li>
            <li><Link to={"/"}><i class="fa fa-pinterest fa-lg"></i></Link></li>
          </ul>
          <div className='coppycode text-center'>
            <span>
              <img alt='' src={"../img/favicon.png"} class='img-fluid' />{" "}
              0xa1ahjkfga...19cda
              <svg
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'>
                <path
                  d='M18 4.5V0H12.75C11.5073 0 10.5 1.00734 10.5 2.25V15.75C10.5 16.9927 11.5073 18 12.75 18H21.75C22.9927 18 24 16.9927 24 15.75V6H19.5422C18.675 6 18 5.325 18 4.5ZM19.5 0V4.5H24L19.5 0ZM9 16.5V6H2.25C1.00734 6 0 7.00734 0 8.25V21.75C0 22.9927 1.00734 24 2.25 24H11.25C12.4927 24 13.5 22.9927 13.5 21.75V19.5H12C10.3453 19.5 9 18.1547 9 16.5Z'
                  fill='white'
                />
              </svg>
            </span>
          </div>
          <ul className='collection_status mt-5 mb-5'>
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
          <div className='collection_description text-center'>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Massa
              fringilla eget quam fringilla pharetra scelerisque arcu aliquam
              lacus. Non, tortor et lobortis facilisi nam. Adipiscing non
              feugiat ultrices natoque a. Imperdiet eget tellus tempor ultricies
              ipsum vitae. Felis elit nisi nunc sagittis morbi arcu, sed. Diam
              diam ligula aliquet sollicitudin diam et pellentesque. Tempor
              turpis nunc turpis ornare facilisis porttitor morbi tellus nullam.
            </p>
            <span className='top_arrow'>
              <img alt='' src={"../img/top_arrow.png"} class='img-fluid' />
            </span>
          </div>

          <div className='row mb-5'>
            <div className='col-md-12 text-center item_active'>
              <NavLink
                to={"/collection"}
                activeclassname='active-link'
                className='mr-3'>
                <span className='mr-3'>
                  <ItemSVG />
                </span>{" "}
                Items
              </NavLink>
              <NavLink to={"/collectionActivity"}>
                <span className='mr-3'>
                  <ActivitySVG />
                </span>{" "}
                Activity
              </NavLink>
            </div>
          </div>

          <div className='row'>
            <div className='col-lg-12'>
              <div className='market_search_form mb-4'>
                <form class='d-flex marketplace_form'>
                  <input
                    class=' me-2'
                    type='search'
                    placeholder='Search item here...'
                    aria-label='Search'
                  />
                  <button class='market_btn' type='submit'>
                    <img src='../img/search.svg' alt='' />
                  </button>
                </form>
                <select
                  class='market_select_form form-select'
                  aria-label='Default select example'
                  style={bgImgarrow}>
                  <option selected>Single Items</option>
                  <option value='1'>Single Items 1</option>
                  <option value='2'>Single Items 2</option>
                  <option value='3'>Single Items 3</option>
                </select>
                <select
                  class='market_select_form form-select'
                  aria-label='Default select example'
                  style={bgImgarrow}>
                  <option selected>Price: Low to High</option>
                  <option value='1'>$2000</option>
                  <option value='2'>$4000</option>
                  <option value='3'>$6000</option>
                </select>
                {/* <div className="market_div"> */}

                  <div id="gridtwo" className="market_grid" onClick={gridtwo}>
                    <Twogrid />
                  </div>
                  <div id="gridthree" className="market_grid" onClick={gridthree}>
                    <Threegrid />
                  </div>
                {/* </div> */}
                <button type="button" className="filter_btn" onClick={filterToggle}>Adv.Filter</button>
              </div>
             
              </div>
              <div className={`filter mb-5 ${togglemode}`}>
                <div className='filtercol'>
                  <form>
                  <button type="button" class="drop_down_tlt" data-bs-toggle="collapse" data-bs-target="#demo">
                    Status <Dropdown />
                  </button>
                  <div id="demo" class="collapse show">
                    <ul className="status_ul">
                      <li>
                        <Link to={"/"} className='filter_border'>
                          Buy Now
                        </Link>
                        <Link to={"/"} className='filter_border'>
                          On Auction
                        </Link>
                      </li>
                      <li>
                        <Link to={"/"} className='filter_border'>
                          Now
                        </Link>
                        <Link to={"/"} className='filter_border'>
                          Offers
                        </Link>
                      </li>
                    </ul>
                  </div>
                  
                  <button type="button" class="drop_down_tlt" data-bs-toggle="collapse" data-bs-target="#demo2">
                    Price <Dropdown />
                  </button>
                  <div id="demo2" class="collapse show">
                    <ul className="status_ul">
                      <li>
                        <select
                          class='form-select filter_apply filter-text-left'
                          aria-label='Default select example'>
                          <option selected>$ Australian Dollar (AUD)</option>
                          <option value='1'>One</option>
                          <option value='2'>Two</option>
                          <option value='3'>Three</option>
                        </select>
                      </li>
                      <li>
                        <div class='range_input'>
                          <input
                            type='text'
                            class='form-control'
                            id='exampleInputPassword1'
                            value='min'
                          />
                          <span className="span_class">to</span>
                          <input
                            type='text'
                            class='form-control'
                            id='exampleInputPassword1'
                            value='max'
                          />
                        </div>
                      </li>
                      <li>
                        <button type='submit' class='filter_apply'>
                          Apply
                        </button>
                      </li>
                    </ul>
                  </div>
                  </form>
                </div>
                <div className='filtercol'>
                  <form>
                    <button type="button" class="drop_down_tlt" data-bs-toggle="collapse" data-bs-target="#demo3">
                      Collections <Dropdown />
                    </button>
                    <div id="demo3" class="collapse show">
                      <input type='text' value='Filter' className="filter_apply filter-text-left filter_padd" />
                    </div>
                  </form>
                </div>
                <div className='filtercol'>
                  <button type="button" class="drop_down_tlt mb-4" data-bs-toggle="collapse" data-bs-target="#demo4">
                    Categories <Dropdown />
                  </button>
                  <div id="demo4" class="collapse show">
                    <ul>
                      <li>
                        <Link to={"/marketplace"} className='sub-items'>
                          <AllNFTs />
                          All NFTs
                        </Link>
                      </li>
                      <li>
                        <Link to={"/marketplaceCollection"} className='sub-items'>
                          <Firearmsvg />
                          Firearms
                        </Link>
                      </li>
                      <li>
                        <Link to={"/Soldiers"} className="sub-items">
                          <Soldierssvg />
                          Soldiers
                        </Link>
                      </li>
                      <li>
                        <Link to={"/Accesories"} className="sub-items">
                          <Soldierssvg />
                          Accesories
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className='filtercol'>
                  <button type="button" class="drop_down_tlt mb-4" data-bs-toggle="collapse" data-bs-target="#demo5">
                    On Sale In <Dropdown />
                  </button>
                  <div id="demo5" class="collapse show">
                    <ul>
                      <li>
                        <input type='text' value='Filter' className="filter_apply filter-text-left filter_padd" />
                      </li>
                      <li>
                      <form action="#" className="checked_form">
                        <div class="form-check form-check-inline">
                          <input type="radio" id="test1" name="radio-group" />
                          <label for="test1">Apple</label>
                        </div>
                        <div class="form-check form-check-inline">
                          <input type="radio" id="test2" name="radio-group" />
                          <label for="test2">Apple</label>
                        </div>
                      </form>
                      </li>
                    </ul>
                  </div>
                </div>
              </div> 
            </div>
          </div>
        
        
      </section>
      <section className='collection_list mb-5 pb-5'>
        <div className='container'>
          <div className='row'>
            {CollectionCard.map((card) => (
              <div className={grid} key={card.id}>
                <CollectionList
                  image={card.img}
                  submenu={card.Subheading}
                  heading={card.Heading}
                  price={card.price}
                  date={card.Date}
                  button={card.Slug}
                  link={card.Like}
                />
              </div>
            ))}
            ;
            <div class='col-md-12 text-center mt-5'>
              <Link class='view_all_bdr' to={"/"}>
                Load More
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Collection;
