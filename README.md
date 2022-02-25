# interBTC

<div align="center">
	<p>
		<h3 align="center">interBTC: Trustless and open DeFi access for your Bitcoin.</h3>
	</p>
</div>

## About

The Interlay UI connects the Polkadot ecosystem with Bitcoin. It allows the creation of interBTC and kBTC, a fungible token that represents Bitcoin in the Polkadot and Kusama ecosystem. interBTC and kBTC are backed by Bitcoin 1:1 and allow redeeming of the equivalent amount of Bitcoins by relying on a collateralized third-party called Vaults.
In comparison to other bridge constructions (like tBTC, wBTC, or RenVM) _anyone_ can become an intermediary by depositing collateral making interBTC and kBTC the only truly open system.

The bridge itself follows the detailed specification: <a href="https://spec.interlay.io" target="_blank"><strong>Explore the specification »</strong></a>

It is implemented as a collection of open-source Substrate modules using Rust: <a href="https://gitlab.com/interlay/interbtc" target="_blank"><strong>Explore the implementation »</strong></a>

### Built with

- [React](https://github.com/facebook/react)
- [TypeScript](https://github.com/Microsoft/TypeScript)
- [polkadot-js](https://polkadot.js.org/)
- [yarn](https://github.com/yarnpkg/yarn)
- [docker-compose](https://docs.docker.com/compose/)

### Kintsugi

You can visit the Kintsugi application at [kintsugi.interlay.io](https://kintsugi.interlay.io).

### Testnet

You can visit [bridge.interlay.io](https://bridge.interlay.io/) for the latest testnet.

## Quickstart

Make sure you have [docker-compose](https://docs.docker.com/compose/install/) installed locally.

You can run the UI with a local instance of the Interlay or Kintsugi parachain and in combination with [Bitcoin regtest](https://developer.bitcoin.org/examples/testing.html#regtest-mode) or [Bitcoin testnet](https://developer.bitcoin.org/examples/testing.html#testnet) as follows:

Clone this repository and enter into the root folder.

```bash
git@gitlab.com:interlay/interbtc-ui.git
cd interbtc-ui
```

You can configure the application to use certain networks like the official test network as well as a local environment.
Please make use of the `.env.*` files to set build variables. The priority of these are [defined here](https://create-react-app.dev/docs/adding-custom-environment-variables/#what-other-env-files-can-be-used).

### Local Development

To achieve this, create a file `.env.development.local` and fill it with the following contents for either the Interlay or Kintsugi network versions:

### End-to-end testing

* Run `yarn start` and make sure the application is running on port 3000
* Run `yarn cypress:e2e`

#### Interlay Network

```bash
REACT_APP_RELAY_CHAIN_NAME="polkadot"
DOCKER_RELAY_CHAIN_CURRENCY=DOT
```

#### Kintsugi Network

```bash
REACT_APP_RELAY_CHAIN_NAME="kusama"
DOCKER_RELAY_CHAIN_CURRENCY=KSM
```

#### Starting the UI Locally

> Note: By default, use regtest for local development.

In one terminal, start the bridge, Bitcoin regtest, Vaults and oracles:

```bash
docker-compose --env-file .env.development.local up
```

On another terminal, start the UI:

```bash
yarn install && yarn start
```

### Alternative Local Development Setup

From this repo, run:

```
rm -rf node_modules
docker-compose down -v
yarn install
docker-compose --env-file .env.regtest up
```

In another terminal, with the docker-compose services running, in the latest master branch from the lib (https://github.com/interlay/interbtc-api/) run: `yarn install && USER_1_URI="//Charlie" yarn initialize`

Then start the UI in another terminal:

```
set -a
source .env.regtest
yarn start-regtest
```

### Connecting to the Interlay Development Environment

> Note: This environment might be unstable. It uses the Bitcoin testnet work.

Copy the content of the `.env.dev` file to `.env.development.local`.

```bash
cp .env.dev .env.development.local
```

Start the UI:

```bash
yarn install && yarn start
```

### Connecting to the Interlay Testnetwork

> Note: This environment might be unstable. It uses the Bitcoin testnet work.

Copy the content of the `.env.testnet` file to `.env.development.local`.

```bash
cp .env.testnet .env.development.local
```

Start the UI:

```bash
yarn install && yarn start
```

### Test

Test the project.

```bash
yarn test
```

### Design System

Visualize the Tailwindcss configuration.

```bash
yarn tailwind-config-viewer
```

Locally run or build Storybook.

```bash
yarn storybook # locally run
yarn build-storybook # build
```

## Help

### Bitcoin Regtest

Regtest is a local Bitcoin instance that allows you to practically anything including sending transactions, mining blocks, and generating new addresses.
For a full overview, [head over to the Bitcoin developer documentation](https://developer.bitcoin.org/examples/testing.html#regtest-mode).

**Sending Transactions**

For the issue process, you need to send a transaction. On regtest this can be achieved with:

```shell
bitcoin-cli -regtest -rpcwallet=Alice sendtoaddress VAULT_ADDRESS AMOUNT
```

**Mining Blocks**

In regtest, blocks are not automatically produced. After you sent a transaction, you need to mine e.g. 1 block:

```shell
bitcoin-cli -regtest generatetoaddress 1 $(bitcoin-cli -regtest getnewaddress)
```

**Getting Balances**

You can query the balance of your wallet like so:

```shell
bitcoin-cli -regtest -rpcwallet=Alice getbalance
```

### Docker

You can hard-reset the docker dependency setup with the following commands:

```shell
docker kill $(docker ps -q)
docker rm $(docker ps -a -q)
docker rmi $(docker images -q)
docker volume rm $(docker volume ls -q)
```

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are greatly appreciated.

1. Fork the Project
2. Create your Feature Branch (git checkout -b yourname/AmazingFeature)
3. Commit your Changes (git commit -m 'Add some AmazingFeature')
4. Push to the Branch (git push origin yourname/AmazingFeature)
5. Open a Pull Request

If you are searching for a place to start or would like to discuss features, reach out to us:

- [Discord](https://discord.gg/KgCYK3MKSf)

## License

(C) Copyright 2022 [Interlay](https://www.interlay.io) Ltd

interbtc-ui is licensed under the terms of the Apache License (Version 2.0). See [LICENSE](LICENSE).

## Contact

Website: [Interlay.io](https://www.interlay.io)

Twitter: [@interlayHQ](https://twitter.com/InterlayHQ)

Email: contact@interlay.io

## Acknowledgements

We would like to thank the following teams for their continuous support:

-   [Web3 Foundation](https://web3.foundation/)
-   [Parity Technologies](https://www.parity.io/)
