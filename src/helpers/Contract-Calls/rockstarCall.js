import { MAX_ALLOWANCE_AMOUNT } from "../constants";
import erc20Abi from "../../config/abis/erc20.json";
import rrBabyAbi from "../../config/abis/rrbaby.json";
import { exportInstance, isWhitelisted,FetchInstance } from "../../apiServices";
import { convertToEth } from "../../helpers/numberFormatter";
import BigNumber from "bignumber.js";
import { sigGenerator } from "../sigGen";
import evt from "../../events/events";
import {MAX_WHITELIST_BUY_PER_USER} from "../../helpers/constants"
import { parseJSON } from "jquery";

export const fetchInfo = async (addr) => {
  
  let contract = await FetchInstance(addr, rrBabyAbi.abi); 
  try {
    let price = await contract.price();
    let token = await contract.token();
    let totalSupply = await contract.indicatesID();
    return [price, token, totalSupply - 1];
  } catch (e) {
     return e;
  }
};
export const fetchUserBal = async (from,addr) => {
  
  let contract = await exportInstance(addr, rrBabyAbi.abi); 
  try {
    let balance = await contract.balanceOf(from);
    return balance;
  } catch (e) {
    console.log("balance Error");
     return e;
  }
};
export const testMint = async (addr, qty, price, from) => {
  evt.emit("txn-status", "initiate loader");
  price = parseFloat(price) * parseInt(qty);
  let contract = await exportInstance(addr, rrBabyAbi.abi);
  try {
    let result = await contract.isActive();
    if (result) {
      // public mint
      try {
        let result = await contract.estimateGas.mintTokens(qty, {
          from: from,
          value: 0,
        });
        if (result) {
          return mintTokens(addr, qty, from);
        }
      } catch (e) {
        if (JSON.stringify(e).includes("insufficient allowance")) {
          let getcateg = await fetchInfo(addr);
          let erc20 = await exportInstance(getcateg[1].toString(), erc20Abi);
          let bal = await erc20.balanceOf(from);
          bal = convertToEth(new BigNumber(bal.toString()));
          console.log("Balance of user :", bal);
          if (parseFloat(bal) > price) {
            try {
              let txn = await erc20.approve(addr, MAX_ALLOWANCE_AMOUNT, {
                from: from,
              });
              evt.emit("txn-status", "approval-initiated");
              txn = await txn.wait();
              evt.emit("txn-status", "approval-succeed");
              if (txn) {
                return mintTokens(addr, qty, from);
              }
              return [txn, true];
            } catch (error) {
              evt.emit("txn-error", "user-denied-approval");
              return [error, false];
            }
          } else {
            evt.emit("txn-error", "not enough balance");
            return ["not enough balance", false];
          }
        }
        if (JSON.stringify(e).includes("transfer amount exceeds balance")) {
          evt.emit("txn-error", "not enough balance");
          return ["not enough balance", false];
        } else {
          evt.emit("txn-error", e.reason);
        }
      }
      // public mint ends here
    } else {
      console.log("in whitelist");
      let bal=await fetchUserBal(from,addr);
      console.log("BALANCE IS ",parseInt(bal) ,"and condition is :",parseInt(bal)<MAX_WHITELIST_BUY_PER_USER);
      if(bal<MAX_WHITELIST_BUY_PER_USER){
        let isEligible = await isWhitelisted({ uAddress: from ,cAddress:addr });      
        if (isEligible.auth) {
          let sig = await sigGenerator(from,addr)
          let maxQty = 2;
  
          try {
            let result = await contract.estimateGas.whitelistedMint(
              qty,
              maxQty,
              sig.uSignature,
              { from: from }
            );
            if (result) {
              return whitelistMint(addr, qty, maxQty, sig.uSignature, from);
            }
          } catch (e) {
            if (JSON.stringify(e).includes("insufficient allowance")) {
              let getcateg = await fetchInfo(addr);
              let erc20 = await exportInstance(getcateg[1].toString(), erc20Abi);
              let bal = await erc20.balanceOf(from);
              bal = convertToEth(new BigNumber(bal.toString()));
              console.log("Balance of user :", bal);
              if (parseFloat(bal) > price) {
                //  let txn  = await erc20.approve(contracts.gachyiland,MAX_ALLOWANCE_AMOUNT,{from:from})
                try {
          
                  let txn = await erc20.approve(addr, MAX_ALLOWANCE_AMOUNT, {
                    from: from,
                    
                  });
                  evt.emit("txn-status", "approval-initiated");
                  txn = await txn.wait();
                  evt.emit("txn-status", "approval-succeed");
                  if (txn) {
                    return whitelistMint(
                      addr,
                      qty,
                      maxQty,
                      sig.uSignature,
                      from
                    );
                  }
                  return [txn, true];
                } catch (error) {
                  console.log("this is the response we got ",JSON.stringify(error));
                  if(JSON.stringify(error).includes("MetaMask Tx Signature: User denied transaction signature.")){
                    evt.emit("txn-error", "user-denied-approval");
                    return [error, false];
                  }
                  if(JSON.stringify(error).includes(`"reason":"repriced","code":"TRANSACTION_REPLACED","cancelled"`)){
                    let result = await testMint(addr, qty, price, from);
                    console.log(result);
                  }

                }
              } else {
                evt.emit("txn-error", "not enough balance");
                return ["not enough balance", false];
              }
            }
            if (JSON.stringify(e).includes("transfer amount exceeds balance")) {
              console.log("no money");
              evt.emit("txn-error", "not enough balance");
              return ["not enough balance", false];
            } else {
              evt.emit("txn-error", e.reason);
            }
          }
  
        } else {
            evt.emit("txn-error", "address not Whitelisted");
            return "address not Whitelisted";
        }
      }else {
        evt.emit("txn-error", "max nft per wallet has been reached");
        return "limit has been reached ";
    }
    }
  } catch (error) {
    console.log(error);
    evt.emit("txn-error", "txn failed");
        return "TXN failed ";
  }
};
const mintTokens = async (addr, qty, from) => {
  console.log("it is in minting ");
  evt.emit("txn-status", "mint-initiated");
  let contract = await exportInstance(addr, rrBabyAbi.abi);
  try {
    let txn = await contract.mintTokens(qty, { from: from });
    txn = await txn.wait();
    evt.emit("txn-status", "mint-succeed");
    return txn;
  } catch (e) {
    evt.emit("txn-error", "user-denied-mint");
    return e;
  }
};
const whitelistMint = async (addr, qty, maxQty, sig, from) => {
  console.log("it is in whitelisting section ");
  evt.emit("txn-status", "mint-initiated");
  let contract = await exportInstance(addr, rrBabyAbi.abi);
  try {
    let txn = await contract.whitelistedMint(qty, maxQty, sig, { from: from });
    txn = await txn.wait();
    evt.emit("txn-status", "mint-succeed");
    return txn;
  } catch (e) {
    console.log(parseJSON(e));
    if(JSON.stringify(e).includes("transaction was replaced")){
      evt.emit("txn-error", "check wallet for confirmation");
      return e;
    }
    evt.emit("txn-error", "user-denied-mint");
    return e;
  }
};
