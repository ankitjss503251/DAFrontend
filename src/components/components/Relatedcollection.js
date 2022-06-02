import React from 'react'

function Relatedcollection() {
  return (
    <div className="row mb-5">
        <div className="col-md-4 mb-4">
            <div className='collection_slide'>
                <img src={'../img/collections/coll1.png'} class="img-fluid" alt='' />
                <div className='collection_text'>
                    <div className='coll_profileimg'>
                    <img alt='' className='profile_img' src={'../img/collections/profile1.png'} />
                    <img alt='' className='check_img' src={'../img/collections/check.png'} />
                    </div>
                    <h3 className='collname'>Firearms Weapon</h3>
                    <p>ERC-73</p>
                </div>
            </div>
        </div>
        <div className="col-md-4 mb-4">
            <div className='collection_slide'>
                <img alt='' src={'../img/collections/collection2.png'} class="img-fluid" />
                <div className='collection_text'>
                    <div className='coll_profileimg'>
                    <img alt='' className='profile_img' src={'../img/collections/collection-pro2.png'} />
                    <img alt='' className='check_img' src={'../img/collections/check.png'} />
                    </div>
                    <h3 className='collname'>Soldiers</h3>
                    <p>ERC-73</p>
                </div>
            </div>
        </div>
        <div className="col-md-4 mb-4">
            <div className='collection_slide'>
            <img alt='' src={'../img/collections/collection3.png'} class="img-fluid" />
            <div className='collection_text'>
                <div className='coll_profileimg'>
                <img alt='' className='profile_img' src={'../img/collections/collection-pro3.png'} />
                <img alt='' className='check_img' src={'../img/collections/check.png'} />
                </div>
                <h3 className='collname'>Ammo Cache</h3>
                <p>ERC-73</p>
            </div>
            </div>
        </div>
    </div>
  )
}

export default Relatedcollection
