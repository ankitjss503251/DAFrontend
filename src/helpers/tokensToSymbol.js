import contracts from "../config/contracts";
import USDTSymbol from "./../assets/images/busd.png";
import BNBSymbol from "./../assets/images/bnb.png";
import HNTRSymbol from "./../assets/images/hntr.png";

export const Tokens = {
  [contracts["BUSD"].toLowerCase()]: USDTSymbol,
  [contracts["BNB"].toLowerCase()]: BNBSymbol,
  [contracts["HNTR"].toLowerCase()]: HNTRSymbol,
};
