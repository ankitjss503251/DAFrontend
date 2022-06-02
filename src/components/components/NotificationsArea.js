import React from 'react'

function NotificationsArea() {
  return (
    <div className="profile_area notification_area pdd_8">
      <h1 className='profile_h1'>Profile Settings</h1>
      <p className='profile_p mb-5'>Select which notifications you would like to receive for 0xa0cacxc...xadef</p>
      <ul className='notification_list'>
        <li className="">
          <div className="">
            <img src={'../img/profile/mdi_sticker-check-outline.png'} alt="" class="img-fluid" />
          </div>
          <div className="">
            <h6>Item Sold</h6>
            <p>When someone purchased one of your items</p>
          </div>
        </li>
        <li className="">
          <div className="">
            <img src={'../img/profile/mdi_sticker-check-outline.png'} alt="" class="img-fluid" />
          </div>
          <div className="">
            <h6>Bid Activity</h6>
            <p>When someone bids on one of your items</p>
          </div>
        </li>
        <li className="">
          <div className="">
            <img src={'../img/profile/mdi_sticker-check-outline.png'} alt="" class="img-fluid" />
          </div>
          <div className="">
            <h6>Price Change</h6>
            <p>When an item you made and offer on changes price</p>
          </div>
        </li>
        <li className="">
          <div className="">
          <img src={'../img/profile/mdi_sticker-check-outline.png'} alt="" class="img-fluid" />
          </div>
          <div className="">
            <h6>Auction Expiration</h6>
            <p>When a timed auction you created ends</p>
          </div>
        </li>
        <li className="">
          <div className="">
          <img src={'../img/profile/mdi_sticker-check-outline.png'} alt="" class="img-fluid" />
          </div>
          <div className="">
            <h6>Outbid</h6>
            <p>When an offer you placed is exceeded by another user</p>
          </div>
        </li>
        <li className="">
          <div className="">
          <img src={'../img/profile/mdi_sticker-check-outline.png'} alt="" class="img-fluid" />
          </div>
          <div className="">
            <h6>Owned Item Updates</h6>
            <p>When a significant update occurs for one of the items you have purchased on Digital Arms</p>
          </div>
        </li>
        <li className="">
          <div className="">
          <img src={'../img/profile/mdi_sticker-check-outline.png'} alt="" class="img-fluid" />
          </div>
          <div className="">
            <h6>Successful Purchase</h6>
            <p>When you successfully buy an item</p>
          </div>
        </li>
        <li className="">
          <div className="">
          <img src={'../img/profile/mdi_sticker-check-outline.png'} alt="" class="img-fluid" />
          </div>
          <div className="">
            <h6>Digital Arms Newsletter</h6>
            <p>Occasional updates from the Digital Arms team</p>
          </div>
        </li>
      </ul>
      <div className="notification_bottom">
        <h6>Minimum Bid Threshold</h6>
        <p>Receive notifications only when you receive offers with a value greater than or equal to this amount of HNTR.</p>
      </div>
      <table className='notification_table'>
        <tr>
          <td>
            
            <h6>$HNTR</h6>
            <p>Hunter Token</p>
          </td>
          <td>
            0.005
          </td>
        </tr>
      </table>
      <div className='mt-5'>
          <button type="submit" class="yellow_btn mr-3 mb-3">Save</button>
          <button type="submit" class="yellow_btn yellow_dark mb-3">Save</button>
      </div>
      <small className='small_info'>If no changes made the button will not glow</small>
    </div>
  )
}

export default NotificationsArea
