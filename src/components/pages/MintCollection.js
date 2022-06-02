import React from 'react';
import Footer from '../components/footer';
import Minttab from '../components/Minttab';

var register_bg = {
    backgroundImage: "url(./img/mint/bg.jpg)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPositionX: "center",
    backgroundPositionY: "center",
};
var bgImgStyle = {
    backgroundImage: "url(./img/background.jpg)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPositionX: "center",
    backgroundPositionY: "center",
    backgroundColor: "#000",
};


function MintCollection() {
  return (
    <div style={bgImgStyle}>
        <section className='register_hd pdd_12' style={register_bg}>
            <div className='container'>
                <div className='row'>
                    <div className='col-md-12'>
                        <h1>Minting</h1>
                    </div>
                </div>
            </div>
        </section>
        <section className="pdd_8">
            <Minttab />
        </section>
        <Footer />
    </div>
  )
}

export default MintCollection
