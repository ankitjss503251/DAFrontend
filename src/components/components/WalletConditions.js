import { onboard } from "../menu/header";

export const WalletConditions = () => {
    const currentState = onboard.state.get();
    const provider = currentState.wallets[0].provider;
    const currentWalletAddress = currentState.wallets[0].accounts[0].address;
    const currentChainID = currentState.wallets[0].chains[0].id;

    return {
        currentWalletAddress,
        currentChainID,
        provider
    }
}
