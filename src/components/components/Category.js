import React, { useState, useEffect } from "react";
import { Link } from "@reach/router";
import { getCategory } from "../../helpers/getterFunctions";

const Category = () => {
  const [catg, setCatg] = useState([]);
  useEffect(async () => {
    const cat = await getCategory();
    console.log("sefsd", cat);
    setCatg(cat);
  }, []);

  return (
    <div className='row text-center'>
      {catg
        ? catg.map((c, key) => {
          return  <div className='col mb-4' key={key}>
              <Link className='icon-box style-2 rounded' to=''>
                {/* <svg
                  width='88'
                  height='100'
                  viewBox='0 0 88 100'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M86.6015 1.82175C85.4798 0.700042 83.6613 0.700042 82.5396 1.82175L78.6986 5.66271L76.6676 3.63165C75.5459 2.50994 73.7273 2.50994 72.6056 3.63165C71.4839 4.75336 71.4839 6.57187 72.6056 7.69358L74.6365 9.72464L49.5848 34.7766L45.5229 30.7146L41.4609 34.7766L45.5229 38.8385L33.3369 51.0245L29.2749 46.9625L25.213 51.0245L29.2749 55.0864L21.1511 63.2103C20.7501 63.6112 20.4769 64.1219 20.3656 64.678L19.3871 69.5704L14.4947 70.5488C13.9387 70.6601 13.428 70.9333 13.027 71.3343L4.90316 79.4582C2.29019 82.0712 2.29 86.323 4.90316 88.936L13.027 97.0599C15.6402 99.673 19.8919 99.6729 22.5051 97.0599L37.399 82.1659C37.8 81.765 38.0732 81.2543 38.1845 80.6982L40.155 70.8458L47.6234 74.5799C48.7292 75.1328 50.0648 74.916 50.939 74.0419L59.0628 65.918C60.1845 64.7963 60.1845 62.9778 59.0628 61.8561L52.9698 55.7631L56.1643 52.5686C58.6597 50.0732 59.7365 46.5172 59.0444 43.0563L57.4417 35.0433L86.6015 5.88387C87.7232 4.76216 87.7232 2.94346 86.6015 1.82175ZM52.9698 63.8873L48.3407 68.5164L42.9248 65.8085L48.9079 59.8254L52.9698 63.8873Z'
                    fill='url(#paint0_linear_57_4557)'
                  />
                  <path
                    d='M13.0271 59.1484C14.1488 58.0266 14.1488 56.2081 13.0271 55.0864L17.089 51.0245L8.96495 42.9006L4.90321 46.9626C3.7815 45.8409 1.96299 45.8409 0.841281 46.9626C-0.280427 48.0843 -0.280427 49.9028 0.841281 51.0245L8.96514 59.1484C10.0869 60.2701 11.9054 60.2701 13.0271 59.1484Z'
                    fill='url(#paint1_linear_57_4557)'
                  />
                  <path
                    d='M50.2619 17.8519C51.3837 16.7302 51.3837 14.9116 50.2619 13.7899L46.2 9.728C45.0783 8.60629 43.2598 8.60629 42.1381 9.728L13.0271 38.8388L21.151 46.9627L50.2619 17.8519Z'
                    fill='url(#paint2_linear_57_4557)'
                  />
                  <defs>
                    <linearGradient
                      id='paint0_linear_57_4557'
                      x1='45.1931'
                      y1='0.980469'
                      x2='45.1931'
                      y2='99.0197'
                      gradientUnits='userSpaceOnUse'>
                      <stop stop-color='#EF981D' />
                      <stop offset='1' stop-color='#FF9901' />
                    </linearGradient>
                    <linearGradient
                      id='paint1_linear_57_4557'
                      x1='8.5445'
                      y1='42.9006'
                      x2='8.5445'
                      y2='59.9896'
                      gradientUnits='userSpaceOnUse'>
                      <stop stop-color='#EF981D' />
                      <stop offset='1' stop-color='#FF9901' />
                    </linearGradient>
                    <linearGradient
                      id='paint2_linear_57_4557'
                      x1='32.0652'
                      y1='8.88672'
                      x2='32.0652'
                      y2='46.9627'
                      gradientUnits='userSpaceOnUse'>
                      <stop stop-color='#EF981D' />
                      <stop offset='1' stop-color='#FF9901' />
                    </linearGradient>
                  </defs>
                </svg> */}
                <div className="category_img">
                <img src={c.image} alt="" className="catg_img"/>
                </div>
                <h5>{c.name}</h5>
              </Link>
            </div>;
          })
        : ""}
    </div>
  );
};
export default Category;
