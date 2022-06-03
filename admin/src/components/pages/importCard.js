import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { exportInstance, getImportedNFTs } from "../../apiServices";
import erc721Abi from "./../../config/abis/simpleERC721.json";
import erc1155Abi from "./../../config/abis/simpleERC1155.json";
import { GetOwnerOfToken } from "../../helpers/getterFunctions";

const ImportCard = () => {
  let { address } = useParams();
  const [authors, setAuthors] = useState([]);
  const [currUser, setCurrUser] = useState(
    "0x34781C0fCCe7C3eFcd1dCC75F6ad666c61048b80"
  );
  useEffect(async () => {
    try {
      let contract = await exportInstance(address, erc721Abi.abi);
      console.log("contract", contract);
      const res = await getImportedNFTs({ collection: address });

      for (let i = 0; i < res.length; i++) {
        let owner = await GetOwnerOfToken(
          address,
          res[i].tokenId,
          true,
          currUser
        );
        console.log("owner", owner);
        res[i].owner = owner;
      }
      setAuthors(res);
      console.log("result of nfts--->", res);
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
                          card?.metadata?.metadata
                            ? card?.metadata?.metadata?.image
                            : `../img/top-seller/seller-img.png`
                        }
                        className="import-img"
                        alt=""
                      />
                      <div className="import_info">
                        <h6>
                          {card?.metadata?.metadata
                            ? card?.metadata?.metadata?.name
                            : "Unnamed"}
                        </h6>
                        <p>
                          {card?.metadata?.metadata
                            ? card?.metadata?.metadata?.description
                            : "-"}
                        </p>
                        <button>
                          {card?.owner.toLowerCase() === currUser.toLowerCase()
                            ? "Put On Marketplace"
                            : "View"}
                        </button>
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
export default ImportCard;
