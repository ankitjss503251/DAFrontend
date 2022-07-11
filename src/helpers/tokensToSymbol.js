import contracts from "../config/contracts";
import BUSDSymbol from "./../assets/images/busd.png";
import BNBSymbol from "./../assets/images/bnb.png";
import HNTRSymbol from "./../assets/images/hntr.png";

export const Tokens = {
  [contracts["BUSD"].toLowerCase()]: BUSDSymbol,
  [contracts["BNB"].toLowerCase()]: BNBSymbol,
  [contracts["HNTR"].toLowerCase()]: HNTRSymbol,
};
