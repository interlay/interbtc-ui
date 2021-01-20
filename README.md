# PolkaBTC

<div align="center">
	<p align="center">
		<img src="src/assets/img/polkabtc/PolkaBTC_color.png" alt="logo" width="512">
	</p>
	<p>
		<h3 align="center">PolkaBTC: Trustless and open DeFi access for your Bitcoin.</h3>
	</p>
</div>

## About

The PolkaBTC UI connects the Polkadot ecosystem with Bitcoin. It allows the creation of PolkaBTC, a fungible token that represents Bitcoin in the Polkadot ecosystem. PolkaBTC is backed by Bitcoin 1:1 and allows redeeming of the equivalent amount of Bitcoins by relying on a collateralized third-party.
In comparison to other bridge constructions (like tBTC, wBTC, or RenVM) _anyone_ can become an intermediary by depositing collateral making PolkaBTC the only truly open system.

The bridge itself follows the detailed specification: <a href="https://interlay.gitlab.io/polkabtc-spec/" target="_blank"><strong>Explore the specification »</strong></a>

It is implemented as a collection of open-source Substrate modules using Rust: <a href="https://gitlab.com/interlay/btc-parachain" target="_blank"><strong>Explore the implementation »</strong></a>

### Built with

-   [React](https://github.com/facebook/react)
-   [TypeScript](https://github.com/Microsoft/TypeScript)
-   [polkadot-js](https://polkadot.js.org/)
-   [Yarn](https://github.com/yarnpkg/yarn)

## Getting Started

### Prerequisites

**BTC Parachain**

You need to have an instance of the BTC Parachain running. Follow the instructions at the [BTC-Parachain repository](https://gitlab.com/interlay/btc-parachain). Once you have successfully build the BTC Parachain, start a development server from the root folder of the BTC Parachain repository.

```bash
./target/release/btc-parachain --dev
```

If you want to reset the development chain, execute the following command.

```bash
./target/release/btc-parachain purge-chain --dev
```

**Bitcoin**

Download and start [Bitcoin Core](https://bitcoin.org/en/bitcoin-core/).

```shell
bitcoind -regtest -server
```

To mine blocks you may use a command such as the following.

```shell
bitcoin-cli -regtest generatetoaddress 1 $(bitcoin-cli -regtest getnewaddress)
```

**Clients**

In order to automatically submit block headers, run the [staked-relayer](https://gitlab.com/interlay/polkabtc-clients/-/tree/dev/staked-relayer) client software.

```shell
staked-relayer --keyring=eve --http-addr '[::0]:3030' --polka-btc-url 'ws://localhost:9944'
```

The architecture also relies upon collateralized vaults; use the [vault](https://gitlab.com/interlay/polkabtc-clients/-/tree/dev/vault) client to register automatically.

```shell
vault --keyring=charlie --network=testnet --auto-register-with-collateral 100000000 --http-addr '[::0]:3031' --polka-btc-url 'ws://localhost:9944'
```

Issue requests (BTC -> PolkaBTC) can be executed solely through the UI but a vault client is required to redeem (PolkaBTC -> BTC).

Lastly, we require a price oracle to compute the exchange rate (BTC <> DOT), the [oracle](https://gitlab.com/interlay/polkabtc-clients/-/tree/dev/oracle) client can automatically feed this from an integrated data source (e.g. [CoinGecko](https://www.coingecko.com/en/coins/polkadot/btc)).

```shell
oracle --keyring=bob --polka-btc-url 'ws://localhost:9944' --coingecko
```

**Electrs**

We make heavy use of the [Blockstream API](https://github.com/interlay/electrs) in the UI to watch for payments made on Bitcoin.

```shell
electrs -vvvv --network regtest --jsonrpc-import --cors "*" --cookie "rpcuser:rpcpassword" --daemon-rpc-addr localhost:18443 --http-addr "[::0]:3002" --index-unspendables
```

### Docker-Compose (Regtest)

To simplify testing, you may also run all of the required services with `docker-compose`:

```shell
docker-compose up
```

Docker will run all services: parachain, staked-relayer, vault, oracle and bitcoin. To kill all services and reset the parachain use:

```shell
docker-compose down -v
```

Start the app with:

```shell
REACT_APP_BITCOIN_NETWORK=regtest yarn start
```

### Docker-Compose (Testnet)

To run against Bitcoin testnet first start your daemon:

```shell
bitcoind -testnet -server
```

Then start the remaining components with `docker-compose`:

```shell
docker-compose --file docker-compose.testnet.yml up
```

Start the app with:

```shell
REACT_APP_BITCOIN_NETWORK=testnet yarn start
```

> Note: This is only supported on Linux due to issues with `network_mode: "host"` on Mac.

### Test Data (Regtest)

To simplify testing, you may also use the `testdata-gen` toolkit:

```shell
git clone git@gitlab.com:interlay/polkabtc-clients.git
cd polkabtc-clients
cargo build -p testdata-gen
# environment variables for bitcoind
source .env
```

For example, to register `bob` as a vault we can use the following command:

```shell
testdata-gen --keyring bob register-vault --btc-address "bcrt1qu0a2tc422uurm39g4p2n5wfpy65fwypnz7p9aw" --collateral 100000000
```

Then when `alice` wants to issue 0.001 PolkaBTC, we need to send the equivalent number of Satoshis to `bob`:

```shell
testdata-gen --keyring alice send-bitcoin --btc-address "bcrt1qu0a2tc422uurm39g4p2n5wfpy65fwypnz7p9aw" --satoshis 100000
```


### Local Installation

Clone this repository and enter into the root folder.

```bash
git@gitlab.com:interlay/polkabtc-ui.git
cd polkabtc-ui
```

Install the required dependencies.

```bash
yarn install
```

Start the development server. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits. You will also see any lint errors in the console.

```bash
yarn start
```

### Docker Installation

Clone this repository and enter into the root folder.

```bash
git@gitlab.com:interlay/polkabtc-ui.git
cd polkabtc-ui
```

Install the required dependencies.

```bash
docker build -t polkabtc:ui .
```

Start the development server. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

```bash
docker run -it -p 3000:3000 polkabtc:ui
```

### Test

Test the project.

```bash
yarn test
```

## Usage

One the website is launched, you have three different options:

-   _Buy PolkaBTC_
-   _Mint PolkaBTC_
-   _Return BTC_

## Help

### Docker

You can hard-reset the docker dependency setup with the following commands:

```shell
docker kill $(docker ps -q)
docker rm $(docker ps -a -q)
docker rmi $(docker images -q)
docker volume rm $(docker volume ls -q)
```

## Roadmap

-   [ ] Integrate an atomic swap option to buy PolkaBTC.

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are greatly appreciated.

1. Fork the Project
2. Create your Feature Branch (git checkout -b feature/AmazingFeature)
3. Commit your Changes (git commit -m 'Add some AmazingFeature')
4. Push to the Branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

If you are searching for a place to start or would like to discuss features, reach out to us:

-   [Telegram](t.me/interlay)
-   [Riot](https://matrix.to/#/!nZablWWaicZyVTWyZk:matrix.org?via=matrix.org)

## License

(C) Copyright 2020 [Interlay](https://www.interlay.io) Ltd

polkabtc-ui is licensed under the terms of the Apache License (Version 2.0). See [LICENSE](LICENSE).

## Contact

Website: [Interlay.io](https://www.interlay.io)

Twitter: [@interlayHQ](https://twitter.com/InterlayHQ)

Email: contact@interlay.io

## Acknowledgements

We would like to thank the following teams for their continuous support:

-   [Web3 Foundation](https://web3.foundation/)
-   [Parity Technologies](https://www.parity.io/)
