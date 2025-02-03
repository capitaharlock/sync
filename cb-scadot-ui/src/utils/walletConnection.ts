import { isConnected as isStellarConnected, getAddress as getStellarAddress } from '@stellar/freighter-api';
// import { Connection, PublicKey } from '@solana/web3.js';

export enum Network {
    Ethereum = 'ethereum',
    Stellar = 'stellar',
    Solana = 'solana',
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
            return ConnectEthereumWallet();
        case Network.Stellar:
            return ConnectStellarWallet();
        case Network.Solana:
            return ConnectSolanaWallet();
        default:
            throw new Error('Unsupported network');
    }
};

const ConnectEthereumWallet = async (): Promise<WalletConnection> => {
    if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
    }
    return {
        connect: async () => {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
        },
        disconnect: async () => {
            // Ethereum wallets typically don't have a disconnect method
        },
        getAccount: async () => {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            return accounts[0];
        },
    };
};

const ConnectStellarWallet = async (): Promise<WalletConnection> => {
    // Implement Stellar wallet connection logic
    
    return {
        connect: async () => {
            console.log('Connecting to Stellar wallet...');
            try {
                const connected = await isStellarConnected();
                if (!connected) {
                    throw new Error('Freighter is not connected');
                }
            } catch (err: unknown) {
                if (err instanceof Error) {
                    throw new Error(err.message);
                } else {
                    throw new Error(err as string);
                }
            }
        },
        disconnect: async () => {
            console.log('Disconnecting from Stellar wallet...');
            // Freighter does not provide a disconnect method
        },
        getAccount: async () => {
            console.log('Getting Stellar account...');
            const { address } = await getStellarAddress();
            return address;
        },
    };
};
const ConnectSolanaWallet = async (): Promise<WalletConnection> => {
    // Implement Solana wallet connection logic
    
    return {
        connect: async () => {
            console.log('Connecting to Solana wallet...');
            try {
                if (!window.solana || !window.solana.isPhantom) {
                    throw new Error('Phantom Wallet is not installed');
                }
                const response = await window.solana.connect();
                const address = response.publicKey.toString();
                console.log('Connected to Solana wallet:', address);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    throw new Error(err.message);
                } else {
                    throw new Error(err as string);
                }
            }
        },
        disconnect: async () => {
            console.log('Disconnecting from Stellar wallet...');
        },
        getAccount: async () => {
            console.log('Getting Solana account...');
            if (!window.solana) {
                throw new Error('No Solana account connected');
            } 
            const address = window.solana.publicKey.toString();
            return address;
        
        },
    };
};