import {
  exportInstance,
  //   GetCollectionsByAddress,
  //   GetCollectionsNftList,
  //   GetMyCollectionsList,
  //   GetMyLikedNft,
  //   GetMyNftList,
  //   GetMyOnSaleNft,
  //   GetNftDetails,
  getOrderDetails,
  GetOrdersByNftId,
  getAllCollections,
  GetAllUserDetails,
  getNFTList,
  viewNFTDetails,
  getBrandById,
  GetIndividualAuthorDetail,
  getCategories,
  getCategoriesWithCollectionData,
  fetchOfferNft,
  fetchOfferMade,
  GetHistory,
  fetchOfferReceived,
  getAllCollectionTabs,
} from "../apiServices";
import { ethers } from "ethers";
import contracts from "../config/contracts";
import erc20Abi from "./../config/abis/erc20.json";
import erc721Abi from "./../config/abis/simpleERC721.json";
import erc1155Abi from "./../config/abis/simpleERC1155.json";

// import { fetchBidNft } from "../apiServices";
// import { GENERAL_DATE, GENERAL_TIMESTAMP } from "./constants";
import NotificationManager from "react-notifications/lib/NotificationManager";


// const ipfsAPI = require("ipfs-api");
// const ipfs = ipfsAPI("ipfs.infura.io", "5001", {
//   protocol: "https",
//   auth: "21w11zfV67PHKlkAEYAZWoj2tsg:f2b73c626c9f1df9f698828420fa8439",
// });

// export const isEmpty = (obj) => {
//   return Object.keys(obj).length === 0;
// };

export const buildSellOrder = async (id) => {
  let details;
  try {
    details = await getOrderDetails({ orderID: id });
    console.log("details 123", details);
    const order = [
      details.sellerID?.walletAddress.toLowerCase(),
      details.collectionAddress,
      details.tokenID,
      details.total_quantity,
      details.salesType,
      details.paymentToken,
      details.price ? details.price.$numberDecimal : "0",
      details.deadline,
      details.bundleTokens,
      details.bundleTokensQuantities,
      details.salt,
    ];

    console.log("getOrder", order);

    return order;
  } catch (e) {
    console.log("error in api", e);
  }
};

export const GetOwnerOfToken = async (
  collection,
  tokenId,
  isERC721,
  account
) => {
  let collectionInstance = await exportInstance(
    collection,
    isERC721 ? erc721Abi.abi : erc1155Abi.abi
  );
  
  let balance = 0;
  if (isERC721) {
    let owner = await collectionInstance.ownerOf(tokenId);
    if (owner.toLowerCase() === account.toLowerCase()) {
      balance = "1";
    }
    console.log("owner", owner)
  } else {
    balance = await collectionInstance.balanceOf(account, tokenId);
    console.log("balance", balance.toString());
  }
 
  return balance.toString();
};

export const getPaymentTokenInfo = async (userWallet, tokenAddress) => {
  let token = await exportInstance(tokenAddress, erc20Abi);

  let symbol = await token.symbol();
  let name = await token.name();
  let allowance = await token.allowance(userWallet, contracts.MARKETPLACE);
  let balance = await token.balanceOf(userWallet);
  console.log("allowance", allowance.toString());
  return {
    symbol: symbol,
    name: name,
    balance: balance.toString(),
    allowance: allowance.toString(),
  };
};

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
    console.log("error in api 3", e);
    return false;
  }
};

export const getUsersTokenBalance = async (account, tokenAddress) => {
  let token;
  token = await exportInstance(tokenAddress, erc20Abi);
  let userBalance = await token.balanceOf(account);
  return userBalance.toString();
};

