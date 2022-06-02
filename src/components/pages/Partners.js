import React from 'react';
import Footer from '../components/footer';
import PartnersBanner from '../components/PartnersBanner';
import {DUMMY_COLLECTIONS} from "../../Data/dummyJSON";
import {PartnerWithUs} from "../../Data/dummyJSON";
// import collection from './collection';
import Arrow from '../SVG/Arrow';
import { PartnersLogos } from '../../Data/dummyJSON';

var bgImgStyle = {
    backgroundImage: "url(./img/background.jpg)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPositionX: "center",
    backgroundPositionY: "center",
    backgroundColor: "#000",
  };
  var bgImgStylesec1 = {
    backgroundImage: "url(./img/background/banner-home.jpg)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPositionX: "center",
    backgroundPositionY: "center",
    backgroundColor: "#000",
  };

function Partners() {
  return (
    <div style={bgImgStyle}>
            <section style={bgImgStylesec1} className="jumbotron breadcumb no-bg h-vh pdd_8">
                <PartnersBanner />
            </section>
            <section className="pdd_8">
                <div className="container">
                    <div className="row mb-5">
                        <div className="col-md-12">
                            <h2 className="text-center main-title text-light mb-3">Why partner with Hunter Token</h2>
                            <p className="text-24 text-light text-center">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nec volutpat nulla nec orci tellus, ornare arcu, condimentum. Quam morbi mauris at feugiat tristique vitae tincidunt quam sit. Cursus lacus nunc in metus lectus egestas fames. Tellus ullamcorper ut volutpat mattis non ornare purus. Nec nunc elit in nulla vitae a nullam nullam egestas. In donec duis sed non massa fusce massa.</p>
                        </div>
                    </div>
                    <div className="row">
                        {DUMMY_COLLECTIONS.map(collection=>(
                            <div className="col-md-4 mb-5" key={collection.id}>
                            <div className="width-100 text-center partner_items">
                                <img className="mb-3" src={collection.img} alt="" />
                                <h6 className="mb-3">{collection.Heading}</h6>
                                <p>{collection.Text}</p>
                            </div>
                        </div>
                            ))}
                    </div>
                </div>
            </section>
            <section className="pdd_8 pt-0">
                <div className="container">
                    <div className="row mb-5">
                        <div className="col-md-12">
                            <h2 className="text-center main-title text-light mb-3">Who has partnered with us</h2>
                            <p className="text-24 text-light text-center">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nec volutpat nulla nec orci tellus, ornare arcu, condimentum. Quam morbi mauris at feugiat tristique vitae tincidunt quam sit.</p>
                        </div>
                    </div>
                    <div className="row">
                        {PartnerWithUs.map(partners=>(
                            <div className="col-md-4 mb-4" key={partners.id}>
                                <div class="collection_slide" tabindex="-1">
                                    <img src={partners.img} class="img-fluid" alt="" />
                                    <div class="collection_text">
                                        <div class="coll_profileimg">
                                            <img alt="" class="profile_img" src={partners.profile_img} />
                                        </div>
                                        <h3 class="collname">{partners.Heading} <img alt="" class="" src="../img/collections/check.png" /></h3>
                                        <p><span className='text-light'>by</span> {partners.Subheading} <img alt="" class="" src="../img/collections/check.png" /></p>
                                        <div className='description text-center text-light'>{partners.Text}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <section className="pdd_8 pt-0">
                <div className="container">
                    <div className="row mb-5">
                        <div className="col-md-12">
                            <h2 className="text-center main-title text-light mb-3">FAQs</h2>
                            <p className="text-24 text-light text-center">For more FAQs visit our partnership page in our help center</p>
                        </div>
                    </div>
                    <div className="row partner_faq">
                        <div className="col-md-12">
                            <div class="accordion" id="accordionExample">
                                <div class="accordion-item1">
                                    <h2 class="accordion-header" id="headingOne">
                                    <button class="accordion-button1" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                        What is an NFT? What makes them so great? <span className="arrow_faq"><Arrow /></span>
                                    </button>
                                    </h2>
                                    <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                    <div class="accordion-body">
                                        <strong>This is the first item's accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the, though the transition does limit overflow.
                                    </div>
                                    </div>
                                </div>
                                <div class="accordion-item1">
                                    <h2 class="accordion-header" id="headingTwo">
                                    <button class="accordion-button1 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                        What makes HunterToken special? <span className="arrow_faq"><Arrow /></span>
                                    </button>
                                    </h2>
                                    <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                    <div class="accordion-body">
                                        <strong>This is the second item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the, though the transition does limit overflow.
                                    </div>
                                    </div>
                                </div>
                                <div class="accordion-item1">
                                    <h2 class="accordion-header" id="headingThree">
                                    <button class="accordion-button1 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                        What does a partnership with huntertoken entail? <span className="arrow_faq"><Arrow /></span>
                                    </button>
                                    </h2>
                                    <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                                    <div class="accordion-body">
                                        <strong>This is the third item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the, though the transition does limit overflow.
                                    </div>
                                    </div>
                                </div>
                                <div class="accordion-item1">
                                    <h2 class="accordion-header" id="headingThree">
                                    <button class="accordion-button1 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                                        What does it cost to partner with HunterToken <span className="arrow_faq"><Arrow /></span>
                                    </button>
                                    </h2>
                                    <div id="collapseFour" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                                    <div class="accordion-body">
                                        <strong>This is the third item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the, though the transition does limit overflow.
                                    </div>
                                    </div>
                                </div>
                                <div class="accordion-item1">
                                    <h2 class="accordion-header" id="headingThree">
                                    <button class="accordion-button1 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
                                        How do we get started? <span className="arrow_faq"><Arrow /></span>
                                    </button>
                                    </h2>
                                    <div id="collapseFive" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                                    <div class="accordion-body">
                                        <strong>This is the third item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the, though the transition does limit overflow.
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="pt-5 pb-5 bg_yellow">
                <div className="container">
                    <div className="row align-items-center">
                        {PartnersLogos.map(partnerlogo =>(
                            <div className="col" key={partnerlogo.id}>
                                <img src={partnerlogo.img} class="img-fluid" alt="" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        <Footer />
    </div>
  )
}

export default Partners
