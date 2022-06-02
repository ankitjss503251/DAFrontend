// import {
//   exportInstance,
//   GetCollectionsByAddress,
//   GetCollectionsNftList,
//   GetMyCollectionsList,
//   GetMyLikedNft,
//   GetMyNftList,
//   GetMyOnSaleNft,
//   GetNftDetails,
//   getOrderDetails,
// } from "../apiServices";
import { ethers } from "ethers";
import contracts from "../config/contracts";
// import erc20Abi from "./../config/abis/erc20.json";
// import erc721Abi from "./../config/abis/simpleERC721.json";
// import erc1155Abi from "./../config/abis/simpleERC1155.json";
// import { fetchBidNft } from "../apiServices";
// import { GENERAL_DATE, GENERAL_TIMESTAMP } from "./constants";
import NotificationManager from "react-notifications/lib/NotificationManager";

// const ipfsAPI = require("ipfs-api");
// const ipfs = ipfsAPI("ipfs.infura.io", "5001", {
//   protocol: "https",
//   auth: "21w11zfV67PHKlkAEYAZWoj2tsg:f2b73c626c9f1df9f698828420fa8439",
// });

const toTypedOrder = (
  account,
  tokenAddress,
  id,
  quantity,
  listingType,
  paymentTokenAddress,
  valueToPay,
  deadline,
  bundleTokens,
  bundleTokensQuantity,
  salt
) => {
  const domain = {
    chainId: process.env.REACT_APP_CHAIN_ID,
    name: "Decrypt Marketplace",
    verifyingContract: contracts.MARKETPLACE,
    version: "1",
  };

  const types = {
    Order: [
      { name: "user", type: "address" },
      { name: "tokenAddress", type: "address" },
      { name: "tokenId", type: "uint256" },
      { name: "quantity", type: "uint256" },
      { name: "listingType", type: "uint256" },
      { name: "paymentToken", type: "address" },
      { name: "value", type: "uint256" },
      { name: "deadline", type: "uint256" },
      { name: "bundleTokens", type: "uint256[]" },
      { name: "bundleTokensQuantity", type: "uint256[]" },
      { name: "salt", type: "uint256" },
    ],
  };

  const value = {
    user: account,
    tokenAddress: tokenAddress,
    tokenId: id,
    quantity: quantity,
    listingType: listingType,
    paymentToken: paymentTokenAddress,
    value: valueToPay,
    deadline: deadline,
    bundleTokens: bundleTokens,
    bundleTokensQuantity: bundleTokensQuantity,
    salt: salt,
  };

  return { domain, types, value };
};

export const getSignature = async (signer, ...args) => {
  try {
    console.log("111");
    const order = toTypedOrder(...args);
    console.log("order is---->", order);
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    console.log("222");
    const signer1 = provider.getSigner();
    console.log("333");
    const signedTypedHash = await signer1._signTypedData(
      order.domain,
      order.types,
      order.value
    );
    console.log("444");
    const sig = ethers.utils.splitSignature(signedTypedHash);
    console.log("555");

    return [sig.v, sig.r, sig.s];
  } catch (e) {
    if (e.code === 4001) {
      NotificationManager.error("User denied ");
      return false;
    }
    console.log("error in api", e);
    return false;
  }
};

// export const isEmpty = (obj) => {
//   return Object.keys(obj).length === 0;
// };

// export const buildSellOrder = async (id) => {
//   let details;
//   try {
//     details = await getOrderDetails({ orderId: id });
//     console.log("details 123", details.oPrice?.$numberDecimal);
//     const order = [
//       details.oSellerWalletAddress,
//       details.oTokenAddress,
//       details.oTokenId,
//       details.oQuantity,
//       details.oType,
//       details.oPaymentToken,
//       details.oPrice ? details.oPrice.$numberDecimal : "0",
//       details.oValidUpto,
//       details.oBundleTokens,
//       details.oBundleTokensQuantities,
//       details.oSalt,
//     ];

//     console.log("getOrder", order);

//     return order;
//   } catch (e) {
//     console.log("error in api", e);
//   }
// };

// export const getUsersNFTs = async (
//   paramType,
//   walletAddress,
//   userId,
//   isAuthor
// ) => {
//   console.log(
//     "here",
//     "paramType",
//     paramType,
//     "walletAddress",
//     walletAddress,
//     "userId",
//     userId,
//     "isAuthor",
//     isAuthor
//   );
//   let formattedData = [];
//   let details = [];
//   console.log("walletAddress", walletAddress);
//   if (walletAddress === "") {
//     return [];
//   }
//   let searchParams;
//   try {
//     if (paramType === 0) {
//       searchParams = {
//         userId: userId,
//         sortType: -1,
//         sortKey: "nTitle",
//         page: 1,
//         limit: 10,
//       };
//       details = await GetMyOnSaleNft(searchParams);
//     } else if (paramType === 1) {
//       searchParams = {
//         conditions: {
//           nCreater: userId,
//         },
//       };
//       details = await GetMyNftList(searchParams);
//     } else if (paramType === 2) {
//       searchParams = {
//         userId: userId,
//         length: 10,
//         start: 0,
//       };
//       details = await GetMyLikedNft(searchParams);
//     } else if (paramType === 3) {
//       searchParams = {
//         nOwnedBy: walletAddress,
//       };
//       details = await GetMyNftList(searchParams);
//     } else if (paramType === 5) {
//       searchParams = {
//         nOwnedBy: walletAddress,
//       };
//       details = await GetMyNftList(searchParams);
//     }

