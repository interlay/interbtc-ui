
# Bitcoin on Polkadot: Proof-of-Concept for Trustless Bridge Shipped

In line with the first phase of the Polkadot launch, Interlay has released the Proof-of-Concept for a trustless bridge from Bitcoin to Polkadot: the BTC Parachain. Once online, users will be able to mint 1:1 Bitcoin-backed assets onto Polkadot, so-called PolkaBTC, and use these across a wide range of applications, including decentralized exchanges, stablecoins and lending protocols. Under the hood, the BTC-Parachain implements XCLAIM, the only cross-chain framework that is financially trustless, permissionless and censorship-resistant — and backed by top-tier research.

**Funded by a[ Web3 Foundation grant](https://web3.foundation/grants/)**, the BTC-Parachain is implemented in Rust using [Parity](https://www.parity.io/)’s [Substrate](https://substrate.dev/) framework. The code is available as open-source on [Github](https://github.com/interlay/BTC-Parachain) and the [specification](https://interlay.gitlab.io/polkabtc-spec/) is released online. To participate in the BTC Parachain, e.g. become a Validator or Vault, or to integrate with your service: read up on the details below and/or [sign up here](https://forms.gle/c5mi1sz6QV7CJoee6).

![](https://cdn-images-1.medium.com/max/3200/0*6O1fwMDAngcENbI7)

## PolkaBTC: Financially Trustless Bitcoin on Polkadot

In 2016, the Polkadot whitepaper identified secure interoperability with Bitcoin as a critical and also challenging feature. In January 2020, with the launch of Polkadot on the horizon, Web3 Foundation commissioned Interlay to design a trustless bridge from Bitcoin to Polkadot based on XCLAIM — a carefully designed, open and trustless system that guarantees the security of user’s funds.

### Cryptocurrency-Backed Assets.

At the core, XCLAIM introduces the concept of cryptocurrency-back assets. Assets are locked on Bitcoin and unlocked on Polkadot in form of 1:1 BTC backed-assets (PolkaBTC). PolkaBTC can be used just like any native asset within the Polkadot ecosystem, meaning: they can be easily transferred and integrated into other Parachains and applications.

![](https://cdn-images-1.medium.com/max/3200/0*7K1rmj7j0Cya0eB_)

### Issue, Trade, Redeem.

[XCLAIM](https://xclaim.io) consists of three main protocols, which also resemble the life-cycle of PolkaBTC:

* **Issue**: Users create PolkaBTC on the BTC-Parachain by locking BTC with Vaults — non-trusted and collateralized intermediaries on Bitcoin (see below).

* **Transfer**: Users transfer PolkaBTC to other users or migrate to other Parachains within the Polkadot ecosystem, integrating with stablecoins, decentralized exchanges, lending protocols etc.

* **Redeem**: Users burn PolkaBTC on the BTC-Parachain to receive the *equivalent* amount of BTC from Vaults on Bitcoin.

PolkaBTC can remain on Polkadot indefinitely (no expiry date) and can be redeemed at any point in time. Users who obtain PolkaBTC on Polkadot do not need a BTC wallet, until they decide to redeem the tokens for BTC (if at all).

### Secure, Open, Efficient.

XCLAIM guarantees users can redeem PolkaBTC tokens for the corresponding amount of BTC or be reimbursed in the DOT at any point in time. To summarize, XCLAIM is:

* **Financially Secure**: intermediaries pledge collateral and cryptographically prove correct behavior. Any attempt of theft is automatically punished, while users are reimbursed.

* **Dynamic and Permissionless**: any user can become their own intermediary — simply, anytime, and without asking for permission. No need to rely on someone else, or any special hardware.

* **Censorship Resistant**: By design, Vaults have no influence over the Issue process. That is, no Vault can prevent a user from minting or obtaining PolkaBTC.

* **Fast and Efficient**: XCLAIM is on average 95% faster than using classic HTLC atomic swaps with Bitcoin.

## Under the Hood.

We will now take a closer look at XCLAIM’s design.

### Participating in the BTC Parachain

XCLAIM’s design has an emphasis on being open and permissionless. As such, any user can take up multiple roles at the same — but also leave the system whenever they wish. As such, to participate in the BTC Parachain, you can choose from:

**Users: **there are two types of user on the BTC Parachain:

* **Liquidity Providers** lock BTC with Vaults to mint 1:1 backed *PolkaBTC* on the Parachain. Requirement: (1) Bitcoin wallet and (2) Polkadot wallet.

* **End-Users** obtain PolkaBTC from liquidity providers on Polkadot and use PolkaBTC for payments and with applications. Requirements: Polkadot wallet

Both can redeem owned PolkaBTC for BTC at any time (requires BTC wallet).

**Vaults:** collateralized intermediaries who hold BTC locked on Bitcoin. Any user can become a Vault by simply locking DOT collateral. The only requirements are (1) a Bitcoin wallet, (2) a Polkadot wallet and (3) some DOTs.

**Staked Relayers **make sure the BTC Parachain is up to date with the state of Bitcoin by submitting block headers to BTC-Relay, the [Parachain’s Bitcoin SPV client](https://medium.com/interlay/interlay-releases-codebase-for-btc-relay-on-polkadot-b37502ce88e3). Staked Relayers also flag (potentially) invalid blocks. Requirements: (1) Bitcoin full node, (2) Polkadot wallet, (3) some DOTs.

**Parachain Validators** participate in the BTC Parachain’s DPoS consensus, as per Polkadot consensus rules. Requirement: (1) Parachain full node and (2) DOTs.

### BTC Parachain Components

All roles are coordinated through the **Parachain Execution Environment**, which encodes the functionality to issue, transfer and redeem PolkaBTC, and enforce correct behavior of Vaults. Thereby, the Parachain implements a multi-stage collateralization scheme, to protect against exchange rate fluctuations. The Parachain also verifies the correct execution of payments on Bitcoin via BTC-Relay, a Substrate Bitcoin SPV client. To transfer PolkaBTC to other Parachains, an integration with Polkadot’s Cross-Chain Message Passing (XCMP) will be provided.

![The BTC-Parachain is Polkadot’s trustless gateway for Bitcoin.](https://cdn-images-1.medium.com/max/3200/0*v1lfJ1ZK75luh16s)*The BTC-Parachain is Polkadot’s trustless gateway for Bitcoin.*

### From BTC to PolkaBTC, Step by Step.

XCLAIM exhibits two core protocols, Issue and Redeem, outlined below.

**Issue.** A user (liquidity provider) mints new PolkaBTC.

1. A user registers an *issue request *with a collateralized Vault of his choosing. This reserves the Vault’s DOT collateral (to prevent race conditions).

1. The user then sends BTC to the Vault,

1. And submits a transaction inclusion proof to the BTC-Relay.

1. The BTC-Relay verifies the Bitcoin transaction.

1. The user is allocated the equivalent amount of newly minted PolkaBTC

![High-level PolkaBTC Issue process](https://cdn-images-1.medium.com/max/3200/0*3OIDfIffZskXZmi7)*High-level PolkaBTC Issue process*

**Redeem.** A user redeems PolkaBTC for the equivalent amount of BTC or receives DOT as reimbursement.

1. To request a redeem, a user locks PolkaBTC with the BTC Parachain.

1. The Parachain instructs a Vault to execute the redeem.

1. The Vault releases the correct amount of BTC to the user.

1. To unlock the DOT collateral, the Vault submits a transaction inclusion proof to BTC-Relay.

1. If the proof is correct, the Parachain releases the Vault’s DOTs.

1. If no valid proof is provided on time, the Parachain slashes the Vault’s DOTs and reimburses the user at a beneficial exchange rate.

In practice, a less strict approach will be taken, where Vaults remain unpunished for being offline (not stealing!) as long as they maintain an overall satisfactory SLA.

![High-level PolkaBTC Redeem process](https://cdn-images-1.medium.com/max/3200/0*GeYgUaeduwBxfgfN)*High-level PolkaBTC Redeem process*

## Next Steps: The Beginning of a Thriving Ecosystem

The BTC-Parachain is an open system without centralized management. Anyone can become a stakeholder and help to maintain correct operation of the bridge, earning fees for the effort.

**Want to help make Web3 interoperable?**

* Sign up for the private Alpha testnet

* Become a Vault, Staked Relayer or Parachain Validator

* Learn about new Bitcoin cross-chain DeFi products?

[**Sign up here.](https://forms.gle/c5mi1sz6QV7CJoee6)**

## Helpful Links

* BTC Parachain open-source code: h[ttps://github.com/interlay/BTC-Parachain](https://github.com/interlay/BTC-Parachain)

* BTC Parachain specification: [https://interlay.gitlab.io/polkabtc-spec/](https://interlay.gitlab.io/polkabtc-spec/)

* Interlay:[ ](https://www.interlay.io/careers)[https://www.interlay.io/](https://www.interlay.io/)

* XCLAIM peer-reviewed paper: [https://eprint.iacr.org/2018/643.pdf](https://eprint.iacr.org/2018/643.pdf)

* XCLAIM project website: [https://www.xclaim.io/](https://www.xclaim.io/)

## Polkadot: A Heterogeneous Multi-Chain Framework

[Polkadot](https://polkadot.network/) is a platform built to connect and secure blockchains, independent of design and purpose. The Polkadot network relies on a sharded model where shards, called “parachains”, have unique state transition functions, i.e., can be designed for specific use cases. As long as a chain’s logic can compile to[ Wasm](https://webassembly.org/), it can connect to the Polkadot network as a parachain. Polkadot has a Relay Chain acting as the main chain of the system, which handles validation and finalization of blocks proposed by parachains.

With the Polkadot network, parachains can seamlessly communicate via trust-free message passing ([XCMP](https://wiki.polkadot.network/docs/en/learn-crosschain)). To interact with external blockchains such as Bitcoin, Polkadot uses[ bridge parachains](https://wiki.polkadot.network/docs/en/learn-bridges) that offer two-way compatibility — for example the BTC-Parachain.

## Interlay: Decentralized Finance Made Interoperable

At [Interlay](https://interlay.io/), we envision a future where permissioned and permissionless blockchains, regardless of design and purpose, can seamlessly connect and interact. From trustless loans to decentralized derivatives & exchanges: users should access their preferred digital currency and financial product on any blockchain platform.

Interlay’s platform consists of two components: (1) [XCLAIM](https://www.xclaim.io/), the open-source framework for trustless cross-chain communication, and (2) [XOpts](https://xopts.io/), the first non-custodial, peer-to-peer trading platform for cross-chain derivatives (e.g. BTC/ETH, BTC/DAI and BTC/DOT).

Founded by Imperial College London PhDs, who have been working on blockchain security and game theory for the past 5 years, Interlay takes a research-driven approach: our bleeding-edge tech is backed by top-tier, peer-reviewed research.
