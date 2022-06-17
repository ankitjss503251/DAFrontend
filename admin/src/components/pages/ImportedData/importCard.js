import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  exportInstance,
  getImportedCollections,
  GetCombinedNfts,
  getImportedNFTs,
  importCollection,
  importNft,
} from "../../../apiServices";
import abi from "../../../config/abis/generalERC721Abi.json";
import multicall from "../../../helpers/Multicall";
import { isEmptyObject } from "jquery";
import { GetOwnerOfToken } from "./../../../helpers/getterFunctions";
import { useCookies } from "react-cookie";
import { fetchTokens } from "./../../../helpers/getterFunctions";
import NotificationManager from "react-notifications/lib/NotificationManager";

const ImportCard = () => {
  let { address } = useParams();
  const [authors, setAuthors] = useState([]);
  const [totalSupply, setTotalSupply] = useState(0);
  const [currentUser, setCurrentUser] = useState("");
  const [cookies] = useCookies([]);

  useEffect(() => {
    if (cookies.selected_account) setCurrentUser(cookies.selected_account);
    else NotificationManager.error("Connect Yout Metamask", "", 800);
    // eslint-disable-next-line react-hooks/exhaustive-deps

    console.log("current user is---->", currentUser, cookies.selected_account);
  }, [cookies.selected_account]);

  // const fetchTokens = async () => {
  //   try {
  //     const token = await exportInstance(address, abi);
  //     let dbSupply = totalSupply;
  //     let originalSupply = await token.totalSupply();
  //     let result = await getImportedCollections({
  //       page: 1,
  //       limit: 12,
  //       searchText: address,
  //     });
  //     let _nfts = await GetCombinedNfts({
  //       page: 1,
  //       limit: 12,
  //       collectionAddress: address,
  //       searchText: "",
  //     });
  //     console.log("res", _nfts);

  //     if (
  //       result &&
  //       result.results &&
  //       result.results.length > 0 &&
  //       result.results[0][0] &&
  //       parseInt(originalSupply) ==parseInt(result.results[0][0].totalSupply) &&
  //       _nfts &&
  //       _nfts.length > 0 &&
  //       !isEmptyObject(_nfts[0])
  //     ) {
  //       result = result.results[0][0];
  //       setTotalSupply(parseInt(result.totalSupply));
  //       console.log("in if");
  //       _nfts = _nfts[0];
  //       setAuthors(_nfts);
  //       console.log("nfts", _nfts);
  //       // setAuthors(nfts);
  //     } else {
  //       if (
  //         result &&
  //         result.results &&
  //         result.results.length > 0 &&
  //         result.results[0][0]
  //       ) {
  //         dbSupply = parseInt(result.results[0][0].totalSupply);
  //       }
  //       console.log("in else", parseInt(originalSupply));
  //       try {
  //         await importCollection({
  //           address: address,
  //           totalSupply: parseInt(originalSupply),
  //           link: window.sessionStorage.getItem("importLink"),
  //         });
  //         window.sessionStorage.removeItem("importLink");
  //       } catch (e) {
  //         console.log("e", e);
  //         return;
  //       }
  //       console.log("token", dbSupply);
  //       let calls = [];
  //       let data = [];
  //       let ids = [];
  //       for (let i = dbSupply; i < parseInt(originalSupply); i++) {
  //         let tokenId = await token.tokenByIndex(i);
  //         console.log("tokenId", tokenId);
  //         calls.push({
  //           address: address,
  //           name: "tokenURI",
  //           params: [tokenId],
  //         });
  //         ids.push(parseInt(tokenId));
  //       }

  //       let res = await multicall(abi, calls);
  //       let j = 0;
  //       console.log("here1", res[0], dbSupply, parseInt(originalSupply));
  //       for (let i = dbSupply; i < parseInt(originalSupply); i++) {
  //         console.log("here12", res[j][0]);
  //         let resp = await fetch(res[j][0]);
  //         resp = await resp.json();
  //         let owner = await GetOwnerOfToken(
  //           address,
  //           parseInt(ids[j]),
  //           true,
  //           currentUser
  //         );
  //         resp.owner = owner;
  //         resp.tokenID = parseInt(ids[j]);
  //         resp.collectionAddress = address;
  //         data.push(resp);
  //         console.log("here2", data.length);
  //         j++;
  //       }

  //       try {
  //         if (data && data.results && data.results.length > 0) setAuthors(data);
  //         await importNft({ nftData: data });
  //         await importCollection({
  //           address: address,
  //           totalSupply: parseInt(originalSupply),
  //         });
  //         let res = await GetCombinedNfts({
  //           page: 1,
  //           limit: 12,
  //           collectionAddress: address,
  //           searchText: "",
  //         });
  //         if (res && res.length > 0) setAuthors(res[0]);
  //         // await fetchTokens();
  //       } catch (e) {
  //         console.log("e", e);
  //         return;
  //       }
  //     }
  //   } catch (e) {
  //     console.log("e", e);
  //     return;
  //   }
  // };

  useEffect(() => {
    const fetch = async () => {
      try {
        let data = await fetchTokens(address, abi, currentUser);
        console.log("dataa", data);
        setAuthors(data);
      } catch (e) {
        console.log("Error in fetching all authors list", e);
      }
    };
    fetch();
  }, [currentUser]);

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
