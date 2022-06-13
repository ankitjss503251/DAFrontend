import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  exportInstance,
  getImportedCollections,
  getImportedNFTs,
  importCollection,
  importNft,
} from "../../../apiServices";
import abi from "../../../config/abis/generalERC721Abi.json";
import multicall from "../../../helpers/Multicall";
import { isEmptyObject } from "jquery";

const ImportCard = () => {
  let { address } = useParams();
  const [authors, setAuthors] = useState([]);
  const [totalSupply, setTotalSupply] = useState(0);

  const fetchTokens = async () => {
    try {
      const token = await exportInstance(address, abi);
      let dbSupply = totalSupply;
      let originalSupply = await token.totalSupply();
      let result = await getImportedCollections({
        page: 1,
        limit: 12,
        searchText: address,
      });
      let _nfts = await getImportedNFTs({
        page: 1,
        limit: 12,
        collectionAddress: address,
        searchText: "",
      });
      console.log("res", result);

      console.log(
        "hh",
        originalSupply,
        result.results[0][0].totalSupply,
        _nfts,
        _nfts.results,
        _nfts.results.length,
        isEmptyObject(_nfts.results[0])
      );
      if (
        result &&
        result.results &&
        result.results.length > 0 &&
        originalSupply == result.results[0][0].totalSupply &&
        _nfts &&
        _nfts.results &&
        _nfts.results.length > 0 &&
        !isEmptyObject(_nfts.results[0])
      ) {
        result = result.results[0][0];
        setTotalSupply(parseInt(result.totalSupply));
        console.log("in if");
        _nfts = _nfts.results[0];
        setAuthors(_nfts);
        console.log("nfts", _nfts);
        // setAuthors(nfts);
      } else {
        if (result && result.results && result.results.length > 0) {
          dbSupply = parseInt(result.results[0][0].totalSupply);
        }
        console.log("in else", parseInt(originalSupply));
        try {
          await importCollection({
            address: address,
            totalSupply: parseInt(originalSupply),
          });
        } catch (e) {
          console.log("e", e);
          return;
        }
        console.log("token", dbSupply);
        let calls = [];
        let data = [];
        let ids = [];
        for (let i = dbSupply - 1; i < parseInt(originalSupply); i++) {
          let tokenId = await token.tokenByIndex(i);
          console.log("tokenId", tokenId);
          calls.push({
            address: address,
            name: "tokenURI",
            params: [tokenId],
          });
          ids.push(tokenId);
        }

        let res = await multicall(abi, calls);
        let j = 0;
        console.log("here1", res[0], dbSupply, parseInt(originalSupply));
        for (let i = dbSupply - 1; i < parseInt(originalSupply); i++) {
          console.log("here12", res[j][0]);
          let resp = await fetch(res[j][0]);
          resp = await resp.json();
          resp.tokenID = ids[j];
          resp.collectionAddress = address;
          data.push(resp);
          console.log("here2", data.length);
          j++;
        }

        try {
          if (data && data.results && data.results.length > 0) setAuthors(data);
          await importNft({ nftData: data });
          await importCollection({
            address: address,
            totalSupply: parseInt(originalSupply),
          });
          await fetchTokens();
        } catch (e) {
          console.log("e", e);
          return;
        }
      }
    } catch (e) {
      console.log("e", e);
      return;
    }
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        await fetchTokens();
      } catch (e) {
        console.log("Error in fetching all authors list", e);
      }
    };
    fetch();
  }, []);

  return (
    <div>
      <div className="row author_list_section">
        {console.log("authors", authors.length)}
        {authors && authors.length > 0
          ? authors.map((card, key) => {
              return (
                <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
                  <Link to={`/importedNfts/${address}/${card.tokenID}`}>
                    <div className="author_list_box">
                      <img
                        src={
                          card
                            ? card?.image
                            : `../img/top-seller/seller-img.png`
                        }
                        className="import-img"
                        alt=""
                      />
                      <div className="import_info">
                        <h6>{card ? card?.name : "Unnamed"}</h6>
                        <p>{card ? card?.description : "-"}</p>
                        <button className="putonmarketplace">View NFT</button>
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
