import React, { useState, useEffect } from "react";
import Footer from "../components/footer";
import Minttab from "../components/Minttab";
import Mintlivetab from "../components/MintLivetab";
import { getCollections } from "../../helpers/getterFunctions";
import moment from "moment";

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

function MintCollectionLive() {
  const [ongoing, setOngoing] = useState([]);
  const [launched, setLaunched] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [allCollections, setAllCollections] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(async () => {
    try {
      const reqData = {
        page: 1,
        limit: 12,
      };
      const res = await getCollections(reqData);
      console.log("all collections in mintcollection live page--->", res);
      setAllCollections(res);
    } catch (e) {
      console.log("Error in fetching all collections list", e);
    }
  }, []);


  useEffect(() => {
    let _ongoing = [];
    let _upcoming = [];
    let _launched = [];
    allCollections.map((coln) => {
      const st = coln.saleStartTime;
      const et = coln.saleEndTime;
      const ct = moment().add({ hours: 5, minutes: 30 }).toISOString();

      if (ct < st) {
        _upcoming.push(coln);
      } else if (ct >= st && ct < et) {
        _ongoing.push(coln);
        // setOngoing(ongoing.push(coln));
      } else {
        _launched.push(coln);
      }
    });
    setOngoing(_ongoing);
    setUpcoming(_upcoming);
    setLaunched(_launched);
    console.log("upcoming coll", _upcoming);
    console.log("ongoing coll", _ongoing);
    console.log("launched", _launched);
  }, [allCollections]);

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
      {ongoing && ongoing.length > 0 ?   <section className='pdd_8 pb-0'>
        {console.log("ongoing", ongoing)}
        <Mintlivetab ongoing={ongoing} />
      </section> : "" }
    
      <section className='pdd_8'>
        <Minttab upcoming={upcoming} past={launched}/>
      </section>
      <Footer />
    </div>
  );
}

export default MintCollectionLive;
