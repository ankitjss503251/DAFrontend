import React from 'react';
import { PartnersLogos } from '../../Data/dummyJSON';

function PartnersSlider() {
  return (
    <div className='col-md-12'>
        {PartnersLogos.map(partnerlogo =>(
            <div className="partner_logo" key={partnerlogo.id}>
                <img src={partnerlogo.img} class="img-fluid" alt="" />
            </div>
        ))}
    </div>
  )
}

export default PartnersSlider
