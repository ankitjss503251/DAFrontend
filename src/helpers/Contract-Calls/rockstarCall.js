import { MAX_ALLOWANCE_AMOUNT } from "../constants";
import erc20Abi from "../../config/abis/erc20.json";
import rrBabyAbi from "../../config/abis/rrbaby.json";
import { exportInstance, isWhitelisted } from "../../apiServices";
import contracts from "../../config/contracts";
import { convertToEth } from "../../helpers/numberFormatter";
import BigNumber from "bignumber.js";
import evt from "../../events/events";

export const fetchInfo = async (addr) => {
  let contract = await exportInstance(addr, rrBabyAbi.abi);
  try {
    let price = await contract.price();
    let token = await contract.token();
    let totalSupply = await contract.indicatesID();
    // console.log("came from rockstar",price,token,(totalSupply-1));
    return [price, token, totalSupply - 1];
  } catch (e) {
    return e;
  }
};

export const testMint = async (addr, qty, price, from) => {
  console.log("!!!!!!!!!!!!!!!!!", addr);
  evt.emit("txn-status", "initiate loader");
  price = parseFloat(price) * parseInt(qty);
  let contract = await exportInstance(addr, rrBabyAbi.abi);
  try {
    let result = await contract.isActive();
    console.log("result1", result);
    if (result) {
           console.log("in minting section");
      // public mint
      try {
        console.log("in minting section");
        let result = await contract.estimateGas.mintTokens(qty, {
          from: from,
          value: 0,
        });
        console.log("result2", result);
        if (result) {
          return mintTokens(addr, qty, from);
        }
      } catch (e) {
        if (JSON.stringify(e).includes("insufficient allowance")) {
          let getcateg = await fetchInfo(addr);
          console.log("cateeeegggg", getcateg);
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
          console.log("no money");
          evt.emit("txn-error", "not enough balance");
          return ["not enough balance", false];
        } else {
          evt.emit("txn-error", e.reason);
        }
      }
      // public mint ends here
    } else {
      let isEligible = await isWhitelisted({ address: from });
      console.log("it is in whitelisting", isEligible);
      if (isEligible.auth) {
        let maxQty = 2;

        try {
          let result = await contract.estimateGas.whitelistedMint(
            qty,
            maxQty,
            isEligible.signature,
            { from: from }
          );
          if (result) {
            return whitelistMint(addr, qty, maxQty, isEligible.signature, from);
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
                // let txn  = await erc20.approve(addr,"80000000000000000",{from:from})
                let txn = await erc20.approve(addr, MAX_ALLOWANCE_AMOUNT, {
                  from: from,
                  gasPrice: 10000000000,
                  gasLimit: 9000000,
                });
                evt.emit("txn-status", "approval-initiated");
                txn = await txn.wait();
                evt.emit("txn-status", "approval-succeed");
                if (txn) {
                  return whitelistMint(
                    addr,
                    qty,
                    maxQty,
                    isEligible.signature,
                    from
                  );
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
            console.log("no money");
            evt.emit("txn-error", "not enough balance");
            return ["not enough balance", false];
          } else {
            evt.emit("txn-error", e.reason);
          }
        }
        // public mint ends here
      } else {
        let isEligible = await isWhitelisted({ address: from });

        if (isEligible.auth) {
          let maxQty = 2;

          try {
            console.log("trying whitelist mint", isEligible.signature);
            let result = await contract.estimateGas.whitelistedMint(
              qty,
              maxQty,
              isEligible.signature,
              { from: from }
            );

            if (result) {
              whitelistMint(addr, qty, maxQty, isEligible.signature, from);
            }
          } catch (e) {
            console.log("whitelist errroorrrr", e);
            if (JSON.stringify(e).includes("insufficient allowance")) {
              let getcateg = await fetchInfo(addr);
              let erc20 = await exportInstance(
                getcateg[1].toString(),
                erc20Abi
              );
              let bal = await erc20.balanceOf(from);
              bal = convertToEth(new BigNumber(bal.toString()));
              console.log("Balance of user :", bal);
              if (parseFloat(bal) > price) {
                //  let txn  = await erc20.approve(contracts.gachyiland,MAX_ALLOWANCE_AMOUNT,{from:from})
                try {
                  let txn = await erc20.approve(addr, MAX_ALLOWANCE_AMOUNT, {
                    from: from,
                    gasPrice: 10000000000,
                    gasLimit: 9000000,
                  });
                  evt.emit("txn-status", "approval-initiated");
                  txn = await txn.wait();
                  evt.emit("txn-status", "approval-succeed");
                  if (txn) {
                    return whitelistMint(
                      addr,
                      qty,
                      maxQty,
                      isEligible.signature,
                      from
                    );
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
              console.log("no money");
              evt.emit("txn-error", "not enough balance");
              return ["not enough balance", false];
            } else {
              evt.emit("txn-error", e.reason);
              return e;
            }
          }
        } else {
          evt.emit("txn-error", "address not Whitelisted");
          return "address not Whitelisted";
        }
      }
    }
  } catch (error) {
    console.log(error);
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
    evt.emit("txn-error", "user-denied-mint");
    return e;
  }
};
