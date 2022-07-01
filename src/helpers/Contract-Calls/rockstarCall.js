import { msgTrigger } from "../../components/components/MintEventSlider";
import { MAX_ALLOWANCE_AMOUNT } from "../constants";
import erc20Abi from "../../config/abis/erc20.json";
import rrBabyAbi from "../../config/abis/rrbaby.json"
import { exportInstance } from "../../apiServices";
import contracts from "../../config/contracts";


export const fetchInfo = async () => {
    let contract = await exportInstance(contracts.rrBaby, rrBabyAbi.abi);
    try {
      let price = await contract.price();
      let token =await  contract.token();
      let totalSupply = await contract.indicatesID();
      // console.log("came from rockstar",price,token,(totalSupply-1));
      return [price,token,(totalSupply-1)];
     
    } catch (e) {
      return e;
    }
  
  };
  export const testMint = async ( qty, price,from) => {
    price = parseFloat(price) * parseInt(qty);
    let contract = await exportInstance(contracts.rrBaby, rrBabyAbi.abi);
    try {
 
      let result  = await contract.estimateGas.mintTokens( qty, { from: from })
      return result;
    } catch (e) {
      console.log(e);
      if(JSON.stringify(e).includes("insufficient allowance")){
        let getcateg = await fetchInfo();
        console.log(getcateg)
         let erc20 = await exportInstance(getcateg[1].toString(), erc20Abi);
         let bal = await erc20.balanceOf(from);
         if(parseFloat(bal)>price){
          //  let txn  = await erc20.approve(contracts.gachyiland,MAX_ALLOWANCE_AMOUNT,{from:from})
          try {
            let txn  = await erc20.approve(contracts.rrBaby,"100000000000000000",{from:from})
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
  export const mintTokens = async ( qty, from) => {
    console.log(qty, from);
    let contract = await exportInstance(contracts.rrBaby, rrBabyAbi.abi);
    try {
      let txn  = await contract.mintTokens( qty, { from:from})
      msgTrigger("txn initiated :");
      return txn;
    } catch (e) {
      return e;
    }
  
  };