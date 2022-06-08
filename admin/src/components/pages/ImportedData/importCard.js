import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  exportInstance,
  exportInstanceThroughWeb3,
  getImportedCollections,
  getImportedNFTs,
  importCollection,
  importNft,
} from "../../../apiServices";
import erc721Abi from "../../../config/abis/simpleERC721.json";
import erc1155Abi from "../../../config/abis/simpleERC1155.json";
import { GetOwnerOfToken } from "../../../helpers/getterFunctions";
import multicall from "../../../helpers/Multicall";
import { isEmptyObject } from "jquery";

const ImportCard = () => {
  let { address } = useParams();
  const [authors, setAuthors] = useState([]);
  const [totalSupply, setTotalSupply] = useState(0);

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
          name: "delegator",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "fromDelegate",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "toDelegate",
          type: "address",
        },
      ],
      name: "DelegateChanged",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "delegate",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "previousBalance",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "newBalance",
          type: "uint256",
        },
      ],
      name: "DelegateVotesChanged",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "minMint",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "maxMint",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "minting_fee",
          type: "uint256",
        },
      ],
      name: "NewStage",
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
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "stage",
          type: "uint256",
        },
      ],
      name: "UpdateStage",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "account",
          type: "address",
        },
        { indexed: false, internalType: "bool", name: "value", type: "bool" },
      ],
      name: "UpdateWhitelists",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "account",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "balance",
          type: "uint256",
        },
      ],
      name: "Withdraw",
      type: "event",
    },
    {
      inputs: [],
      name: "DELEGATION_TYPEHASH",
      outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "DOMAIN_TYPEHASH",
      outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "MAX_SUPPLY",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "addressBalance",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
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
      inputs: [
        { internalType: "address", name: "", type: "address" },
        { internalType: "uint32", name: "", type: "uint32" },
      ],
      name: "checkpoints",
      outputs: [
        { internalType: "uint32", name: "fromBlock", type: "uint32" },
        { internalType: "uint96", name: "votes", type: "uint96" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "decimals",
      outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "delegatee", type: "address" }],
      name: "delegate",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "delegatee", type: "address" },
        { internalType: "uint256", name: "nonce", type: "uint256" },
        { internalType: "uint256", name: "expiry", type: "uint256" },
        { internalType: "uint8", name: "v", type: "uint8" },
        { internalType: "bytes32", name: "r", type: "bytes32" },
        { internalType: "bytes32", name: "s", type: "bytes32" },
      ],
      name: "delegateBySig",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "delegator", type: "address" }],
      name: "delegates",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "flipSaleState",
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
      inputs: [{ internalType: "address", name: "account", type: "address" }],
      name: "getCurrentVotes",
      outputs: [{ internalType: "uint96", name: "", type: "uint96" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "account", type: "address" },
        { internalType: "uint256", name: "blockNumber", type: "uint256" },
      ],
      name: "getPriorVotes",
      outputs: [{ internalType: "uint96", name: "", type: "uint96" }],
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
      inputs: [
        { internalType: "uint256", name: "numberOfTokens", type: "uint256" },
      ],
      name: "mint",
      outputs: [],
      stateMutability: "payable",
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
      name: "nextOwnerToExplicitlySet",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "", type: "address" }],
      name: "nonces",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "", type: "address" }],
      name: "numCheckpoints",
      outputs: [{ internalType: "uint32", name: "", type: "uint32" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "numberMinted",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
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
      inputs: [],
      name: "saleIsActive",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
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
      inputs: [{ internalType: "string", name: "baseURI", type: "string" }],
      name: "setBaseURI",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      name: "stage",
      outputs: [
        { internalType: "uint256", name: "minMint", type: "uint256" },
        { internalType: "uint256", name: "maxMint", type: "uint256" },
        { internalType: "uint256", name: "minting_fee", type: "uint256" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "stageNow",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
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
    {
      inputs: [{ internalType: "uint256", name: "_stage", type: "uint256" }],
      name: "updateStage",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "_account", type: "address" }],
      name: "updateWhitelist",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "delegator", type: "address" }],
      name: "votesToDelegate",
      outputs: [{ internalType: "uint96", name: "", type: "uint96" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "", type: "address" }],
      name: "whitelist",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "withdraw",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];

  const fetchTokens = async () => {
    try {
      const token = await exportInstanceThroughWeb3(address, abi);
      let dbSupply = totalSupply;
      let originalSupply = await token.methods.totalSupply().call();
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
        setTotalSupply(result.totalSupply);
        console.log("in if");
        _nfts = _nfts.results[0];
        setAuthors(_nfts);
        console.log("nfts", _nfts);
        // setAuthors(nfts);
      } else {
        if (result && result.results && result.results.length > 0) {
          dbSupply = result.results[0][0].totalSupply;
        }
        console.log("in else");
        try {
          await importCollection({
            address: address,
            totalSupply: originalSupply,
          });
        } catch (e) {
          console.log("e", e);
          return;
        }
        console.log("token", dbSupply);
        let calls = [];
        let data = [];
        let ids = [];
        for (let i = dbSupply; i < originalSupply; i++) {
          let tokenId = await token.methods.tokenByIndex(i).call();
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
        console.log("here1", res[0], dbSupply, originalSupply);
        for (let i = dbSupply; i < originalSupply; i++) {
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
            totalSupply: originalSupply,
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