export const getAllOffersByNftId = async (nftId) => {
  let dummyData = await fetchOfferNft({
    nNFTId: nftId,
    buyerID: "All",
    bidStatus: "All",
  });

  let data = [];
  console.log("dummyData---", dummyData);

  dummyData?.data
    ? // eslint-disable-next-line array-callback-return
    dummyData.data.map((d, i) => {
      data.push({
        bidId: d._id,
        bidQuantity: d.oBidQuantity,
        bidPrice: d.oBidPrice.$numberDecimal,
        seller: d.oOwner.sWalletAddress,
        orderId: d.oOrderId,
        bidder: d.oBidder.sWalletAddress,
        bidderProfile: d.oBidder.sProfilePicUrl,
        buyerSignature: d.oBuyerSignature,
        bidderFullName: d.oBidder.oName
          ? d.oBidder.oName.sFirstname
          : d.oBidder
            ? d.oBidder.sWalletAddress
            : "Unnamed",
        nftId: d.oNFTId,
        owner: d.oSeller,
      });
    })
    : data.push([]);

  console.log("dummyData", data);
  return data;
};

export const getCollections = async (req) => {
  let data = [];
  let formattedData = [];
  try {
    let reqBody = {
      page: req.page,
      limit: req.limit,
      collectionID: req.collectionID,
      userID: req.userID,
      categoryID: req.categoryID,
      brandID: req.brandID,
      ERCType: req.ERCType,
      searchText: req.searchText,
      filterString: req.filterString,
      isMinted: req.isMinted,
      isHotCollection: req.isHotCollection,
      isExclusive: req.isExclusive,
      isOnMarketplace: req.isOnMarketplace,
    };

    data = await getAllCollections(reqBody);
  } catch (e) {
    console.log("Error in getCollections API--->", e);
  }
  let arr = [];
  if (data && data.results && data.results.length > 0) arr = data.results[0];
  else return [];
  arr
    ? arr.map((coll, key) => {
      formattedData[key] = {
        _id: coll._id,
        logoImg: coll.logoImage,
        coverImg: coll.coverImage,
        name: coll.name,
        desc: coll.description,
        saleStartTime: coll.preSaleStartTime,
        saleEndTime: coll.preSaleEndTime,
        price: coll.price.$numberDecimal,
        items: coll.nftCount,
        totalSupply: coll.totalSupply,
        contractAddress: coll.contractAddress,
        brand: coll.brandID,
        createdBy: coll.createdBy,
        link: coll.link,
        volumeTraded: coll.volumeTraded,
        count: data.count,
      };
    })
    : (formattedData[0] = {});
  return formattedData;
};

export const getNFTs = async (req) => {
  let data = [];
  let formattedData = [];
  try {
    let reqBody = {
      page: req.page,
      limit: req.limit,
      nftID: req.nftID,
      collectionID: req.collectionID,
      userID: req.userID,
      categoryID: req.categoryID,
      brandID: req.brandID,
      isLazyMinted: req.isLazyMinted,
      ERCType: req.ERCType,
      searchText: req.searchText,
      isMinted: req.isMinted,
      isOnMarketplace: req.isOnMarketplace,
      salesType: req.salesType,
      priceSort: req.priceSort
    };

    data = await getNFTList(reqBody);
  } catch (e) {
    console.log("Error in getNFts API--->", e);
  }
  let count = data.count;
  data = data.results;
  let arr = [];
  if (data && data.length > 0) arr = data;
  else return [];
  arr
    ? arr.map((nft, key) => {
      formattedData[key] = {
        id: nft?._id,
        image: nft?.image,
        name: nft?.name,
        desc: nft?.description,
        collectionAddress: nft?.collectionAddress,
        ownedBy: nft?.ownedBy,
        like:
          nft?.user_likes?.length === undefined ? 0 : nft?.user_likes?.length,
        Qty: nft?.totalQuantity,
        collection: nft?.collectionID,
        assetsInfo: nft?.assetsInfo[0],
        catergoryInfo: nft?.categoryID,
        tokenId: nft?.tokenID,
        createdBy: nft?.createdBy,
        type: nft?.type,
        attributes: nft?.attributes,
        totalQuantity: nft?.totalQuantity,
        fileType: nft?.fileType,
        collectionData: nft?.CollectionData,
        orderData: nft?.OrderData,
        brandData: nft?.BrandData[0],
        count: count,
        previewImg: nft?.previewImg
      };
    })
    : (formattedData[0] = {});
  return formattedData;
};

