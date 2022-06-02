import React from 'react';
import BellSVG from '../SVG/BellSVG';
import ListSVG from '../SVG/ListSVG';
import CartSVG from '../SVG/CartSVG';
import TransferSVG from '../SVG/TransferSVG';
import CancelledSVG from '../SVG/CancelledSVG';

function NFThistory() {
  return (
    <div className='row'>
      <div className="col-md-12">
      <div className='nft_list'>
          <table className="table text-light">
              <thead>
              <tr>
                  <th>EVENT</th>
                  <th>PRICE</th>
                  <th>FROM</th>
                  <th>TO</th>
                  <th>DATE</th>
              </tr>
              </thead>
              <tbody>
                <tr>
                    <td>
                      <span className="nft_svg">
                        <BellSVG />
                      </span>
                      Offer
                    </td>
                    <td><img alt='' src={'../img/favicon.png'} className="img-fluid hunter_fav" /> 5.02</td>
                    <td><span className="yellow_dot circle_dot"></span>0xc8b...6d74</td>
                    <td><span className="yellow_dot circle_dot"></span>0xc8b...6d74</td>
                    <td>15/03/2022  <span className="nft_time">23:13</span></td>
                </tr>
                <tr>
                    <td>
                      <span className="nft_svg">
                        <ListSVG />
                      </span>
                      List
                    </td>
                    <td><img alt='' src={'../img/favicon.png'} className="img-fluid hunter_fav" /> 5.02</td>
                    <td><span className="yellow_dot circle_dot"></span>0xc8b...6d74</td>
                    <td><span className="yellow_dot circle_dot"></span>0xc8b...6d74</td>
                    <td>15/03/2022  <span className="nft_time">23:13</span></td>
                </tr>
                <tr>
                    <td>
                      <span className="nft_svg">
                        <CartSVG />
                      </span>
                      Sold
                    </td>
                    <td><img alt='' src={'../img/favicon.png'} className="img-fluid hunter_fav" /> 5.02</td>
                    <td><span className="lightblue_dot circle_dot"></span>0xc8b...6d74</td>
                    <td><span className="lightblue_dot circle_dot"></span>0xc8b...6d74</td>
                    <td>15/03/2022  <span className="nft_time">23:13</span></td>
                </tr>
                <tr>
                    <td>
                      <span className="nft_svg">
                        <TransferSVG />
                      </span>
                      Transfer
                    </td>
                    <td><img alt='' src={'../img/favicon.png'} className="img-fluid hunter_fav" /> 5.02</td>
                    <td><span className="blue_dot circle_dot"></span>0xc8b...6d74</td>
                    <td><span className="blue_dot circle_dot"></span>0xc8b...6d74</td>
                    <td>15/03/2022  <span className="nft_time">23:13</span></td>
                </tr>
                <tr>
                    <td>
                      <span className="nft_svg">
                        <CancelledSVG />
                      </span>
                      List Cancelled
                    </td>
                    <td><img alt='' src={'../img/favicon.png'} className="img-fluid hunter_fav" /> 5.02</td>
                    <td><span className="yellow_dot circle_dot"></span>0xc8b...6d74</td>
                    <td><span className="yellow_dot circle_dot"></span>0xc8b...6d74</td>
                    <td>15/03/2022  <span className="nft_time">23:13</span></td>
                </tr>
              </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default NFThistory
