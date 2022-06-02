import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/footer';

var blog_bg = {
    backgroundImage: "url(./img/singleblog.jpg)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPositionX: "center",
    backgroundPositionY: "center"
}
var bgImgStyle = {
    backgroundImage: "url(./img/background.jpg)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPositionX: "center",
    backgroundPositionY: "center",
    backgroundColor: "#000",
};
function Blogdetails() {
  return (
    <div style={bgImgStyle}>
        <section className='register_hd pdd_12' style={blog_bg}>
            <div className='container'>
                <div className='row'>
                    <div className='col-md-12'>
                        <h1>Blog title here</h1>
                    </div>
                </div>
            </div>
        </section>
        <section className='pdd_8'>
            <div className='container'>
                <div className='row'>
                    <div className="col-md-7">
                        <div className="single-blog-detail">
                            <img src={'../img/Blog/single.png'} alt="" className="mb-4 img-fluid" />
                            <p className="mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Neque vestibulum, cursus morbi massa fermentum, a. Tellus cursus tortor amet morbi et eu. Non nullam tortor, vehicula lectus tortor malesuada nibh morbi. Quisque at vestibulum suscipit tincidunt mattis odio volutpat. Scelerisque elit eu nec diam quam. Gravida posuere sed tempus nisl habitant ultrices. Augue id mattis ipsum elit mi. Sollicitudin sit nisl tellus sed senectus sapien nec, purus, ultricies. Nibh diam nisi, eleifend velit quis risus tellus id tristique. Diam, ante mauris posuere pellentesque sit potenti scelerisque augue. Id pharetra sem et pharetra dignissim id amet. Semper aenean congue eros nec viverra faucibus varius nec. Nulla consectetur maecenas senectus interdum duis congue nisl, placerat. Lorem sed massa volutpat, posuere ornare vel mattis egestas. Viverra tristique vitae nibh vulputate cursus habitasse odio in. Magna lorem scelerisque semper convallis non. Lacinia ornare vestibulum ultrices urna ut et, vel felis eget. Vel, turpis sollicitudin pellentesque faucibus aenean mattis. In purus nunc turpis odio cursus orci, et tellus.</p>
                            <p className="mb-4">Sollicitudin sit nisl tellus sed senectus sapien nec, purus, ultricies. Nibh diam nisi, eleifend velit quis risus tellus id tristique. Diam, ante mauris posuere pellentesque sit potenti scelerisque augue. Id pharetra sem et pharetra dignissim id amet. Semper aenean congue eros nec viverra faucibus varius nec. Nulla consectetur maecenas senectus interdum duis congue nisl, placerat. Lorem sed massa volutpat, posuere ornare vel mattis egestas. Viverra tristique vitae nibh vulputate cursus habitasse odio in. Magna lorem scelerisque semper convallis non. Lacinia ornare vestibulum ultrices urna ut et, vel felis eget. Vel, turpis sollicitudin pellentesque faucibus aenean mattis. In purus nunc turpis odio cursus orci, et tellus.</p>
                            <ul>
                                <li>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22 2.2505H18.75V0.7505C18.7501 0.551588 18.6712 0.36077 18.5307 0.220024C18.3901 0.0792776 18.1994 0.000132786 18.0005 1.78083e-07C17.8016 -0.00013243 17.6108 0.078758 17.47 0.219317C17.3293 0.359875 17.2501 0.550588 17.25 0.7495V2.2505H12.75V0.7505C12.7501 0.652009 12.7307 0.554469 12.6931 0.46345C12.6555 0.37243 12.6003 0.289714 12.5307 0.220024C12.4611 0.150333 12.3784 0.0950335 12.2875 0.0572819C12.1965 0.0195302 12.099 6.58278e-05 12.0005 1.66907e-07C11.8016 -0.000132441 11.6108 0.078758 11.47 0.219317C11.3293 0.359875 11.2501 0.550588 11.25 0.7495V2.2505H6.75V0.7505C6.75007 0.652009 6.73073 0.554469 6.6931 0.46345C6.65547 0.37243 6.60028 0.289714 6.53068 0.220024C6.46109 0.150333 6.37844 0.0950335 6.28747 0.0572819C6.19651 0.0195302 6.09899 6.58278e-05 6.0005 1.66907e-07C5.80159 -0.000132441 5.61077 0.078758 5.47002 0.219317C5.32928 0.359875 5.25013 0.550588 5.25 0.7495V2.2505H2C1.46974 2.2505 0.961184 2.46108 0.58614 2.83593C0.211096 3.21079 0.00026513 3.71924 0 4.2495V21.9995C0 22.5299 0.210714 23.0386 0.585786 23.4137C0.960859 23.7888 1.46957 23.9995 2 23.9995H22C22.5304 23.9995 23.0391 23.7888 23.4142 23.4137C23.7893 23.0386 24 22.5299 24 21.9995V4.2495C23.9997 3.71924 23.7889 3.21079 23.4139 2.83593C23.0388 2.46108 22.5303 2.2505 22 2.2505ZM22.5 22.0005C22.5 22.1329 22.4475 22.26 22.3539 22.3537C22.2604 22.4474 22.1334 22.5002 22.001 22.5005H2C1.86739 22.5005 1.74021 22.4478 1.64645 22.3541C1.55268 22.2603 1.5 22.1331 1.5 22.0005V4.2505C1.50026 4.11807 1.55306 3.99115 1.6468 3.89759C1.74054 3.80404 1.86756 3.7515 2 3.7515H5.25V5.2515C5.24987 5.45041 5.32876 5.64123 5.46932 5.78198C5.60988 5.92272 5.80059 6.00187 5.9995 6.002C6.19841 6.00213 6.38923 5.92324 6.52998 5.78268C6.67072 5.64213 6.74987 5.45141 6.75 5.2525V3.7515H11.25V5.2515C11.2499 5.45041 11.3288 5.64123 11.4693 5.78198C11.6099 5.92272 11.8006 6.00187 11.9995 6.002C12.1984 6.00213 12.3892 5.92324 12.53 5.78268C12.6707 5.64213 12.7499 5.45141 12.75 5.2525V3.7515H17.25V5.2515C17.2499 5.45041 17.3288 5.64123 17.4693 5.78198C17.6099 5.92272 17.8006 6.00187 17.9995 6.002C18.1984 6.00213 18.3892 5.92324 18.53 5.78268C18.6707 5.64213 18.7499 5.45141 18.75 5.2525V3.7515H22C22.1323 3.75176 22.259 3.80442 22.3526 3.89795C22.4461 3.99147 22.4987 4.11824 22.499 4.2505L22.5 22.0005Z" fill="#EF981D"/>
                                        <path d="M5.25 9.00049H8.25V11.2505H5.25V9.00049ZM5.25 12.7505H8.25V15.0005H5.25V12.7505ZM5.25 16.5005H8.25V18.7505H5.25V16.5005ZM10.5 16.5005H13.5V18.7505H10.5V16.5005ZM10.5 12.7505H13.5V15.0005H10.5V12.7505ZM10.5 9.00049H13.5V11.2505H10.5V9.00049ZM15.75 16.5005H18.75V18.7505H15.75V16.5005ZM15.75 12.7505H18.75V15.0005H15.75V12.7505ZM15.75 9.00049H18.75V11.2505H15.75V9.00049Z" fill="#EF981D"/>
                                    </svg> April 1, 2022
                                </li>
                                <li>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14 19C17.771 19 19.657 19 20.828 17.828C22 16.657 22 14.771 22 11C22 7.229 22 5.343 20.828 4.172C19.657 3 17.771 3 14 3H10C6.229 3 4.343 3 3.172 4.172C2 5.343 2 7.229 2 11C2 14.771 2 16.657 3.172 17.828C3.825 18.482 4.7 18.771 6 18.898" stroke="#EF981D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M14.0002 19C12.7642 19 11.4022 19.5 10.1592 20.145C8.16124 21.182 7.16224 21.701 6.67024 21.37C6.17824 21.04 6.27124 20.015 6.45824 17.966L6.50024 17.5" stroke="#EF981D" stroke-width="2" stroke-linecap="round"/>
                                    </svg> 1341
                                </li>
                                <li>
                                    <svg width="27" height="24" viewBox="0 0 27 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M26.142 4.91832C25.7264 3.95586 25.127 3.08369 24.3775 2.35064C23.6275 1.61539 22.7432 1.0311 21.7726 0.62954C20.7663 0.211494 19.6869 -0.0024864 18.5971 2.1797e-05C17.0683 2.1797e-05 15.5767 0.418667 14.2804 1.20944C13.9703 1.39861 13.6757 1.60638 13.3966 1.83276C13.1175 1.60638 12.8229 1.39861 12.5128 1.20944C11.2166 0.418667 9.72496 2.1797e-05 8.19614 2.1797e-05C7.09525 2.1797e-05 6.02849 0.210895 5.02064 0.62954C4.0469 1.03268 3.1693 1.61258 2.41574 2.35064C1.66527 3.08287 1.06577 3.95524 0.651225 4.91832C0.220176 5.91997 0 6.98364 0 8.07832C0 9.11097 0.210873 10.187 0.629518 11.2817C0.979939 12.1965 1.48231 13.1455 2.12423 14.1037C3.14139 15.6201 4.53997 17.2017 6.27657 18.8049C9.15437 21.4625 12.0043 23.2984 12.1252 23.3728L12.8601 23.8442C13.1858 24.0519 13.6044 24.0519 13.93 23.8442L14.665 23.3728C14.7859 23.2953 17.6327 21.4625 20.5136 18.8049C22.2502 17.2017 23.6488 15.6201 24.6659 14.1037C25.3079 13.1455 25.8133 12.1965 26.1607 11.2817C26.5793 10.187 26.7902 9.11097 26.7902 8.07832C26.7933 6.98364 26.5731 5.91997 26.142 4.91832ZM13.3966 21.3912C13.3966 21.3912 2.35682 14.3177 2.35682 8.07832C2.35682 4.91832 4.97102 2.35684 8.19614 2.35684C10.463 2.35684 12.4291 3.62207 13.3966 5.47031C14.3642 3.62207 16.3302 2.35684 18.5971 2.35684C21.8223 2.35684 24.4365 4.91832 24.4365 8.07832C24.4365 14.3177 13.3966 21.3912 13.3966 21.3912Z" fill="#EF981D"/>
                                    </svg> 4312
                                </li>
                            </ul>
                        </div>
                        <div className="blog_comment mt-5">
                            <h5>Comments (1341)</h5>
                            <div className="row mb-5">
                                <div className="col-md-2">
                                    <img src={'../img/Blog/comment_user.png'} alt="" className="img-fluid" />
                                </div>
                                <div className="col-md-10">
                                    <h6>User Name</h6>
                                    <div className="date_task">15 January 2022  | <button type='button' className='link_btn'>reply</button></div>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Elit cras tellus erat amet dolor nunc ultricies. Phasellus tellus vestibulum eget commodo eu. Ultricies mi commodo nunc facilisi quam lectus nulla amet. Nisl, elementum molestie ipsum adipiscing egestas quam etiam. Vitae tincidunt sapien eros, luctus est sed eleifend enim. Quis placerat sagittis posuere tincidunt. Sit nibh sed morbi dis viverra sed. A egestas nibh gravida pulvinar pretium eget. Mi proin eget convallis habitant amet nunc. Ultricies elementum blandit egestas vitae nullam non. Malesuada sed pretium etiam placerat feugiat malesuada ut et aenean.</p>
                                </div>
                            </div>
                            <div className="row mb-5">
                                <div className="col-md-2">
                                    <img src={'../img/Blog/comment_user.png'} alt="" className="img-fluid" />
                                </div>
                                <div className="col-md-10">
                                    <h6>User Name</h6>
                                    <div className="date_task">15 January 2022  | <button type='button' className='link_btn'>reply</button></div>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Elit cras tellus erat amet dolor nunc ultricies. Phasellus tellus vestibulum eget commodo eu. Ultricies mi commodo nunc facilisi quam lectus nulla amet. Nisl, elementum molestie ipsum adipiscing egestas quam etiam. Vitae tincidunt sapien eros, luctus est sed eleifend enim. Quis placerat sagittis posuere tincidunt. Sit nibh sed morbi dis viverra sed. A egestas nibh gravida pulvinar pretium eget. Mi proin eget convallis habitant amet nunc. Ultricies elementum blandit egestas vitae nullam non. Malesuada sed pretium etiam placerat feugiat malesuada ut et aenean.</p>
                                </div>
                            </div>
                            <div className="row mb-5">
                                <div className="col-md-2">
                                    <img src={'../img/Blog/comment_user.png'} alt="" className="img-fluid" />
                                </div>
                                <div className="col-md-10">
                                    <h6>User Name</h6>
                                    <div className="date_task">15 January 2022 | <button type='button' className='link_btn'>reply</button></div>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Elit cras tellus erat amet dolor nunc ultricies. Phasellus tellus vestibulum eget commodo eu. Ultricies mi commodo nunc facilisi quam lectus nulla amet. Nisl, elementum molestie ipsum adipiscing egestas quam etiam. Vitae tincidunt sapien eros, luctus est sed eleifend enim. Quis placerat sagittis posuere tincidunt. Sit nibh sed morbi dis viverra sed. A egestas nibh gravida pulvinar pretium eget. Mi proin eget convallis habitant amet nunc. Ultricies elementum blandit egestas vitae nullam non. Malesuada sed pretium etiam placerat feugiat malesuada ut et aenean.</p>
                                </div>
                            </div>
                            <div class="col-md-12 text-center mt-5"><a class="view_all_bdr" href="/">Load More</a></div>
                        </div>
                        <form className="form_comment mt-5">
                            <h5>Leave a Comment</h5>
                            <div className="row">
                                <div className="col-md-12 mb-4">
                                    <label htmlFor='name'>Name</label>
                                    <input type="text" className="form-control" name="name" />
                                </div>
                                <div className="col-md-12 mb-4">
                                    <label htmlFor='email'>Email *</label>
                                    <input type="text" className="form-control" name="email" />
                                </div>
                                <div className="col-md-12 mb-4">
                                    <label htmlFor=''>Message *</label>
                                    <textarea id="story" className="form-control" name="story" rows="7"></textarea>
                                </div>
                                <div className="col-md-12">
                                    <button type="submit" className="btn main_btn mt-4 btn_log">Submit</button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="col-md-5">
                        <div className="blog_recent mb-5">
                            <h3 className="blog_tlt mb-4">
                                Recent Posts
                                <span className="bottom_border"></span>
                            </h3>
                            <div className="mb-3 recent_li"><Link to={''} className="btn_ylo mr-3">10 Jun</Link> 6 Make Mobile Website Faster</div>
                            <div className="mb-3 recent_li"><Link to={''} className="btn_ylo mr-3">10 Jun</Link> 6 Make Mobile Website Faster</div>
                            <div className="mb-3 recent_li"><Link to={''} className="btn_ylo mr-3">10 Jun</Link> 6 Make Mobile Website Faster</div>
                            <div className="mb-3 recent_li"><Link to={''} className="btn_ylo mr-3">10 Jun</Link> 6 Make Mobile Website Faster</div>
                        </div>
                        <div className="blog_about mb-5">
                            <h3 className="blog_tlt mb-4">
                                About Us
                                <span className="bottom_border"></span>
                            </h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Non, vitae nullam quisque mattis commodo porttitor bibendum et dictumst. Mauris, viverra eget augue massa. Pellentesque at lacus vitae gravida nulla nunc, aliquam. Proin velit neque bibendum laoreet hendrerit diam. Sed aliquam praesent aenean dignissim. Condimentum facilisi mus diam morbi aliquet vitae fringilla. Dui ut amet integer ullamcorper urna parturient. Felis, non ante adipiscing mattis vitae dictum posuere. Tincidunt tristique tristique urna, integer tempor mattis ipsum euismod.</p>
                        </div>
                        <div className="blog_tag mb-5">
                            <h3 className="blog_tlt mb-4">
                                Tags
                                <span className="bottom_border"></span>
                            </h3>
                            <ul>
                                <li><Link to={''} className="btn_ylo">Tags</Link></li>
                                <li><Link to={''} className="btn_ylo">Application</Link></li>
                                <li><Link to={''} className="btn_ylo">Design</Link></li>
                                <li><Link to={''} className="btn_ylo">Entertainment</Link></li>
                                <li><Link to={''} className="btn_ylo">Internet</Link></li>
                                <li><Link to={''} className="btn_ylo">Marketing</Link></li>
                                <li><Link to={''} className="btn_ylo">Multipurpose</Link></li>
                                <li><Link to={''} className="btn_ylo">Music</Link></li>
                                <li><Link to={''} className="btn_ylo">Print</Link></li>
                                <li><Link to={''} className="btn_ylo">Programming</Link></li>
                                <li><Link to={''} className="btn_ylo">Responsive</Link></li>
                                <li><Link to={''} className="btn_ylo">Website</Link></li>
                            </ul>
                            
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <Footer />
    </div>
  )
}

export default Blogdetails
