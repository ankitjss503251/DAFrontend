import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  exportInstanceThroughWeb3,
  GetCombinedNfts,
  getImportedNFTs,
  getOrderDetails,
  GetOrdersByNftId,
  importNft,
  UpdateNft,
} from "../../../apiServices";
import { useCookies } from "react-cookie";
import NotificationManager from "react-notifications/lib/NotificationManager";
import { GetOwnerOfToken } from "../../../helpers/getterFunctions";
import {
  handleBuyNft,
  putOnMarketplace,
  handleRemoveFromSale,
} from "../../../helpers/sendFunctions";
import abi from "../../../config/abis/generalERC721Abi.json";

const NftDetail = () => {
  let { address, id } = useParams();
  console.log("address,id", address, id);
  const [nftDetails, setNftDetails] = useState({});
  const [currentUser, setCurrentUser] = useState("");
  const [cookies] = useCookies([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (cookies.selected_account) setCurrentUser(cookies.selected_account);
    else NotificationManager.error("Connect Yout Metamask", "", 800);
    // eslint-disable-next-line react-hooks/exhaustive-deps

    console.log("current user is---->", currentUser, cookies.selected_account);
  }, [cookies.selected_account]);

  useEffect(() => {
    refreshMetaData();
  }, [currentUser]);

  const refreshMetaData = async () => {
    if (address && id) {
      let contract = await exportInstanceThroughWeb3(address, abi);
      let uri = await contract.methods.tokenURI(id).call();
      let owner;

      let data = await fetch(uri);
      data = await data.json();
      console.log("dataa", address);
      if (currentUser) {
        owner = await GetOwnerOfToken(address, id, true, currentUser);
        console.log("owner", owner);
      } else {
        owner = "";
      }
      data.owner = owner;
      await UpdateNft({
        collectionAddress: address,
        description: data.description,
        tokenID: id,
        name: data.name,
        image: data.image,
        attributes: data.attributes,
        owner: data.owner,
      });
    }
  };

  const getNFTDetails = async () => {
    if (address && id) {
      let res = await GetCombinedNfts({
        collectionAddress: address,
        tokenID: id,
      });
      console.log("nft details", res);
      if (res && res.length > 0) {
        res = res[0][0];
      }
      console.log("nft details", res);
      setNftDetails(res);

      let orders = await GetOrdersByNftId({
        tokenID: id,
        collectionAddress: address,
      });
      if (orders && orders.results && orders.results.length > 0) {
        setOrders(orders.results);
        console.log("here");
      }

      console.log("orders", orders);
    }
  };

  useEffect(() => {
    getNFTDetails();
  }, [address, id, currentUser]);

  return (
    <div className="wrapper">
      <div className="row text-center container p-3">
        <div className="col-lg-6">
          <img src={nftDetails?.image} className="nftImg"></img>
        </div>

        <div className="col-lg-6">
          <h4>Name</h4>
          <div>{nftDetails?.name}</div>
          <h4>Description</h4>
          <div>{nftDetails?.description}</div>
          <h4>Collection</h4>
          <div>{address}</div>
          <h4>Properties</h4>
          <div className="d-flex align-items-center justify-content-center flex-wrap">
            {nftDetails?.attributes && nftDetails.attributes?.length > 0
              ? nftDetails.attributes.map((attr, i) => {
                  return (
                    <div className="attr_list">
                      {attr ? attr?.trait_type + ":" + attr?.value : ""}
                    </div>
                  );
                })
              : ""}
          </div>

          <div className="col">
            <button
              className="putonmarketplace"
              onClick={async () => {
                await refreshMetaData();

                await getNFTDetails();
              }}
            >
              Refresh
            </button>
          </div>
          <br></br>
          <div className="col">
            {/* {console.log(
              "dattaaa",
              nftDetails && ownedBy.length>0?.ownedBy?.toLowerCase() ===
                currentUser?.toLowerCase() && orders.length == 0,
              nftDetails?.ownedBy?.toLowerCase(),
              currentUser?.toLowerCase(),
              orders.length
            )} */}
            {nftDetails?.ownedBy?.toLowerCase() ===
              currentUser?.toLowerCase() && orders.length == 0 ? (
              <button
                className="putonmarketplace"
                onClick={async () => {
                  {
                    console.log("nftDetails", nftDetails);
                    await putOnMarketplace(currentUser, {
                      collection: address,
                      tokenID: id,
                      nftID: nftDetails?._id,
                    });
                  }
                }}
              >
                Put On Marketplace
              </button>
            ) : orders.length > 0 ? (
              orders.map((o, i) => {
                return (
                  <button
                    className="putonmarketplace"
                    onClick={async () => {
                      {
                        console.log("nftDetails", nftDetails);
                        nftDetails?.ownedBy?.toLowerCase() ===
                          currentUser?.toLowerCase() && orders.length == 0
                          ? await putOnMarketplace(currentUser, {
                              collection: address,
                              tokenID: id,
                              nftID: nftDetails?._id,
                            })
                          : nftDetails?.ownedBy?.toLowerCase() ===
                            currentUser?.toLowerCase()
                          ? await handleRemoveFromSale(o._id, currentUser)
                          : await handleBuyNft(
                              o._id,
                              true,
                              currentUser,
                              100000000000
                            );
                      }
                    }}
                  >
                    {nftDetails?.ownedBy?.toLowerCase() ===
                      currentUser?.toLowerCase() && orders.length == 0
                      ? "Put On Marketplace"
                      : nftDetails?.ownedBy?.toLowerCase() ===
                        currentUser?.toLowerCase()
                      ? "Remove from sale"
                      : "Buy"}
                  </button>
                );
              })
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NftDetail;
