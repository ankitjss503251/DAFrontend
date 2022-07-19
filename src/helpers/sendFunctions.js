import { BigNumber } from "bignumber.js";
import { ethers } from "ethers";
import { NotificationManager } from "react-notifications";
import {
  GENERAL_TIMESTAMP,
  MAX_ALLOWANCE_AMOUNT,
  ZERO_ADDRESS,
} from "./constants";
import erc20Abi from "./../config/abis/erc20.json";
import erc1155Abi from "./../config/abis/simpleERC1155.json";

import {
  GetOwnerOfToken,
  getPaymentTokenInfo,
  getUsersTokenBalance,
} from "./getterFunctions";
import {
  exportInstance,
  getOrderDetails,
  UpdateOrder,
  DeleteOrder,
  createOrder,
  createBidNft,
  acceptBid,
  createOfferNFT,
  updateBidNft,
} from "../apiServices";
import marketPlaceABI from "./../config/abis/marketplace.json";
import contracts from "./../config/contracts";
import { buildSellOrder, getSignature } from "./getterFunctions";
import { convertToEth } from "./numberFormatter";
import erc721Abi from "./../config/abis/simpleERC721.json";
import { slowRefresh } from "./NotifyStatus";
import { isEmptyObject } from "jquery";

export const handleBuyNft = async (
  id,
  isERC721,
  account,
  balance,
  qty = 1,
  LazyMintingStatus,
  collectionId
) => {
  let order;
  let details;
  let marketplace;
  try {
    order = await buildSellOrder(id);
    details = await getOrderDetails({ orderId: id });
  } catch (e) {
    console.log("error in API", e);
    return false;
  }

  let sellerOrder = [];
  let buyerOrder = [];
  let amount = new BigNumber(order[6].toString())
    .multipliedBy(new BigNumber(qty.toString()))
    .toString();

  let NFTcontract = await exportInstance(
    order[1],
    isERC721 ? erc721Abi.abi : erc1155Abi.abi
  );

  for (let key = 0; key < 11; key++) {
    switch (key) {
      case 0:
        if (isERC721) {
          sellerOrder.push(order[key]?.toLowerCase());
          buyerOrder.push(account?.toLowerCase());
          break;
        } else {
          sellerOrder.push(order[key]);
          buyerOrder.push(account?.toLowerCase());
          break;
        }
      case 1:
        sellerOrder.push(order[key]);
        buyerOrder.push(order[key]);
        break;
      case 3:
        if (isERC721) {
          sellerOrder.push(order[key]);
          buyerOrder.push(order[key]);
        } else {
          sellerOrder.push(order[key]);
          buyerOrder.push(Number(qty));
        }

        break;
      case 5:
        sellerOrder.push(order[key]);
        buyerOrder.push(order[key]);
        break;
      case 6:
        if (isERC721) {
          sellerOrder.push(order[key]);
          buyerOrder.push(order[key]);
        } else {
          buyerOrder.push(amount);
          sellerOrder.push(order[key]);
        }

        break;
      case 8:
        sellerOrder.push([]);
        buyerOrder.push([]);
        break;
      case 9:
        sellerOrder.push([]);
        buyerOrder.push([]);
        break;
      default:
        sellerOrder.push(parseInt(order[key]));
        buyerOrder.push(parseInt(order[key]));
    }
  }
  if (buyerOrder[5] !== ZERO_ADDRESS) {
    try {
      let allowance = await getPaymentTokenInfo(buyerOrder[0], buyerOrder[5]);
      //check user's payment token balance
      if (
        new BigNumber(amount).isGreaterThan(new BigNumber(allowance.balance))
      ) {
        NotificationManager.error("Don't have sufficient funds");
        return false;
      }

      if (
        new BigNumber(allowance.allowance).isLessThan(
          new BigNumber(buyerOrder[6])
        )
      ) {
        let approveRes = await handleApproveToken(buyerOrder[0], buyerOrder[5]);

        if (approveRes === false) {
          return false;
        }
      }
    } catch (err) {
      console.log("error", err);
      return;
    }
  }

  try {
    let usrHaveQuantity = await GetOwnerOfToken(
      sellerOrder[1],
      sellerOrder[2],
      isERC721,
      sellerOrder[0]
    );
    if (Number(usrHaveQuantity) < Number(buyerOrder[3])) {
      NotificationManager.error("Seller don't own that much quantity");
      return false;
    }
  } catch (e) {
    console.log("error", e);
    return false;
  }

  // check if seller still owns that much quantity of current token id
  // check if seller still have approval for marketplace
  // check if buyer have sufficient matic or not (fixed sale)

  let approval = await NFTcontract.isApprovedForAll(
    sellerOrder[0],
    contracts.MARKETPLACE
  );

  if (!approval) {
    NotificationManager.error("Seller didn't approved marketplace");
    return false;
  }

  let signature = details.signature;
  let options;

  try {
    marketplace = await exportInstance(
      contracts.MARKETPLACE,
      marketPlaceABI.abi
    );

    options = {
      from: account,
      gasLimit: 9000000,
      value: sellerOrder[5] === ZERO_ADDRESS ? amount : 0,
    };

    let completeOrder = await marketplace.completeOrder(
      sellerOrder,
      signature,
      buyerOrder,
      signature,
      options
    );
    let res = await completeOrder.wait();
    if (res.status === 0) {
      return false;
    }
  } catch (e) {
    console.log("error in contract function calling", e);
    if (e.code === 4001) {
      NotificationManager.error("User denied ");
      return false;
    }
    return false;
  }

  try {
    if (isERC721) {
      await UpdateOrder({
        orderId: id,
        nftID: details.nftID._id, //to make sure we update the quantity left : NFTid
        seller: details.sellerID.walletAddress?.toLowerCase(), //to make sure we update the quantity left : walletAddress
        qtyBought: Number(qty),
        qty_sold: Number(details.quantity_sold) + Number(qty),
        buyer: account?.toLowerCase(),
        LazyMintingStatus:
          details.nftID.quantity_minted + qty === details.nftID.totalQuantity
            ? 0
            : 1,
        quantity_minted:
          details.nftID.quantity_minted === details.nftID.totalQuantity
            ? details.nftID.quantity_minted
            : details.nftID.quantity_minted + qty,
      });
      DeleteOrder({ orderID: id });
    } else {
      await UpdateOrder({
        orderId: id,
        nftID: details.nftID._id, //to make sure we update the quantity left : NFTid
        seller: details.sellerID.walletAddress, //to make sure we update the quantity left : walletAddress
        qtyBought: Number(qty),
        qty_sold: Number(details.quantity_sold) + Number(qty),
        buyer: account?.toLowerCase(),
        LazyMintingStatus:
          details.nftID.quantity_minted + qty === details.nftID.totalQuantity
            ? 0
            : 1,
        quantity_minted:
          details.nftID.quantity_minted === details.nftID.totalQuantity
            ? details.nftID.quantity_minted
            : details.nftID.quantity_minted + qty,
      });

      if (
        Number(details.quantity_sold) + Number(qty) >=
        details.total_quantity
      ) {
        try {
          await DeleteOrder({ orderID: id });
        } catch (e) {
          console.log("error in updating order data", e);
          return false;
        }
      }
    }
  } catch (e) {
    console.log("error in updating order data", e);
    return false;
  }

  NotificationManager.success("NFT Purchased Successfully");
  slowRefresh(1000);
};

