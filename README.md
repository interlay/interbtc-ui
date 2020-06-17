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
In comparison to other bridge constructions (like tBTC, wBTC, or RenVM) *anyone* can become an intermediary by depositing collateral making PolkaBTC the only truly open system.

The bridge itself follows the detailed specification: <a href="https://interlay.gitlab.io/polkabtc-spec/" target="_blank"><strong>Explore the specification »</strong></a>

It is implemented as a collection of open-source Substrate modules using Rust: <a href="https://gitlab.com/interlay/btc-parachain" target="_blank"><strong>Explore the implementation »</strong></a>

### Built with

- [React](https://github.com/facebook/react)
- [TypeScript](https://github.com/Microsoft/TypeScript)
- [polkadot-js](https://polkadot.js.org/)
- [Yarn](https://github.com/yarnpkg/yarn)


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

**Optional: Bitcoin integration**

If you want to integrate with bitcoin in your testing environment, you will have to setup a relayer that ensures that the BTC Parachain has all the available Bitcoin blockheaders. To achieve this, follow the [instructions in the relayer repository](https://gitlab.com/interlay/relayer).

### Installation

Clone this repository and enter into the root folder.

```bash
git@gitlab.com:interlay/xclaim-ui.git
cd xclaim-ui
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

### Test

Test the project.

```bash
yarn test
```

## Usage

One the website is launched, you have three different options:

- *Buy PolkaBTC*
- *Mint PolkaBTC*
- *Return BTC*

## Roadmap

- [ ] Integrate an atomic swap option to buy PolkaBTC.

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are greatly appreciated.

1. Fork the Project
2. Create your Feature Branch (git checkout -b feature/AmazingFeature)
3. Commit your Changes (git commit -m 'Add some AmazingFeature')
4. Push to the Branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

If you are searching for a place to start or would like to discuss features, reach out to us:

- [Telegram](t.me/interlay)
- [Riot](https://matrix.to/#/!nZablWWaicZyVTWyZk:matrix.org?via=matrix.org)

## License

(C) Copyright 2020 [Interlay](https://www.interlay.io) Ltd

xclaim-ui is licensed under the terms of the Apache License (Version 2.0). See [LICENSE](LICENSE).

## Contact


Website: [Interlay.io](https://www.interlay.io)

Twitter: [@interlayHQ](https://twitter.com/InterlayHQ)

Email: contact@interlay.io

## Acknowledgements


We would like to thank the following teams for their continuous support:

* [Web3 Foundation](https://web3.foundation/)
* [Parity Technologies](https://www.parity.io/)
