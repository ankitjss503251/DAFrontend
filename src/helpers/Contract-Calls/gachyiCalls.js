
import { MAX_ALLOWANCE_AMOUNT } from "../constants";
import erc20Abi from "../../config/abis/erc20.json";
import gooAbi from "../../config/abis/gachiyland.json"
import { exportInstance } from "../../apiServices";
import contracts from "../../config/contracts";
import { convertToEth } from "../../helpers/numberFormatter";
import BigNumber from "bignumber.js";
import evt from "../../events/events"

const cID=0;
export const fetchInfo = async () => {
    let gooContract = await exportInstance(contracts.gachyiland, gooAbi.abi);
    try {
      let categories = await gooContract.categories(cID)
      let totalSupply = await gooContract.totalSupply();
      return [categories.price,categories.token,totalSupply] ;
      return categories;
    } catch (e) {
      return e;
    }
  
  };
  export const testMint = async ( qty,price,from) => {

    price = parseFloat(price) * parseInt(qty);
    let gooContract = await exportInstance(contracts.gachyiland, gooAbi.abi);
    
    try {
      let result  = await gooContract.estimateGas.mintTokens(cID, qty, { from: from})
      console.log("test mint result",result);
      return [result,true];
    } catch (e) {
      if(JSON.stringify(e).includes("insufficient allowance")){
        let getcateg = await fetchInfo(0);
         let erc20 = await exportInstance(getcateg[1].toString(), erc20Abi);
         let bal = await erc20.balanceOf(from);
         bal =convertToEth(new BigNumber(bal.toString()));
         console.log("Balance of user :",bal);
         if(parseFloat(bal)>price){
          //  let txn  = await erc20.approve(contracts.gachyiland,MAX_ALLOWANCE_AMOUNT,{from:from})
          try {
            let txn  = await erc20.approve(contracts.gachyiland,"1000000000000000000",{from:from})
            evt.emit('txn-status',"approval-initiated");
            txn = await txn.wait()
            evt.emit('txn-status',"approval-succeed");
            return [txn,true];
            
          } catch (error) {
            evt.emit('txn-error',"user-denied-approval");
            return [error,false];
          }
         }else{
          evt.emit('txn-error',"not enough balance");
          return ["not enough balance",false];
         }
      }
      if(JSON.stringify(e).includes("transfer amount exceeds balance")){
        console.log("no money");
        evt.emit('txn-error',"not enough balance");
        return ["not enough balance",false];
      }
    }
  }
  export const mintTokens = async ( qty, from) => {
    let gooContract = await exportInstance(contracts.gachyiland, gooAbi.abi);
    try {
      let txn  = await gooContract.mintTokens(cID, qty, { from: from})
      evt.emit('txn-status',"mint-initiated");
      txn = await txn.wait()
      evt.emit('txn-status',"mint-succeed");
      return txn;
    } catch (e) {
      evt.emit('txn-error',"user-denied-mint");
      return e;
    }
  
  };