export const handleApproveToken = async (userAddress, tokenAddress) => {
  try {
    let token = await exportInstance(tokenAddress, erc20Abi);
    const options = {
      from: userAddress,
      gasLimit: 9000000,
      value: 0,
    };
    let res = await token.approve(
      contracts.MARKETPLACE,
      MAX_ALLOWANCE_AMOUNT,
      options
    );
    res = await res.wait();
    if (res.status === 1) {
      NotificationManager.success("Approved");
      return res;
    }
  } catch (e) {
    console.log("error in contract function calling", e);
    if (e.code === 4001) {
      NotificationManager.error("User denied ");
      return false;
    }
  }
};

export const putOnMarketplace = async (account, orderData) => {
  if (!account) {
    return false;
  }
  let nextId = await orderData.tokenId;
  let _deadline = GENERAL_TIMESTAMP;
  let _price;
  let sellerOrder;
  try {
    if (orderData.chosenType === 0) {
      _deadline = GENERAL_TIMESTAMP;
      _price = ethers.utils.parseEther(orderData.price).toString();
    } else if (orderData.chosenType === 1) {
      let endTime = new Date(orderData.endTime).valueOf() / 1000;
      _deadline = endTime;
      _price = ethers.utils.parseEther(orderData.minimumBid).toString();
    } else if (orderData.chosenType === 2) {
      _deadline = GENERAL_TIMESTAMP;
      _price = ethers.utils.parseEther(orderData.minimumBid).toString();
    }
    sellerOrder = [
      account,
      orderData.collection,
      Number(orderData.tokenId),
      Number(orderData.quantity),
      orderData.saleType,
      orderData.tokenAddress
        ? orderData.tokenAddress
        : "0x0000000000000000000000000000000000000000",
      _price,
      _deadline,
      [],
      [],
      orderData.salt,
    ];

    // let usrHaveQuantity = await GetOwnerOfToken(
    //   sellerOrder[1],
    //   sellerOrder[2],
    //   orderData.erc721,
    //   sellerOrder[0]
    // );

    // if (parseInt(usrHaveQuantity) < parseInt(orderData.quantity)) {
    //   NotificationManager.error("Not enough quantity", "", 800);
    //   return false;
    // }

    let NFTcontract = await exportInstance(orderData.collection, erc721Abi.abi);

    let approval = await NFTcontract.isApprovedForAll(
      account,
      contracts.MARKETPLACE
    );
    let approvalres;
    const options = {
      from: account,
      gasPrice: 10000000000,
      gasLimit: 9000000,
      value: 0,
    };

    if (!approval) {
      approvalres = await NFTcontract.setApprovalForAll(
        contracts.MARKETPLACE,
        true,
        options
      );
      approvalres = await approvalres.wait();
      if (approvalres.status === 0) {
        NotificationManager.error("Transaction failed");
        return false;
      }
    }
  } catch (e) {
    if (e.code === 4001) {
      NotificationManager.error("User denied ");
      return false;
    }
    console.log("error in contract", e);
    NotificationManager.error("Transaction failed");
    return false;
  }
  try {
    let signature = [];

    signature = await getSignature(account, ...sellerOrder);
    if (signature === false) {
      return false;
    }

    let reqParams = {
      nftID: orderData.nftId,
      seller: account,
      tokenAddress: orderData?.tokenAddress
        ? orderData.tokenAddress?.toLowerCase()
        : "0x0000000000000000000000000000000000000000",
      collectionAddress: orderData.collection?.toLowerCase(),
      price: _price,
      quantity: Number(orderData.quantity),
      saleType: Number(orderData.saleType),
      deadline: Number(_deadline),
      signature: signature,
      tokenID: Number(orderData.tokenId),
      salt: orderData.salt,
    };

    await createOrder(reqParams);

    NotificationManager.success("Order created successfully");
    slowRefresh(1000);
  } catch (err) {
    console.log("error in Api", err);
    return false;
  }
};