export const getNFTDetails = async (req) => {
  let data = [];
  let formattedData = [];
  try {
    let reqBody = {
      nftID: req.nftID,
    };

    data = await viewNFTDetails(reqBody);
  } catch (e) {
    console.log("Error in getNFts API--->", e);
  }

  let arr = [];
  if (data && data.length > 0) arr = data;
  else return [];
  arr
    ? arr.map((nft, key) => {
      formattedData[key] = {
        id: nft._id,
        image: nft.image,
        name: nft.name,
        desc: nft.description,
        collectionAddress: nft.collectionAddress,
        ownedBy: nft.ownedBy,
        like:
          nft.user_likes?.length === undefined ? 0 : nft.user_likes?.length,
        Qty: nft.totalQuantity,
        collection: nft.collectionID,
        assetsInfo: nft?.assetsInfo[0],
        catergoryInfo: nft?.categoryID,
        tokenId: nft.tokenID,
        createdBy: nft.createdBy,
        type: nft.type,
        attributes: nft.attributes,
        totalQuantity: nft.totalQuantity,
        fileType: nft.fileType,
        collectionData: nft.CollectionData,
        OrderData: nft.OrderData
      };
    })
    : (formattedData[0] = {});
  return formattedData;
};

export const getAuthors = async () => {
  let data = [];
  let formattedData = [];
  try {
    let reqBody = {
      page: 1,
      limit: 12,
      searchText: "",
    };
    data = await GetAllUserDetails(reqBody);
  } catch (e) {
    console.log("Error in getAllUserDetails API--->", e);
  }
  let arr = [];
  if (data && data.results && data.results.length > 0) arr = data.results[0];
  else return [];
  arr
    ? arr.map((author, key) => {
      formattedData[key] = {
        _id: author._id,
        profile: author.profileIcon,
        name: author.username,
      };
    })
    : (formattedData[0] = {});
  return formattedData;
};

export const getOrderByNftID = async (reqBody) => {
  let data = [];

  try {
    data = await GetOrdersByNftId(reqBody);
  } catch (e) {
    console.log("Error in getOrderByNftID API", e);
  }

  return data;
};

export const getBrandDetailsById = async (brandID) => {
  let brand = [];
  try {
    brand = await getBrandById(brandID);
  } catch (e) {
    console.log("Error in getBrandByID API", e);
  }
  return brand;
};

export const getUserById = async (reqBody) => {
  let user = [];
  try {
    user = await GetIndividualAuthorDetail(reqBody);
  } catch (e) {
    console.log("Error in getUserByID API", e);
  }
  return user;
};

export const getCategory = async (data) => {
  let category = [];
  try {
    category = await getCategories(data);
  } catch (e) {
    console.log("Error in getCategory API", e);
  }

  return category;
};

export const getPrice = async (data) => {
  let order = {};
  let min = "000000000000000";
  try {
    if (data) {
      data.map((i) => {
        if (min < i.price.$numberDecimal) {
          min = i.price.$numberDecimal;
          order = i;
        }
      });
    }
    return order;
  } catch (e) {
    console.log("Error in getting nft order details", e);
  }
};


export const getOfferMade = async (req) => {

  let formattedData = [];
  let data = [];
  try {
    let reqBody = {
      page: req.page,
      limit: req.limit,
      userID: req.userID
    };

    data = await fetchOfferMade(reqBody);
  } catch (e) {
    console.log("Error in getOfferMade API--->", e);
  }

  let arr = [];
  if (data && data.count > 0) arr = data.results;
  else return [];
  arr
    ? arr.map((order, key) => {
      formattedData[key] = {
        bidderAddress: order?.BidderData[0]?.walletAddress,
        sellerAddress: order?.OwnerData[0]?.walletAddress,
        bidPrice: order?.bidPrice?.$numberDecimal,
        bidDeadline: order?.bidDeadline,
        nftData: order?.nftsData[0]?._id,
        bidStatus: order?.bidStatus,
        paymentToken: order?.paymentToken,
        createdOn: order?.createdOn
      }
    })
    : (formattedData[0] = {});
  return formattedData;
}


