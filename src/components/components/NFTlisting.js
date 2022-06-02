import React from 'react'
import { Link } from 'react-router-dom'

function NFTlisting() {
  return (
    <div className='row'>
      <div className='col-md-12'>
        <div className='nft_list'>
          <table className="table text-light">
              <thead>
              <tr>
                  <th>FROM</th>
                  <th>PRICE</th>
                  <th>DATE</th>
                  <th>STATUS</th>
                  <th className='text-center'>ACTION</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                  <td><span className="yellow_dot circle_dot"></span>0xc8b...6d74</td>
                  <td><img alt='' src={'../img/favicon.png'} className="img-fluid hunter_fav" /> 5.02</td>
                  <td>15/03/2022  <span className="nft_time">23:13</span></td>
                  <td className='blue_text'>Active</td>
                  <td>
                  <div className='text-center'>
                    <Link to={'/'} className="small_yellow_btn small_btn mr-3">Accept</Link>
                    <Link to={'/'} className="small_border_btn small_btn">Reject</Link>
                  </div>
                  </td>
              </tr>
              <tr>
                  <td><span className="yellow_dot circle_dot"></span>0xc8b...6d74</td>
                  <td><img alt='' src={'../img/favicon.png'} className="img-fluid hunter_fav" /> 5.02</td>
                  <td>15/03/2022  <span className="nft_time">23:13</span></td>
                  <td className='green_text'>Filled</td>
                  <td>
                  <div className='text-center'>
                  </div>
                  </td>
              </tr>
              <tr>
                  <td><span className="lightblue_dot circle_dot"></span>0xc8b...6d74</td>
                  <td><img alt='' src={'../img/favicon.png'} className="img-fluid hunter_fav" /> 5.02</td>
                  <td>15/03/2022  <span className="nft_time">23:13</span></td>
                  <td className='red_text'>Cancelled</td>
                  <td>
                  <div className='text-center'>
                  </div>
                  </td>
              </tr>
              <tr>
                  <td><span className="blue_dot circle_dot"></span>0xc8b...6d74</td>
                  <td><img alt='' src={'../img/favicon.png'} className="img-fluid hunter_fav" /> 5.02</td>
                  <td>15/03/2022  <span className="nft_time">23:13</span></td>
                  <td className='red_text'>Cancelled</td>
                  <td>
                  <div className='text-center'>
                  </div>
                  </td>
              </tr>
              <tr>
                  <td><span className="yellow_dot circle_dot"></span>0xc8b...6d74</td>
                  <td><img alt='' src={'../img/favicon.png'} className="img-fluid hunter_fav" /> 5.02</td>
                  <td>15/03/2022  <span className="nft_time">23:13</span></td>
                  <td className='blue_text'>Active</td>
                  <td>
                  <div className='text-center'>
                    <Link to={'/'} className="small_yellow_btn small_btn mr-3">Accept</Link>
                    <Link to={'/'} className="small_border_btn small_btn">Reject</Link>
                  </div>
                  </td>
              </tr>
              </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default NFTlisting