export const handleRemoveFromSale = async (orderId, account) => {
  let marketplace;
  let order;
  let details;
  try {
    marketplace = await exportInstance(
      contracts.MARKETPLACE,
      marketPlaceABI.abi
    );
    const options = {
      from: account,
      gasLimit: 9000000,
      value: "0",
    };
    order = await buildSellOrder(orderId);
    details = await getOrderDetails({ orderId: orderId });
    let res = await marketplace.cancelOrder(order, details.signature, options);
    res = await res.wait();
    if (res.status === 0) {
      NotificationManager.error("Transaction failed");
      return false;
    }
  } catch (e) {
    console.log("error in contract function call", e);
    if (e.code === 4001) {
      NotificationManager.error("User denied ");
      return false;
    }
    return false;
  }
  try {
    await DeleteOrder({
      orderID: orderId,
    });
    NotificationManager.success("Removed from sale successfully");
    slowRefresh(1000);
  } catch (e) {
    console.log("error while updating database", e);
    return false;
  }
};

export const createBid = async (
  nftID,
  orderID,
  ownerAccount,
  buyerAccount,
  erc721,
  qty = 1,
  bidPrice,
  isOffer = false
) => {
  console.log("ownerAccount", ownerAccount);
  let SellerOrder;
  let sellerOrder = [];
  let buyerOrder = [];
  try {
    SellerOrder = await buildSellOrder(orderID);
    for (let index = 0; index < 11; index++) {
      switch (index) {
        case 0:
          sellerOrder.push(SellerOrder[index]);
          buyerOrder.push(buyerAccount);
          break;
        case 1:
          sellerOrder.push(SellerOrder[index]);
          buyerOrder.push(SellerOrder[index]);
          break;
        case 2:
          sellerOrder.push(Number(SellerOrder[index]));
          buyerOrder.push(Number(SellerOrder[index]));
          break;
        case 3:
          sellerOrder.push(SellerOrder[index]);
          buyerOrder.push(Number(qty));
          break;
        case 5:
          sellerOrder.push(SellerOrder[index]);
          buyerOrder.push(SellerOrder[index]);
          break;
        case 6:
          sellerOrder.push(SellerOrder[index]);
          buyerOrder.push(
            new BigNumber(bidPrice.toString())
              .multipliedBy(new BigNumber(qty.toString()))
              .toString()
          );

          break;
        case 7:
          sellerOrder.push(SellerOrder[index]);
          buyerOrder.push(SellerOrder[index]);
          break;
        case 8:
          sellerOrder.push([]);
          buyerOrder.push([]);
          break;
        case 9:
          sellerOrder.push([]);
          buyerOrder.push([]);
          break;
        default:
          sellerOrder.push(parseInt(SellerOrder[index]));
          buyerOrder.push(parseInt(SellerOrder[index]));
      }
    }

    try {
      let allowance = (
        await getPaymentTokenInfo(buyerAccount, sellerOrder[5])
      ).allowance.toString();

      let userTokenBal = await getUsersTokenBalance(
        buyerOrder[0],
        buyerOrder[5]
      );

      // let usrHaveQuantity = await GetOwnerOfToken(
      //   sellerOrder[1],
      //   sellerOrder[2],
      //   erc721,
      //   sellerOrder[0]
      // );

      // if (parseInt(usrHaveQuantity) < qty) {
      //   NotificationManager.error("Not enough quantity", "", 800);
      //   return false;
      // }

      if (
        new BigNumber(bidPrice)
          .multipliedBy(new BigNumber(qty.toString()))
          .isGreaterThan(new BigNumber(userTokenBal))
      ) {
        NotificationManager.error("User don't have sufficient token balance");
        return false;
      }

      if (
        new BigNumber(allowance).isLessThan(
          new BigNumber(bidPrice.toString().toString())
            .multipliedBy(new BigNumber(qty.toString()))
            .toString()
        )
      ) {
        let approvalRes = await handleApproveToken(
          buyerOrder[0],
          buyerOrder[5]
        );
        if (approvalRes === false) return false;
      }

      let signature = await getSignature(buyerAccount, ...buyerOrder);
      if (signature === false) return false;
      if (signature) {
        let reqParams = {
          owner: ownerAccount,
          bidStatus: "Bid",
          bidPrice: bidPrice.toString(),
          nftID: nftID,
          orderID: orderID,
          bidQuantity: Number(qty),
          buyerSignature: signature,
          isOffer: isOffer,
          bidDeadline: SellerOrder[7],
        };
        await createBidNft(reqParams);
      }

      // window.location.reload();
    } catch (e) {
      console.log("error in api", e);
      return false;
    }
  } catch (e) {
    console.log("error in api", e);
    return false;
  }
};

