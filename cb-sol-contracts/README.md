# Tokenized Trade Receivables: Solana Smart Contracts Repository

This repo contains Solana-specific code, alongside the testing environment necessary to run it.

## Installation

### Dockerized Environment

```
#TODO: Add when docker ready
```

### Manual Environment Installation

This will require installing all the dependencies locally. The following general dependencies are required for most OSes:

* Git
* gcc
* build-essential
* Unzip (Ubuntu)

#### Rust installation

To install Rust on Ubuntu, use the following command:

```sh
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
```

#### Node.JS and NPM Installation

Run the following commands to install on Linux:

```bash
curl -fsSL https://fnm.vercel.app/install | bash
source ~/.bashrc
fnm use --install-if-missing 20
```

For MacOS:

```bash
curl -fsSL https://fnm.vercel.app/install | bash
source ~/.bashrc
fnm use --install-if-missing 20
```

#### Solana CLI Tooling

The installers for solana are available on the GitHub releases page: https://github.com/solana-labs/solana/releases/tag/v1.18.23

Download the installer for your specific OS and run the binary with the latest version as argument:

```bash
chmod +x solana-install
./solana-install v1.18.23
```

#### Anchor CLI Tooling

Anchor is the framework for developing solana programs. It provides the tooling for testing and deploying programs as well. The project currently uses version `0.30.1` it can be installed through `cargo` - the Rust package manager:

```bash
cargo install --git https://github.com/coral-xyz/anchor --tag v0.30.1 anchor-cli
```

## Testing the code

To run the included tests on a local environment, run the following command:

```bash
anchor test
```