export const getOfferReceived = async (req) => {
  let formattedData = [];
  let data = [];
  try {
    let reqBody = {
      page: req.page,
      limit: req.limit,
      userWalletAddress: req.userWalletAddress
    };

    data = await fetchOfferReceived(reqBody);
  } catch (e) {
    console.log("Error in getOfferMade API--->", e);
  }

  let arr = [];
  if (data && data.count > 0) arr = data.results;
  else return [];
  arr
    ? arr.map((order, key) => {
      formattedData[key] = {
        bidderAddress: order?.BidderData[0]?.walletAddress,
        sellerAddress: order?.OwnerData[0]?.walletAddress,
        bidPrice: order?.bidPrice?.$numberDecimal,
        bidDeadline: order?.bidDeadline,
        nftData: order?.nftsData[0]?._id,
        bidStatus: order?.bidStatus,
        paymentToken: order?.paymentToken,
        createdOn: order?.createdOn
      }
    })
    : (formattedData[0] = {});
  return formattedData;
}

export const fetchHistory = async (req) => {
  let formattedData = [];
  let data = [];
  try {
    let reqBody = {
      page: req.page,
      limit: req.limit,
      nftID: req.nftID,
      collectionID: req.collectionID,
      brandID: req.brandID,
      userID: req.userID
    };

    data = await GetHistory(reqBody);
  } catch (e) {
    console.log("Error in fetchHistory API--->", e);
  }
  let arr = [];
  if (data && data.count > 0) arr = data.results;
  else return [];
  arr
    ? arr.map((h, key) => {
      formattedData[key] = {
        nftID: h?.nftsData[0]?._id,
        nftName: h?.nftsData[0]?.name,
        buyerAddress: h?.BuyerData?.length > 0 ? h?.BuyerData[0]?.walletAddress : "",
        sellerAddress: h?.SellerData?.length > 0 ? h?.SellerData[0]?.walletAddress : "",
        action: h?.action,
        type: h?.type,
        price: h?.price?.$numberDecimal,
        quantity: h?.quantity,
        paymentToken: h?.paymentToken,
        createdOn: h?.createdOn,
        nftImg: h?.nftsData[0]?.image
      }
    })
    : (formattedData[0] = {});
  return formattedData;
}

export const getCategoryWithCollectionData = async (data) => {
  let category = [];
  try {
    category = await getCategoriesWithCollectionData(data);
  } catch (e) {
    console.log("Error in getCategoryWithCollectionData API", e);
  }
  return category;
};

export const getCollectionTabs = async (req) => {
  let data = [];
  try {
    let reqBody = {
      page: req.page,
      limit: req.limit,
      collectionID: req.collectionID,
      userID: req.userID,
      categoryID: req.categoryID,
      brandID: req.brandID,
      ERCType: req.ERCType,
      searchText: req.searchText,
      filterString: req.filterString,
      isMinted: req.isMinted,
      isHotCollection: req.isHotCollection,
      isExclusive: req.isExclusive,
      isOnMarketplace: req.isOnMarketplace,
    };
    data = await getAllCollectionTabs(reqBody);
  } catch (e) {
    console.log("Error in getCollections API--->", e);
  }
  return data;
};






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

// export const checkIfLiked = async (nftId, authorId) => {
//   let nftDetails = await GetNftDetails(nftId);
//   console.log("nft details", nftDetails);
//   let data = nftDetails.nUser_likes.filter((d) => {
//     return d === authorId;
//   });
//   return data.length > 0;
// };
