import React from 'react';
import Sidebar from '../components/Sidebar';
// import LogInHeader from '../menu/LogInHeader';

function Offers() {
  return (
    <div>
        <div className="container">
            <div className="row userinfo">
                <div className="col-md-3 usersidebar">
                    <Sidebar />
                </div>
                <div className="col-md-9">
                    <div className="profile_area pdd_8">
                        <h1 className="profile_h1">Offers</h1>
                    </div>
                </div> 
            </div>
        </div>
    </div>
  )
}

export default Offers
