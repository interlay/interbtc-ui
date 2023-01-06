# interBTC

<div align="center">
	<p>
		<h3 align="center">interBTC: Use your Bitcoin. Anywhere.</h3>
	</p>
</div>

## About

The Interlay UI connects the Polkadot and Kusama ecosystem with Bitcoin. It allows the creation of interBTC and kBTC, a fungible token that represents Bitcoin in the Polkadot and Kusama ecosystem. interBTC and kBTC are backed by Bitcoin 1:1 and allow redeeming of the equivalent amount of Bitcoins by relying on a collateralized third-party called Vaults.
In comparison to other bridge constructions (like tBTC, wBTC, or RenVM) _anyone_ can become an intermediary by depositing collateral making interBTC and kBTC the only truly open system.

The bridge itself follows the detailed specification: <a href="https://spec.interlay.io" target="_blank"><strong>Explore the specification »</strong></a>

It is implemented as a collection of open-source Substrate modules using Rust: <a href="https://gitlab.com/interlay/interbtc" target="_blank"><strong>Explore the implementation »</strong></a>

### Built with

- [React](https://github.com/facebook/react)
- [TypeScript](https://github.com/Microsoft/TypeScript)
- [polkadot-js](https://polkadot.js.org/)
- [yarn](https://github.com/yarnpkg/yarn)
### Interlay

You can visit the Interlay application at [app.interlay.io](https://app.interlay.io).
### Kintsugi

You can visit the Kintsugi application at [kintsugi.interlay.io](https://kintsugi.interlay.io).

### Testnets

You can visit [testnet.interlay.io](https://testnet.interlay.io/) or [kintnet.interlay.io](https://kintnet.interlay.io/) for the latest testnets.

## Local development

You can run the both the Kintsugi and Interlay UIs locally on both testnet and mainnet.

Clone this repository and enter into the root folder.

```bash
git@gitlab.com:interlay/interbtc-ui.git
cd interbtc-ui
yarn install
```

Create an `.env.development.local` file in the root of the project and populate it with the relevant environment variables. These are defined in [.env.dev](https://github.com/interlay/interbtc-ui/blob/master/.env.dev)

Start the UI:

```bash
yarn start
```

### Test

Test the project.

```bash
yarn test
```

### Design System

Run or build Storybook.

```bash
yarn storybook # locally run
yarn build-storybook # build
```

## Contributing

See our [contribution guidelines](https://github.com/interlay/interbtc-ui/blob/master/CONTRIBUTING.md)

## Help

If you are searching for a place to start or would like to discuss features, reach out to us:

- [Discord](https://discord.gg/KgCYK3MKSf)

## License

(C) Copyright 2023 [Interlay](https://www.interlay.io) Ltd

interbtc-ui is licensed under the terms of the Apache License (Version 2.0). See [LICENSE](LICENSE).

## Contact

Website: [Interlay.io](https://www.interlay.io)

Twitter: [@interlayHQ](https://twitter.com/InterlayHQ)

Email: contact@interlay.io

## Acknowledgements

We would like to thank the following teams for their continuous support:

- [Web3 Foundation](https://web3.foundation/)
- [Parity Technologies](https://www.parity.io/)
