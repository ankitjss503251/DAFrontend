import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAuthors } from "./../../helpers/getterFunctions";

const AuthorList = () => {
  const [authors, setAuthors] = useState([]);
  useEffect(async () => {
    try {
      const res = await getAuthors({ page: 1, limit: 12 });
      console.log("result of getAuthors helper fn--->", res);
      setAuthors(res);
    } catch (e) {
      console.log("Error in fetching all authors list", e);
    }
  }, []);
  return (
    <div>
      <div className="row author_list_section">
        {authors
          ? authors.map((card, key) => {
              return (
                <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
                  <Link to={`/author/${card._id}`}>
                    <div className="author_list_box">
                      <img
                        src={
                          card.profile
                            ? card.profile
                            : `../img/top-seller/seller-img.png`
                        }
                        className="auther_img"
                        alt=""
                      />
                      <div className="auther_info">
                        <h6>{card.name ? card.name : "Unnamed"}</h6>
                        <p>3.2 ETH</p>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })
          : ""}
      </div>
    </div>
  );
};
export default AuthorList;
