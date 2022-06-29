import { msgTrigger } from "../components/components/MintEventSlider";
import { MAX_ALLOWANCE_AMOUNT } from "./constants";
import erc20Abi from "./../config/abis/erc20.json";
import gooAbi from "../config/abis/gachiyland.json"
import { exportInstance } from "../apiServices";
import contracts from "./../config/contracts";
export const fetchInfo = async (cId) => {
    let gooContract = await exportInstance(contracts.gachyiland, gooAbi.abi);
    try {
      let categories = await gooContract.categories(cId)
      return categories;
    } catch (e) {
      return e;
    }
  
  };
  export const fetchTotalSupply = async () => {
    let gooContract = await exportInstance(contracts.gachyiland, gooAbi.abi);
    try {
      let categories = await gooContract.totalSupply()
      return categories;
    } catch (e) {
      return e;
    }
  
  };
  export const testMintGachyi = async (cId, qty, from, price) => {
    price = parseFloat(price) * parseInt(qty);
    let gooContract = await exportInstance(contracts.gachyiland, gooAbi.abi);
    console.log(gooContract);
    try {
      let result  = await gooContract.estimateGas.mintTokens(cId, qty, { from: from})
      return result;
    } catch (e) {
      if(JSON.stringify(e).includes("insufficient allowance")){
        let getcateg = await fetchInfo(0);
         let erc20 = await exportInstance(getcateg.token.toString(), erc20Abi);
         let bal = await erc20.balanceOf(from);
         if(parseFloat(bal)>price){
          //  let txn  = await erc20.approve(contracts.gachyiland,MAX_ALLOWANCE_AMOUNT,{from:from})
          try {
            let txn  = await erc20.approve(contracts.gachyiland,"1000000000000000000",{from:from})
            msgTrigger("approval initiated :");
            txn = await txn.wait()
            msgTrigger.log("approval succeed ",txn);
            return txn;
            
          } catch (error) {
            return false;
          }
         }else{
          return "not enough balance";
         }
      }
    }
  }
  export const mintTokensGachyi = async (cId, qty, from) => {
    let gooContract = await exportInstance(contracts.gachyiland, gooAbi.abi);
    try {
      let result  = await gooContract.mintTokens(cId, qty, { from: from})
      msgTrigger("txn initiated :");
      return result;
    } catch (e) {
      return e;
    }
  
  };