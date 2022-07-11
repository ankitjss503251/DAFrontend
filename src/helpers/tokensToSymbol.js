import contracts from "../config/contracts";
import BUSDSymbol from "./../assets/images/busd.png";
import BNBSymbol from "./../assets/images/bnb.png";
import HNTRSymbol from "./../assets/images/hntr.png";

export const Tokens = {
  [contracts["BUSD"].toLowerCase()]: { icon: BUSDSymbol, symbolName : "BUSD"},
  [contracts["BNB"].toLowerCase()]: { icon: BNBSymbol, symbolName: "BNB"},
  [contracts["HNTR"].toLowerCase()]: {icon: HNTRSymbol, symbolName: "HNTR"}
};
