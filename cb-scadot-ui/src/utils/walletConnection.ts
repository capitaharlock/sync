export enum Network {
    Ethereum = 'ethereum',
    Stellar = 'stellar',
    Uknown = 'unknown',
}

export interface WalletConnection {
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    getAccount: () => Promise<string>;
}

export const connectWallet = async (network: Network): Promise<WalletConnection> => {
    switch (network) {
        case Network.Ethereum:
            return connectEthereumWallet();
        case Network.Stellar:
            return connectStellarWallet();
        default:
            throw new Error('Unsupported network');
    }
};

const connectEthereumWallet = async (): Promise<WalletConnection> => {
    // Implement Ethereum wallet connection logic
    return {
        connect: async () => {
            console.log('Connecting to Ethereum wallet...');
        },
        disconnect: async () => {
            console.log('Disconnecting from Ethereum wallet...');
        },
        getAccount: async () => {
            console.log('Getting Ethereum account...');
            return 'my-ethereum-account';
        },
    };
    // if (!window.ethereum) {
    //     throw new Error('MetaMask is not installed');
    // }

    // await window.ethereum.request({ method: 'eth_requestAccounts' });

    // return {
    //     connect: async () => {
    //         await window.ethereum.request({ method: 'eth_requestAccounts' });
    //     },
    //     disconnect: async () => {
    //         // Ethereum wallets typically don't have a disconnect method
    //     },
    //     getAccount: async () => {
    //         const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    //         return accounts[0];
    //     },
    // };
};

const connectStellarWallet = async (): Promise<WalletConnection> => {
    // Implement Stellar wallet connection logic
    return {
        connect: async () => {
            console.log('Connecting to Stellar wallet...');
        },
        disconnect: async () => {
            console.log('Disconnecting from Stellar wallet...');
        },
        getAccount: async () => {
            console.log('Getting Stellar account...');
            return 'my-stellar-account';
        },
    };
};