export const createOffer = async (
  tokenId,
  collectionAddress,
  ownerAccount,
  buyerAccount,
  erc721,
  qty,
  bidPrice,
  deadline,
  nftID,
  paymentToken
) => {
  let buyerOrder = [];
  try {
    buyerOrder.push(buyerAccount);
    buyerOrder.push(collectionAddress);
    buyerOrder.push(parseInt(tokenId));
    buyerOrder.push(parseInt(qty));
    buyerOrder.push(1);
    buyerOrder.push(paymentToken);
    buyerOrder.push(bidPrice.toString());
    buyerOrder.push(deadline);
    buyerOrder.push([]);
    buyerOrder.push([]);
    buyerOrder.push(Math.round(Math.random() * 10000000));

    let allowance = (
      await getPaymentTokenInfo(buyerAccount, buyerOrder[5])
    ).allowance.toString();

    let userTokenBal = await getUsersTokenBalance(buyerOrder[0], buyerOrder[5]);

    // let usrHaveQuantity = await GetOwnerOfToken(
    //   buyerOrder[1],
    //   buyerOrder[2],
    //   1,
    //   buyerOrder[0]
    // );

    if (
      new BigNumber(bidPrice)
        .multipliedBy(new BigNumber(qty.toString()))
        .isGreaterThan(new BigNumber(userTokenBal))
    ) {
      NotificationManager.error("User don't have sufficient token balance");
      return false;
    }

    if (
      new BigNumber(allowance).isLessThan(
        new BigNumber(bidPrice.toString().toString())
          .multipliedBy(new BigNumber(qty.toString()))
          .toString()
      )
    ) {
      let approvalRes = await handleApproveToken(buyerOrder[0], buyerOrder[5]);
      if (approvalRes === false) return false;
    }

    try {
      let signature = await getSignature(buyerAccount, ...buyerOrder);
      if (signature === false) return false;
      if (signature) {
        let reqParams = {
          owner: ownerAccount,
          bidStatus: "MakeOffer",
          bidPrice: bidPrice.toString(),
          nftID: nftID,
          bidDeadline: deadline,
          bidQuantity: Number(qty),
          buyerSignature: signature,
          tokenAddress: collectionAddress,
          salt: buyerOrder[10],
          paymentToken: paymentToken,
        };

        try {
          let offer = await createOfferNFT(reqParams);
          if (!isEmptyObject(offer)) {
            NotificationManager.success("Offer Placed Successfully");
            slowRefresh(1000);
          } else {
            NotificationManager.error("Something Went Wrong!");
            return false;
          }
        } catch (e) {
          NotificationManager.error("Failed");
          return false;
        }
      }
    } catch (e) {
      console.log("error in api 1", e);
      return false;
    }
  } catch (e) {
    console.log("error in api 2", e);
    return false;
  }
};

