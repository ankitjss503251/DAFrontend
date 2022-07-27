import React, { useEffect, useState } from 'react';
import { Tokens } from '../../helpers/tokensToSymbol';
import { convertToEth } from '../../helpers/numberFormatter';
import Clock from './Clock';
import moment from "moment";

const GeneralOffer = (props) => {

    return (
        <div className='row'>
            {
                props.offers?.length > 0 ?
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
                            {props.offers?.length > 0 && props.offers?.map((_o, i) => {
                             return   <tr key={i}>
                                    <td><span className="yellow_dot circle_dot"></span>{_o?.bidderAddress?.slice(0,4) + "..." + _o?.bidderAddress?.slice(38,42)}</td>
                                    <td><img alt='' src={_o?.paymentToken ? Tokens[_o?.paymentToken.toLowerCase()]?.icon : ""} className="img-fluid hunter_fav" />{Number(convertToEth(_o?.bidPrice))
                      .toFixed(6)
                      .slice(0, -2)}</td>
                                    <td>{moment.utc(_o?.createdOn).local().format("DD/MM/YYYY")}  <span className="nft_time">{moment.utc(_o?.createdOn).local().format("hh:mm")}</span></td>
                                    <td><Clock  deadline={moment.utc(_o?.bidDeadline * 1000).local().format()} /></td>
                                    <td>{_o?.bidStatus === "MakeOffer" ? "Active" : "Inactive"}</td>
                                    <td>
                                        <a  href={`/NFTdetails/${_o?.nftData}`} class="small_border_btn small_btn">View</a>
                                    </td>
                                </tr>
                            })}

                        </tbody>
                    </table>
                </div>
            </div>
            :
            <div className="col-md-12">
          <h4 className="no_data_text text-muted">No Offers Available</h4>
        </div>
            }
          
        </div>
    )
}

export default GeneralOffer;
