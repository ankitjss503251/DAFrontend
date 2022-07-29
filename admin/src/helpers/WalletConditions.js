
import { onboard } from "../components/Navbar";

export const WalletConditions = () => {
    const cookies = document.cookie;
    let str = cookies;
    let isLocked = false;
    let cCheck = true;
    let aCheck = true;

    str = str.split('; ');
    const result = {};
    for (let i in str) {
        const cur = str[i].split('=');
        result[cur[0]] = cur[1];
    }


    const state = onboard.state.get();

    if (state.wallets?.length > 0) {
        const cWalletAccount = state.wallets[0].accounts[0].address;
        const cWalletChainID = state.wallets[0].chains[0].id;

        if (cWalletChainID !== result.da_chain_id) {
               cCheck = false;
        }
        else
            if (cWalletAccount !== result.da_selected_account) {
                aCheck = false;
            }
         
        return {
            isLocked, cCheck, aCheck, cWalletAccount, sAccount: result.da_selected_account, cWalletChainID, sChain: result.da_chain_id
        }
    }

    return {
        isLocked: true, sAccount: result.da_selected_account
    }

}