//     let d = [];
//     if (details && details.results && details.results?.length > 0) {
//       let arr = details.results[0];

//       if (arr) {
//         for (let i = 0; i < arr.length; i++) {
//           let resp = await ipfs.cat(arr[i].nHash);
//           d[i] = JSON.parse(resp.toString("utf8")).image;
//           console.log("Resp" + resp);
//         }

//         console.log("arrr", process.env.REACT_APP_IPFS_URL);
//         // eslint-disable-next-line array-callback-return
//         arr.map((data, key) => {
//           data.previewImg = d[key];
//           data.metaData = "#";
//           data.metaData = d[key];
//           data.deadline =
//             data.nOrders?.length > 0
//               ? data.nOrders[0].oValidUpto !== GENERAL_TIMESTAMP
//                 ? data.nOrders[0].oValidUpto
//                 : ""
//               : "";
//           data.auction_end_date =
//             data.nOrders?.length > 0
//               ? data.nOrders[0].auction_end_date !== GENERAL_DATE
//                 ? data.nOrders[0].auction_end_date
//                 : ""
//               : "";
//           data.authorLink = "#";
//           data.previewLink = "#";
//           data.nftLink = "#";
//           data.bidLink = "#";
//           data.authorImg =
//             data.nCreater && data.nCreater.sProfilePicUrl
//               ? process.env.REACT_APP_IPFS_URL + data.nCreater.sProfilePicUrl
//               : "";
//           data.title = data ? data.nTitle : "";
//           data.price = "";
//           data.bid = "";
//           data.likes = data.nUser_likes?.length;
//           data.id = data ? data._id : "";
//           formattedData.push(data);
//         });
//       }
//     }
//     console.log("formattedData", formattedData);
//     return formattedData;
//   } catch (e) {
//     console.log("error in api", e);
//   }
// };

// export const getCollections = async (isUsers) => {
//   try {
//     let result = [];
//     if (isUsers) {
//       let reqParams = { start: 0, length: 100 };
//       result = await GetMyCollectionsList(reqParams);
//     } else {
//     }
//     if (!result) return [];
//     let formattedData = [];
//     let arr = result.data;
//     arr
//       ? arr.map((data, key) => {
//           return formattedData.push({
//             collectionImage: data.sHash
//               ? "https://decryptnft.mypinata.cloud/ipfs/" + data.sHash
//               : "./img/author/author-7.jpg",
//             authorImage: data.oUser.sProfilePicUrl
//               ? "https://decryptnft.mypinata.cloud/ipfs/" +
//                 data.oUser.sProfilePicUrl
//               : "./img/author/author-7.jpg",
//             collectionName: data.sName,
//             collectionType: data.erc721 ? "ERC721" : "ERC1155",
//             collectionAddress: data.sContractAddress,
//             createdBy: data.sCreatedBy,
//             authorId: data.oUser._id,
//           });
//         })
//       : formattedData.push([]);

//     console.log("formattedData", formattedData);
//     return formattedData;
//   } catch (e) {
//     console.log("error in api", e);
//   }
// };

// export const getCountsOnProfile = async (selectedType, walletAddress) => {
//   let counts = [];

//   let res1 = await getUsersNFTs({
//     nOwnedBy: walletAddress,
//   });
//   counts.push(res1.length);
//   counts.push(res1.length);
//   counts.push(res1.length);
//   counts.push(res1.length);
//   let res2 = await getCollections(true);
//   counts.push(res2.length);
//   counts.push(res1.length);
//   return counts;
// };

// export const getNextId = async (collection) => {
//   try {
//     let details = await GetCollectionsByAddress({
//       sContractAddress: collection,
//     });
//     console.log("details collection", details);
//     return details.nextId;
//   } catch (e) {
//     console.log("error in api", e);
//   }
// };

// export const readReceipt = async (hash) => {
//   try {
//     let provider = new ethers.providers.Web3Provider(window.ethereum);
//     const receipt = await provider.getTransactionReceipt(hash.hash);
//     let contractAddress = receipt.logs[0].address;
//     return contractAddress;
//   } catch (e) {
//     console.log("error in api", e);
//   }
// };

// export const getUsersTokenBalance = async (account, tokenAddress) => {
//   let token;
//   token = await exportInstance(tokenAddress, erc20Abi);
//   let userBalance = await token.balanceOf(account);
//   console.log("token", token, "userBalance", userBalance.toString(), account);
//   return userBalance.toString();
// };

// export const getTokenNameAndSymbolByAddress = async (address) => {
//   let token = await exportInstance(address, erc20Abi);
//   let symbol = await token.symbol();
//   let name = await token.name();

//   // console.log("name", name, "symbol", symbol);
//   return {
//     symbol: symbol,
//     name: name,
//   };
// };

