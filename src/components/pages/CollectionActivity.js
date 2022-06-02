import React from 'react';
import Footer from '../components/footer';
import { NavLink } from 'react-router-dom';
import ItemSVG from "../SVG/ItemSVG"
import ActivitySVG from "../SVG/ActivitySVG"


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

function CollectionActivity() {
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

          <div className="row mb-5">
            <div className="col-md-12 text-center item_active">
              <NavLink to={'/collection'} className="mr-3"><span className='mr-3'><ItemSVG /></span> Items</NavLink>
              <NavLink to={'/collectionActivity'} activeclassname="active-link"><span className='mr-3'><ActivitySVG /></span> Activity</NavLink>
            </div>
          </div>

          <div className="row">
              <div className="col-md-6 d-md-inline-flex">
                <select class="action_select_form form-select mr-3" aria-label="Default select example" style={bgImgarrow}>
                  <option selected>Listings</option>
                  <option value="1">Listings Items 1</option>
                  <option value="2">Listings Items 2</option>
                  <option value="3">Listings Items 3</option> 
                </select>
                <select class="action_select_form form-select" aria-label="Default select example" style={bgImgarrow}>
                  <option selected>Hunter Token</option>
                  <option value="1">Hunter Token 1</option>
                  <option value="2">Hunter Token 2</option>
                  <option value="3">Hunter Token 3</option>
                </select>
              </div>
              <div className="col-md-6 d-flex justify-content-end">
                <select class="action_select_form form-select" aria-label="Default select example" style={bgImgarrow}>
                  <option selected>Last 90 Days</option>
                  <option value="1">Last 40 Days</option>
                  <option value="2">Last 30 Days</option>
                  <option value="3">Last 10 Days</option> 
                </select>
              </div>
          </div>

        </div>
      </section>
      <section className="collectionAction mb-5 pb-5 mt-5">
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <img alt='' src={'../img/collections/graph.png'} class="img-fluid" />
                </div> 
            </div>
            <div className="row mt-5">
              <div className='col-md-12'>
                <div class="table-responsive">
                  <table className=" Action_table text-center">
                  <tr className="">
                      <th><div className="tb_title">List</div></th>
                      <th><div className="tb_title">Item</div></th>
                      <th><div className="tb_title">Price</div></th>
                      <th><div className="tb_title">Quantity</div></th>
                      <th><div className="tb_title">From</div></th>
                      <th><div className="tb_title">To</div></th>
                      <th><div className="tb_title">Time</div></th>
                  </tr>
                  <tr>
                      <td><img alt='' src={'../img/collections/bxs_purchase-tag.png'} class="img-fluid" /> List</td>
                      <td><img alt='' src={'../img/collections/item1.png'} class="img-fluid" /> Firearms #5234</td>
                      <td>
                          <p className="table_p"><img alt='' src={'../img/collections/hhh.png'} class="img-fluid" /> 99.95</p>
                          <span className='special_text'>$591,623.15</span>
                      </td>
                      <td>1</td>
                      <td>UserName</td>
                      <td>UserName</td>
                      <td>an hour ago</td>
                  </tr>
                  <tr>
                      <td><img alt='' src={'../img/collections/bxs_purchase-tag.png'} class="img-fluid" /> List</td>
                      <td><img alt='' src={'../img/collections/item1.png'} class="img-fluid" /> Firearms #5234</td>
                      <td>
                          <p className="table_p"><img alt='' src={'../img/collections/hhh.png'} class="img-fluid" /> 99.95</p>
                          <span className='special_text'>$591,623.15</span>
                      </td>
                      <td>1</td>
                      <td>UserName</td>
                      <td>UserName</td>
                      <td>an hour ago</td>
                  </tr>
                  <tr>
                      <td><img alt='' src={'../img/collections/bxs_purchase-tag.png'} class="img-fluid" /> List</td>
                      <td><img alt='' src={'../img/collections/item1.png'} class="img-fluid" /> Firearms #5234</td>
                      <td>
                          <p className="table_p"><img alt='' src={'../img/collections/hhh.png'} class="img-fluid" /> 99.95</p>
                          <span className='special_text'>$591,623.15</span>
                      </td>
                      <td>1</td>
                      <td>UserName</td>
                      <td>UserName</td>
                      <td>an hour ago</td>
                  </tr>
                  <tr>
                      <td><img alt='' src={'../img/collections/bxs_purchase-tag.png'} class="img-fluid" /> List</td>
                      <td><img alt='' src={'../img/collections/item1.png'} class="img-fluid" /> Firearms #5234</td>
                      <td>
                          <p className="table_p"><img alt='' src={'../img/collections/hhh.png'} class="img-fluid" /> 99.95</p>
                          <span className='special_text'>$591,623.15</span>
                      </td>
                      <td>1</td>
                      <td>UserName</td>
                      <td>UserName</td>
                      <td>an hour ago</td>
                  </tr>
                  <tr>
                      <td><img alt='' src={'../img/collections/bxs_purchase-tag.png'} class="img-fluid" /> List</td>
                      <td><img alt='' src={'../img/collections/item1.png'} class="img-fluid" /> Firearms #5234</td>
                      <td>
                          <p className="table_p"><img alt='' src={'../img/collections/hhh.png'} class="img-fluid" /> 99.95</p>
                          <span className='special_text'>$591,623.15</span>
                      </td>
                      <td>1</td>
                      <td>UserName</td>
                      <td>UserName</td>
                      <td>an hour ago</td>
                  </tr>
                  <tr>
                      <td><img alt='' src={'../img/collections/bxs_purchase-tag.png'} class="img-fluid" /> List</td>
                      <td><img alt='' src={'../img/collections/item1.png'} class="img-fluid" /> Firearms #5234</td>
                      <td>
                          <p className="table_p"><img alt='' src={'../img/collections/hhh.png'} class="img-fluid" /> 99.95</p>
                          <span className='special_text'>$591,623.15</span>
                      </td>
                      <td>1</td>
                      <td>UserName</td>
                      <td>UserName</td>
                      <td>an hour ago</td>
                  </tr>
                  <tr>
                      <td><img alt='' src={'../img/collections/bxs_purchase-tag.png'} class="img-fluid" /> List</td>
                      <td><img alt='' src={'../img/collections/item1.png'} class="img-fluid" /> Firearms #5234</td>
                      <td>
                          <p className="table_p"><img alt='' src={'../img/collections/hhh.png'} class="img-fluid" /> 99.95</p>
                          <span className='special_text'>$591,623.15</span>
                      </td>
                      <td>1</td>
                      <td>UserName</td>
                      <td>UserName</td>
                      <td>an hour ago</td>
                  </tr>
                  <tr>
                      <td><img alt='' src={'../img/collections/bxs_purchase-tag.png'} class="img-fluid" /> List</td>
                      <td><img alt='' src={'../img/collections/item1.png'} class="img-fluid" /> Firearms #5234</td>
                      <td>
                          <p className="table_p"><img alt='' src={'../img/collections/hhh.png'} class="img-fluid" /> 99.95</p>
                          <span className='special_text'>$591,623.15</span>
                      </td>
                      <td>1</td>
                      <td>UserName</td>
                      <td>UserName</td>
                      <td>an hour ago</td>
                  </tr>
                  <tr>
                      <td><img alt='' src={'../img/collections/bxs_purchase-tag.png'} class="img-fluid" /> List</td>
                      <td><img alt='' src={'../img/collections/item1.png'} class="img-fluid" /> Firearms #5234</td>
                      <td>
                          <p className="table_p"><img alt='' src={'../img/collections/hhh.png'} class="img-fluid" /> 99.95</p>
                          <span className='special_text'>$591,623.15</span>
                      </td>
                      <td>1</td>
                      <td>UserName</td>
                      <td>UserName</td>
                      <td>an hour ago</td>
                  </tr>
                  <tr>
                      <td><img alt='' src={'../img/collections/bxs_purchase-tag.png'} class="img-fluid" /> List</td>
                      <td><img alt='' src={'../img/collections/item1.png'} class="img-fluid" /> Firearms #5234</td>
                      <td>
                          <p className="table_p"><img alt='' src={'../img/collections/hhh.png'} class="img-fluid" /> 99.95</p>
                          <span className='special_text'>$591,623.15</span>
                      </td>
                      <td>1</td>
                      <td>UserName</td>
                      <td>UserName</td>
                      <td>an hour ago</td>
                  </tr>
                  <tr>
                      <td><img alt='' src={'../img/collections/bxs_purchase-tag.png'} class="img-fluid" /> List</td>
                      <td><img alt='' src={'../img/collections/item1.png'} class="img-fluid" /> Firearms #5234</td>
                      <td>
                          <p className="table_p"><img alt='' src={'../img/collections/hhh.png'} class="img-fluid" /> 99.95</p>
                          <span className='special_text'>$591,623.15</span>
                      </td>
                      <td>1</td>
                      <td>UserName</td>
                      <td>UserName</td>
                      <td>an hour ago</td>
                  </tr>
                  <tr>
                      <td><img alt='' src={'../img/collections/bxs_purchase-tag.png'} class="img-fluid" /> List</td>
                      <td><img alt='' src={'../img/collections/item1.png'} class="img-fluid" /> Firearms #5234</td>
                      <td>
                          <p className="table_p"><img alt='' src={'../img/collections/hhh.png'} class="img-fluid" /> 99.95</p>
                          <span className='special_text'>$591,623.15</span>
                      </td>
                      <td>1</td>
                      <td>UserName</td>
                      <td>UserName</td>
                      <td>an hour ago</td>
                  </tr>
                  </table>
                </div>
              </div>
            </div>
            <div className="row mt-5">
                <div class="col-md-12 text-center "><a class="view_all_bdr" href="/">Load More</a></div>
            </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default CollectionActivity
