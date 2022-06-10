import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  exportInstanceThroughWeb3,
  getOrderDetails,
  GetOrdersByNftId,
} from "../../../apiServices";
import { useCookies } from "react-cookie";
import NotificationManager from "react-notifications/lib/NotificationManager";
import { GetOwnerOfToken } from "../../../helpers/getterFunctions";
import {
  handleBuyNft,
  putOnMarketplace,
  handleRemoveFromSale,
} from "../../../helpers/sendFunctions";

const NftDetail = () => {
  let { address, id } = useParams();
  console.log("address,id", address, id);
  const [nftDetails, setNftDetails] = useState({});
  const [currentUser, setCurrentUser] = useState("");
  const [cookies] = useCookies([]);
  const [orders, setOrders] = useState([]);

  let abi = [
    { inputs: [], stateMutability: "nonpayable", type: "constructor" },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "approved",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "operator",
          type: "address",
        },
        {
          indexed: false,
          internalType: "bool",
          name: "approved",
          type: "bool",
        },
      ],
      name: "ApprovalForAll",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferred",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        { indexed: true, internalType: "address", name: "to", type: "address" },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      inputs: [
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "tokenId", type: "uint256" },
      ],
      name: "approve",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "owner", type: "address" }],
      name: "balanceOf",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
      name: "burn",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
      name: "getApproved",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "owner", type: "address" },
        { internalType: "address", name: "operator", type: "address" },
      ],
      name: "isApprovedForAll",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "name",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
      name: "ownerOf",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "tokenId", type: "uint256" },
      ],
      name: "safeMint",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "from", type: "address" },
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "tokenId", type: "uint256" },
      ],
      name: "safeTransferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "from", type: "address" },
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "tokenId", type: "uint256" },
        { internalType: "bytes", name: "_data", type: "bytes" },
      ],
      name: "safeTransferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "operator", type: "address" },
        { internalType: "bool", name: "approved", type: "bool" },
      ],
      name: "setApprovalForAll",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
      name: "supportsInterface",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "symbol",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "index", type: "uint256" }],
      name: "tokenByIndex",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "owner", type: "address" },
        { internalType: "uint256", name: "index", type: "uint256" },
      ],
      name: "tokenOfOwnerByIndex",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
      name: "tokenURI",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalSupply",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "from", type: "address" },
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "tokenId", type: "uint256" },
      ],
      name: "transferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];

  useEffect(() => {
    if (cookies.selected_account) setCurrentUser(cookies.selected_account);
    else NotificationManager.error("Connect Yout Metamask", "", 800);
    // eslint-disable-next-line react-hooks/exhaustive-deps

    console.log("current user is---->", currentUser, cookies.selected_account);
  }, [cookies.selected_account]);

  const fetchMetaData = async () => {
    if (address && id) {
      let contract = await exportInstanceThroughWeb3(address, abi);
      let uri = await contract.methods.tokenURI(id).call();
      let owner;
      if (currentUser)
        owner = await GetOwnerOfToken(address, id, true, currentUser);
      console.log("owner", owner);
      let data = await fetch(uri);
      data = await data.json();
      console.log("dataa", data);
      data.owner = owner;
      setNftDetails(data);

      let orders = await GetOrdersByNftId({
        nftId: "62a19b72127e078f08afa5d6",
      });
      if (orders && orders.results && orders.results.length > 0) {
        setOrders(orders.results);
        console.log("here");
      }

      console.log("orders", orders);
    }
  };

  useEffect(() => {
    fetchMetaData();
  }, [address, id, currentUser]);

  return (
    <div className="wrapper">
      <div className="row text-center container p-3">
        <div className="col-lg-6">
          <img src={nftDetails.image} className="nftImg"></img>
        </div>

        <div className="col-lg-6">
          <h4>Name</h4>
          <div>{nftDetails.name}</div>
          <h4>Description</h4>
          <div>{nftDetails.description}</div>
          <h4>Collection</h4>
          <div>{address}</div>
          <h4>Properties</h4>
          <div className="d-flex align-items-center justify-content-center flex-wrap">
            {nftDetails?.attributes && nftDetails.attributes.length > 0
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
            <button className="putonmarketplace" onClick={fetchMetaData}>
              Refresh
            </button>
          </div>
          <br></br>
          <div className="col">
            {/* <button
              className="putonmarketplace"
              onClick={async () => {
                await putOnMarketplace(currentUser, {
                  collection: address,
                  tokenId: id,
                });
              }}
            >
              {nftDetails?.owner?.toLowerCase() ===
                currentUser?.toLowerCase() && orders.length == 0
                ? "Put On Marketplace"
                : nftDetails?.owner?.toLowerCase() ===
                  currentUser?.toLowerCase()
                ? "Remove from sale"
                : "Not On Sale"}
            </button> */}
            {nftDetails?.owner?.toLowerCase() === currentUser?.toLowerCase() &&
            orders.length == 0 ? (
              <button
                className="putonmarketplace"
                onClick={async () => {
                  {
                    await putOnMarketplace(currentUser, {
                      collection: address,
                      tokenId: id,
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
                        nftDetails?.owner?.toLowerCase() ===
                          currentUser?.toLowerCase() && orders.length == 0
                          ? await putOnMarketplace(currentUser, {
                              collection: address,
                              tokenId: id,
                            })
                          : nftDetails?.owner?.toLowerCase() ===
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
                    {nftDetails?.owner?.toLowerCase() ===
                      currentUser?.toLowerCase() && orders.length == 0
                      ? "Put On Marketplace"
                      : nftDetails?.owner?.toLowerCase() ===
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