export const handleAcceptBids = async (
  bidData,
  isERC721,
  LazyMintingStatus = 0
) => {
  let order;
  let details;
  let options;
  try {
    order = await buildSellOrder(bidData.orderID);
    details = await getOrderDetails({ orderId: bidData.orderID });
  } catch (e) {
    console.log("error in API", e);
    return false;
  }
  let buyerOrder = [];
  let sellerOrder = [];

  let amount = new BigNumber(bidData?.bidPrice?.$numberDecimal.toString())
    .multipliedBy(new BigNumber(bidData.bidQuantity.toString()))
    .toString();

  for (let key = 0; key < 11; key++) {
    switch (key) {
      case 0:
        sellerOrder.push(order[key]);
        buyerOrder.push(bidData?.bidderID?.walletAddress);
        break;

      case 1:
        sellerOrder.push(order[key]);
        buyerOrder.push(order[key]);
        break;
      case 3:
        if (isERC721) {
          sellerOrder.push(Number(order[key]));
          buyerOrder.push(Number(order[key]));
        } else {
          sellerOrder.push(Number(order[key]));
          buyerOrder.push(Number(bidData.bidQuantity));
        }

        break;
      case 5:
        sellerOrder.push(order[key]);
        buyerOrder.push(order[key]);
        break;
      case 6:
        buyerOrder.push(amount);
        sellerOrder.push(order[key]);

        break;
      case 7:
        buyerOrder.push(order[key]);
        sellerOrder.push(order[key]);

        break;
      case 8:
        sellerOrder.push([]);
        buyerOrder.push([]);
        break;
      case 9:
        sellerOrder.push([]);
        buyerOrder.push([]);
        break;
      default:
        sellerOrder.push(parseInt(parseInt(order[key])));
        buyerOrder.push(parseInt(parseInt(order[key])));
    }
  }

  let sellerSignature = details.signature;
  let buyerSignature = bidData.buyerSignature;

  let NFTcontract = await exportInstance(
    sellerOrder[1],
    isERC721 ? erc721Abi.abi : erc1155Abi.abi
  );

  let approval = await NFTcontract.isApprovedForAll(
    sellerOrder[0],
    contracts.MARKETPLACE
  );

  if (!LazyMintingStatus) {
    // let usrHaveQuantity = await GetOwnerOfToken(
    //   sellerOrder[1],
    //   sellerOrder[2],
    //   isERC721,
    //   sellerOrder[0]
    // );
    // if (Number(usrHaveQuantity) < Number(buyerOrder[3])) {
    //   NotificationManager.error("Seller don't own that much quantity");
    //   return false;
    // }
  }

  if (!approval) {
    NotificationManager.error("Seller didn't approved marketplace");
    return false;
  }
  if (buyerOrder[5] === ZERO_ADDRESS) {
  } else {
    let paymentTokenData = await getPaymentTokenInfo(
      buyerOrder[0],
      buyerOrder[5]
    );

    if (
      new BigNumber(paymentTokenData.balance).isLessThan(
        new BigNumber(order[6].toString()).multipliedBy(
          new BigNumber(buyerOrder[3].toString())
        )
      )
    ) {
      NotificationManager.error("Buyer don't have enough Tokens");
      return false;
    }
  }
  try {
    let marketplace = await exportInstance(
      contracts.MARKETPLACE,
      marketPlaceABI.abi
    );
    let completeOrder;
    try {
      options = {
        from: sellerOrder[0],
        gasPrice: 10000000000,
        gasLimit: 9000000,
        value: 0,
      };
      completeOrder = await marketplace.completeOrder(
        sellerOrder,
        sellerSignature,
        buyerOrder,
        buyerSignature,
        options
      );
      completeOrder = await completeOrder.wait();
      if (completeOrder.status === 0) {
        // NotificationManager.error("Transaction Failed");
        return false;
      } else {
        // NotificationManager.success("Transaction successful");
      }
    } catch (e) {
      console.log("error in contract", e);
      return false;
    }

    try {
      await UpdateOrder({
        orderID: bidData.orderID[0]?._id,
        nftID: details?.nftID?._id, //to make sure we update the quantity left : NFTid
        seller: details?.sellerID?.walletAddress, //to make sure we update the quantity left : walletAddress
        qtyBought: Number(bidData.bidQuantity),
        qty_sold: Number(details.quantity_sold) + Number(bidData.bidQuantity),
        buyer: buyerOrder[0]?.toLowerCase(),
      });

      if (
        Number(details.quantity_sold) + Number(bidData.bidQuantity) >=
        details.total_quantity
      ) {
        DeleteOrder({ orderID: bidData.orderID[0]?._id });
      }
    } catch (e) {
      console.log("error in updating order data", e);
      return false;
    }

    // window.location.reload();
  } catch (e) {
    console.log("error in contract function calling", e);
    if (e.code === 4001) {
      NotificationManager.error("User denied ");
      return false;
    }
    return false;
  }
  NotificationManager.success("Bid Accepted Successfully");
  // slowRefresh(1000);
};

