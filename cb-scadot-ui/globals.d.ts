// typescript globals to avoid compilation errors when
// working with wallet connection logic such as window.ehtereum, window.solana, etc.
declare var window: any;
declare interface Window {
    ethereum: any;
    Interface: any;
    etherProvider: any;
    solana: any;
}