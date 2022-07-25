import React, { useEffect, useState } from 'react';
// import { useCookies } from "react-cookie";
// import { fetchOfferNft } from "../../apiServices";

const GeneralOffer = (props) => {

    // const [currentUser, setCurrentUser] = useState("");
    // const [cookies] = useCookies([]);
    // const [offer, setOffer] = useState([]);
    

    // useEffect(() => {
    //     if (cookies.selected_account) setCurrentUser(cookies.selected_account);
    //     // else NotificationManager.error("Connect Yout Wallet", "", 800);
    
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    //     console.log(selected_account);
    //   }, [cookies.selected_account]);

    //   useEffect(() => {
    //     const fetch = async () => {
    //       let searchParams = {
    //         nftID: props.id,
    //         buyerID: "All",
    //         bidStatus: "All",
    //         //orderID: "All",
    //       };
    
    //       let _data = await fetchOfferNft(searchParams);
    //       if (_data && _data.data.length > 0) {
    //         let a = _data.data;
    
    //         setOffer(a);
    
    //       }
    //     };
    //     fetch();
    //   }, [props.id]);


  return (
    <div className='row'>
      <div className="col-md-12">
      <div className='nft_list'>
          <table className="table text-light">
              <thead>
                <tr>
                    <th>FROM</th>
                    <th>PRICE</th>
                    <th>DATE</th>
                    <th>END IN</th>
                    <th>STATUS</th>
                    <th>ACTION</th>              
                </tr>
              </thead>
              <tbody>
                <tr>
                    <td><span className="yellow_dot circle_dot"></span>0xc8b...6d74</td>
                    <td><img alt='' src={'../img/favicon.png'} className="img-fluid hunter_fav" /> 5.02</td>
                    <td>15/03/2022  <span className="nft_time">23:13</span></td>
                    <td>00d 00h 00m 00s</td>
                    <td>Active</td>
                    <td>
                        <button to="/" class="small_border_btn small_btn">View</button>
                    </td>
                </tr>
                <tr>
                    <td><span className="yellow_dot circle_dot"></span>0xc8b...6d74</td>
                    <td><img alt='' src={'../img/favicon.png'} className="img-fluid hunter_fav" /> 5.02</td>
                    <td>15/03/2022  <span className="nft_time">23:13</span></td>
                    <td>00d 00h 00m 00s</td>
                    <td>Active</td>
                    <td>
                        <button to="/" class="small_border_btn small_btn">View</button>
                    </td>
                </tr>
                <tr>
                    <td><span className="lightblue_dot circle_dot"></span>0xc8b...6d74</td>
                    <td><img alt='' src={'../img/favicon.png'} className="img-fluid hunter_fav" /> 5.02</td>
                    <td>15/03/2022  <span className="nft_time">23:13</span></td>
                    <td>00d 00h 00m 00s</td>
                    <td>Active</td>
                    <td>
                        <button to="/" class="small_border_btn small_btn">View</button>
                    </td>
                </tr>
                <tr>
                    <td><span className="blue_dot circle_dot"></span>0xc8b...6d74</td>
                    <td><img alt='' src={'../img/favicon.png'} className="img-fluid hunter_fav" /> 5.02</td>
                    <td>15/03/2022  <span className="nft_time">23:13</span></td>
                    <td>00d 00h 00m 00s</td>
                    <td>Active</td>
                    <td>
                        <button to="/" class="small_border_btn small_btn">View</button>
                    </td>
                </tr>
                <tr>
                    <td><span className="yellow_dot circle_dot"></span>0xc8b...6d74</td>
                    <td><img alt='' src={'../img/favicon.png'} className="img-fluid hunter_fav" /> 5.02</td>
                    <td>15/03/2022  <span className="nft_time">23:13</span></td>
                    <td>00d 00h 00m 00s</td>
                    <td>Active</td>
                    <td>
                        <button to="/" class="small_border_btn small_btn">View</button>
                    </td>
                </tr>
              </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default GeneralOffer