export const handleAcceptOffers = async (bidData, props, account) => {
  let buyerOrder = [];
  let sellerOrder = [];

  let amount = new BigNumber(bidData?.bidPrice?.$numberDecimal.toString())
    .multipliedBy(new BigNumber(bidData.bidQuantity.toString()))
    .toString();

  for (let key = 0; key < 11; key++) {
    switch (key) {
      case 0:
        sellerOrder.push(account);
        buyerOrder.push(bidData?.bidderID?.walletAddress);
        break;

      case 1:
        sellerOrder.push(props.NftDetails.collectionAddress?.toLowerCase());
        buyerOrder.push(props.NftDetails.collectionAddress?.toLowerCase());
        break;
      case 2:
        sellerOrder.push(Number(props.NftDetails.tokenId));
        buyerOrder.push(Number(props.NftDetails.tokenId));
        break;
      case 3:
        if (props.NftDetails.type == 1) {
          sellerOrder.push(Number(1));
          buyerOrder.push(Number(1));
        } else {
          sellerOrder.push(Number(bidData.bidQuantity));
          buyerOrder.push(Number(bidData.bidQuantity));
        }

        break;
      case 4:
        sellerOrder.push(1);
        buyerOrder.push(1);
        break;
      case 5:
        sellerOrder.push(bidData.paymentToken?.toLowerCase());
        buyerOrder.push(bidData.paymentToken?.toLowerCase());
        break;
      case 6:
        buyerOrder.push(amount);
        sellerOrder.push(Number(bidData.bidPrice.$numberDecimal));
        break;
      case 7:
        buyerOrder.push(bidData.bidDeadline);
        sellerOrder.push(bidData.bidDeadline);

        break;
      case 8:
        sellerOrder.push([]);
        buyerOrder.push([]);
        break;
      case 9:
        sellerOrder.push([]);
        buyerOrder.push([]);
        break;
      case 10:
        sellerOrder.push(Number(bidData.salt));
        buyerOrder.push(Number(bidData.salt));
        break;
      default:
        sellerOrder.push([]);
        buyerOrder.push([]);
    }
  }

  let sellerSignature = bidData.buyerSignature;
  let buyerSignature = bidData.buyerSignature;

  let NFTcontract = await exportInstance(
    sellerOrder[1],
    props.NftDetails.type ? erc721Abi.abi : erc1155Abi.abi
  );

  let approval = await NFTcontract.isApprovedForAll(
    sellerOrder[0],
    contracts.MARKETPLACE
  );

  let approvalRes;

  let options = {
    from: account,

    gasLimit: 9000000,

    value: 0,
  };
  if (!approval) {
    approvalRes = await NFTcontract.setApprovalForAll(
      contracts.MARKETPLACE,
      true,
      options
    );

    let a = await approvalRes.wait();
    if (a.status !== 1) {
      NotificationManager.error("Marketplace has not approval");
      return false;
    }
  }
  let paymentTokenData = await getPaymentTokenInfo(
    buyerOrder[0],
    buyerOrder[5]
  );
  if (
    new BigNumber(paymentTokenData.balance).isLessThan(
      new BigNumber(buyerOrder[6].toString()).multipliedBy(
        new BigNumber(buyerOrder[3].toString())
      )
    )
  ) {
    NotificationManager.error("Buyer don't have enough Tokens");
    return false;
  }

  try {
    let marketplace = await exportInstance(
      contracts.MARKETPLACE,
      marketPlaceABI.abi
    );
    let completeOrder;
    try {
      options = {
        from: sellerOrder[0],
        gasPrice: 10000000000,
        gasLimit: 9000000,
        value: 0,
      };
      completeOrder = await marketplace.completeOrder(
        sellerOrder,
        sellerSignature,
        buyerOrder,
        buyerSignature,
        options
      );
      completeOrder = await completeOrder.wait();
      if (completeOrder.status === 0) {
        return false;
      }
    } catch (e) {
      console.log("error in contract", e);
      return false;
    }

    let erc721 = props.NftDetails.type === 1 ? 1 : 2;

    try {
      let reqParams = {
        bidID: bidData._id,
        erc721: erc721,
        status: erc721 ? 2 : 1,
        qty_sold: bidData.bidQuantity,
      };

      await acceptBid(reqParams);
    } catch (e) {
      console.log("error in api", e);
      return false;
    }
    try {
      await handleUpdateBidStatus(bidData._id, "Accepted");
    } catch (e) {
      console.log("error in updating order data", e);
      return false;
    }
  } catch (e) {
    console.log("error in contract function calling", e);
    if (e.code === 4001) {
      NotificationManager.error("User denied ");
      return false;
    }
    return false;
  }
  NotificationManager.success("Bid Accepted Successfully");
  slowRefresh(1000);
};

export const handleUpdateBidStatus = async (
  bidID,
  action //Delete, Cancelled, Rejected
) => {
  try {
    let reqParams = {
      bidID: bidID,
      action: action, //Delete, Cancelled, Rejected
    };
    await updateBidNft(reqParams);

    NotificationManager.success(`Bid ${action} Successfully`);
  } catch (e) {
    console.log("error in api", e);
  }
};