// export const getPaymentTokenInfo = async (userWallet, tokenAddress) => {
//   let token = await exportInstance(tokenAddress, erc20Abi);
//   console.log("token is ----->", token);
//   let symbol = await token.symbol();
//   let name = await token.name();
//   let allowance = await token.allowance(userWallet, contracts.MARKETPLACE);
//   let balance = await token.balanceOf(userWallet);
//   console.log("allowance", allowance.toString());
//   return {
//     symbol: symbol,
//     name: name,
//     balance: balance.toString(),
//     allowance: allowance.toString(),
//   };
// };

// export const checkIfLiked = async (nftId, authorId) => {
//   let nftDetails = await GetNftDetails(nftId);
//   console.log("nft details", nftDetails);
//   let data = nftDetails.nUser_likes.filter((d) => {
//     return d === authorId;
//   });
//   return data.length > 0;
// };

// export const getAllBidsByNftId = async (nftId) => {
//   let dummyData = await fetchBidNft({
//     nNFTId: nftId,
//     orderID: "All",
//     buyerID: "All",
//     bidStatus: "All",
//   });

//   let data = [];
//   console.log("dummyData---", dummyData);

//   dummyData?.data
//     ? // eslint-disable-next-line array-callback-return
//       dummyData.data.map((d, i) => {
//         data.push({
//           bidId: d._id,
//           bidQuantity: d.oBidQuantity,
//           bidPrice: d.oBidPrice.$numberDecimal,
//           seller: d.oOwner.sWalletAddress,
//           orderId: d.oOrderId,
//           bidder: d.oBidder.sWalletAddress,
//           bidderProfile: d.oBidder.sProfilePicUrl,
//           buyerSignature: d.oBuyerSignature,
//           bidderFullName: d.oBidder.oName
//             ? d.oBidder.oName.sFirstname
//             : d.oBidder
//             ? d.oBidder.sWalletAddress
//             : "Unnamed",
//           nftId: d.oNFTId,
//           owner: d.oSeller,
//         });
//       })
//     : data.push([]);

//   console.log("dummyData", data);
//   return data;
// };

// export const GetNftsByCollection = async (owned, collection) => {
//   // let status;

//   let formattedData = [];
//   let details = [];

//   let searchParams;
//   try {
//     searchParams = {
//       collection: collection,
//     };
//     console.log("collection", collection);
//     details = await GetCollectionsNftList(searchParams, owned);
//     console.log("details2", details);
//   } catch (e) {
//     console.log("Error in api", e);
//   }

//   let arr = [];
//   if (details && details.results && details.results.length > 0)
//     arr = details.results[0];
//   else return [];
//   arr
//     ? arr.map(async (data, key) => {
//         console.log("arr", data);
//         // let authorData = await GetIndividualAuthorDetail({ userId: data.nCreater });
//         formattedData[key] = {
//           deadline:
//             data && data.nOrders.length > 0
//               ? data.nOrders[0].oValidUpto !== GENERAL_TIMESTAMP
//                 ? data.nOrders[0].oValidUpto
//                 : ""
//               : "",
//           auction_end_date:
//             data && data.nOrders.length > 0
//               ? data.nOrders[0].auction_end_date !== GENERAL_DATE
//                 ? data.nOrders[0].auction_end_date
//                 : ""
//               : "",
//           authorLink: "#",
//           previewLink: "#",
//           nftLink: "#",
//           bidLink: "#",
//           authorImg: "/img/author/author-7.jpg",
//           previewImg: data.nHash
//             ? "https://decryptnft.mypinata.cloud/ipfs/" + data.nHash
//             : "/img/author/author-7.jpg",
//           title: data ? data.nTitle : "",
//           price: "",
//           bid: "",
//           likes: data.nUser_likes?.length,
//           id: data ? data._id : "",
//           // creator: authorData.sProfilePicUrl?`https://decryptnft.mypinata.cloud/ipfs/${authorData.sProfilePicUrl}`:"",
//         };
//       })
//     : (formattedData[0] = {});

//   return formattedData;
// };

// export const GetOwnerOfToken = async (
//   collection,
//   tokenId,
//   isERC721,
//   account
// ) => {
//   let collectionInstance = await exportInstance(
//     collection,
//     isERC721 ? erc721Abi.abi : erc1155Abi.abi
//   );
//   console.log("collectionInsatnce", collectionInstance);
//   let balance = 0;
//   if (isERC721) {
//     let owner = await collectionInstance.ownerOf(tokenId);
//     if (owner.toLowerCase() === account.toLowerCase()) {
//       balance = "1";
//     }
//   } else balance = await collectionInstance.balanceOf(account, tokenId);
//   console.log("balance", balance.toString());
//   return balance.toString();
// };

// export const getMaxAllowedDate = () => {
//   var dtToday = new Date();

//   var month = dtToday.getMonth() + 1;
//   var day = dtToday.getDate();
//   var year = dtToday.getFullYear();
//   if (month < 10) month = "0" + month.toString();
//   if (day < 10) day = "0" + day.toString();

//   var maxDate = year + "-" + month + "-" + day;
//   return maxDate;
// };
