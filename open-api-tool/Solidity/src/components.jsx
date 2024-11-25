import React from 'react';
import Web3Modal from "web3modal";
import { BrowserProvider, Interface } from "ethers"; // ethers v6 import for BrowserProvider
import {
    ISupportedWallet,
    StellarWalletsKit,
    WalletNetwork,
    allowAllModules,
    XBULL_ID
} from '@creit.tech/stellar-wallets-kit';
import * as StellarSdk from '@stellar/stellar-sdk';


class WalletHeaderLayout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isConnected: false,
            walletAddress: null
        };
        this.web3Modal = null;
        this.provider = null;
    }

    componentDidMount() {
        const providerOptions = {
            // Add provider options if needed, e.g., WalletConnect
        };

        this.web3Modal = new Web3Modal({
            network: "mainnet",
            cacheProvider: true,
            providerOptions,
        });
    }

    connectWallet = async () => {
        try {
            // Open Web3Modal to select provider
            this.provider = await this.web3Modal.connect();

            // Use ethers v6 BrowserProvider to connect and get account information
            const web3Provider = new BrowserProvider(this.provider);
            const accounts = await web3Provider.listAccounts();
            const walletAddress = accounts[0].address; // In ethers v6, accounts are objects with an 'address' property

            // Set provider and wallet address on window and state
            window.walletProvider = this.provider;
            window.etherProvider = web3Provider;
            window.Interface = Interface
            this.setState({ isConnected: true, walletAddress });
        } catch (error) {
            console.error("Connection failed:", error);
        }
    };

    disconnectWallet = async () => {
        if (this.provider && this.provider.disconnect) {
            await this.provider.disconnect();
        }
        this.web3Modal.clearCachedProvider();
        window.walletProvider = null;
        this.setState({ isConnected: false, walletAddress: null });
    };

    render() {
        const { getComponent } = this.props;
        const BaseLayout = getComponent("BaseLayout", true);
        const { isConnected, walletAddress } = this.state;

        // Styling for the button container and buttons
        const buttonContainerStyle = {
            display: "flex",
            justifyContent: "flex-end",
            padding: "10px"
        };

        const buttonStyle = {
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            border: "none",
            borderRadius: "4px",
            color: "white",
            cursor: "pointer",
            fontSize: "16px",
            marginLeft: "10px"
        };

        const disconnectButtonStyle = {
            ...buttonStyle,
            backgroundColor: "#f44336" // red for disconnect button
        };

        return (
            <div>
                <div style={buttonContainerStyle}>
                    <button style={buttonStyle} onClick={this.connectWallet}>
                        {isConnected ? walletAddress : "Connect Wallet"}
                    </button>
                    {isConnected && (
                        <button style={disconnectButtonStyle} onClick={this.disconnectWallet}>
                            Disconnect
                        </button>
                    )}
                </div>
                <BaseLayout />
            </div>
        );
    }
}

class StellarWalletHeaderLayout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isConnected: false,
            walletAddress: null,
            contractAddress: "CB6SXRK5X4DROHLG2OMC2X4MD2WESLOFZ4Z4E2YIJTVHGWLOFMW62UN5"
        };
        this.kit = null;
    }

    
    componentDidMount() {
        this.kit = new StellarWalletsKit({
            network: WalletNetwork.TESTNET,
            selectedWalletId: XBULL_ID,
            modules: allowAllModules(),
        });
        window.stellarKit = this.kit;
        window.stellarHeader = this;
        
        
        /*
        const txBuilder = new StellarSdk.TransactionBuilder("pubkey");
        this.kit.signTransaction()
        */
    }

    connectWallet = async () => {
        try {
            await this.kit.openModal({
                onWalletSelected: async (option) => {
                    this.kit.setWallet(option.id);
                    const { address } = await kit.getAddress();
                    this.setState({ isConnected: true, walletAddress: address });
                }
            });
        } catch (error) {
            console.error("Connection failed:", error);
        }
    };

    disconnectWallet = async () => {
        if (this.kit.disconnect) {
            await this.kit.disconnect();
        }
        this.setState({ isConnected: false, walletAddress: null });
    };

    setNetwork = (event) => {
        // TODO set network
    };

    render() {
        const { getComponent } = this.props;
        const BaseLayout = getComponent("BaseLayout", true);
        const { isConnected, walletAddress } = this.state;

        // Styling for the button container and buttons
        const buttonContainerStyle = {
            display: "flex",
            justifyContent: "flex-end",
            padding: "10px"
        };

        const buttonStyle = {
            flexGrow: "1",
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            border: "none",
            borderRadius: "4px",
            color: "white",
            cursor: "pointer",
            fontSize: "16px",
            marginLeft: "40px"
        };

        const disconnectButtonStyle = {
            ...buttonStyle,
            backgroundColor: "#f44336" // red for disconnect button
        };

        const inputStyle = {
            fontSize: "16px",
            padding: "10px 20px",
            flexGrow: "1",
            border: "solid 2px black"
        }

        const addrInputStyle = {
            ...inputStyle,
            flexGrow: "4",
            borderRight: "none",
            borderTopLeftRadius: "6px",
            borderBottomLeftRadius: "6px"

        }

        return (
            <div>
                <div style={buttonContainerStyle}>
                    <input style={addrInputStyle} type='text' placeholder='Contract Address' onChange={(event) => { this.setState({ contractAddress: event.target.value }) }} />
                    <select style={{ ...inputStyle, borderLeft: "none", borderTopRightRadius: "6px", borderBottomRightRadius: "6px" }} onChange={this.setNetwork}>
                        <option>Testnet</option>
                        <option>Futurenet</option>
                        <option>Sandbox</option>
                        <option>Public</option>
                    </select>
                    <button style={buttonStyle} onClick={this.connectWallet}>
                        {isConnected ? walletAddress : "Connect Wallet"}
                    </button>
                    {isConnected && (
                        <button style={disconnectButtonStyle} onClick={this.disconnectWallet}>
                            Disconnect
                        </button>
                    )}
                </div>
                <BaseLayout />
            </div>
        );
    }
}


// Make WalletHeaderLayout globally available
window.WalletHeaderLayout = WalletHeaderLayout;
window.StellarWalletHeaderLayout = StellarWalletHeaderLayout;
