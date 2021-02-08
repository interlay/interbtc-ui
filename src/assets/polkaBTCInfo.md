## Content

-   ##### [Introduction](#into)
-   ##### [Roadmap](#roadmap)
-   ##### [Security Guarantees](#security)
-   ##### [Design](#design)
-   ##### [Step-by-Step Guide](#step-by-step)

<br/>
<br/>
<div id="into"></div>

## Introduction

In 2016, the [Polkadot whitepaper](https://polkadot.network/PolkaDotPaper.pdf) identified secure interoperability with Bitcoin as a critical and also challenging feature. In January 2020, with the launch of Polkadot on the horizon, the [Web3 Foundation](https://web3.foundation/in) commissioned [Interlay](https://www.interlay.io/) to design a trustless bridge from Bitcoin to Polkadot based on [XCLAIM](https://www.xclaim.io/) — a carefully designed, open and trustless system that guarantees the security of user’s funds.

The BTC-Parachain allows users to mint 1:1 Bitcoin-backed assets onto Polkadot - PolkaBTC - and use these across a wide range of applications, including decentralized exchanges, stablecoins, and lending protocols.

Funded by a [Web3 Foundation grant](https://web3.foundation/grants/), the BTC-Parachain is implemented in [Rust](https://www.rust-lang.org/) using [Parity](https://www.parity.io/)'s [Substrate framework](https://substrate.dev/).

##### Helpful Links

-   [Polkadot's blog post explaining PolkaBTC](https://polkadot.network/bitcoin-is-coming-to-polkadot/)

-   [BTC Parachain specification](https://interlay.gitlab.io/polkabtc-spec/)

-   [BTC Parachain open-source code](https://github.com/interlay/BTC-Parachain)

-   [XCLAIM peer-reviewed paper](https://eprint.iacr.org/2018/643.pdf)

-   [Interlay homepage](https://www.interlay.io/)

<div id="roadmap"></div>

<br/>
<br/>

## Roadmap

The Interlay team is building a customized Substrate environment for PolkaBTC, optimized to verify Bitcoin payments. The BTC Parachain includes a Bitcoin cross-chain SPV client (BTC-Relay), integrations with secure price oracles and XCMP, as well as support for hardware wallets. In addition, Interlay is also building client software for Vaults, Staked Relayers (who make sure BTC-Relay is up to date), as well as an easy-to-use web interface.

A first Alpha testnet is scheduled for November 2020 and a feature-ready Beta testnet will be launched in January 2021 . Once the audit of the code base is completed in February 2021 and parachains are enabled on Polkadot and Kusama, the BTC Parachain will go live: first on Kusama, then on Polkadot mainnet.

Sign up to get early access to PolkaBTC and be the first to test the first truly decentralized cross-chain bridge: https://forms.gle/JrNBD6Pe1F5QAg4z8

![PolkaBTC Roadmap](https://gitlab.com/interlay/images/-/raw/master/polkaBTC/user-guide/PolkaBTC%20roadmap.png)

<div id="security"></div>

<br/>
<br/>

## Security Guarantees: Trustless and Fully Decentralized

What makes the BTC-Parachain unique is the strict dedication to being trustless and decentralized:

-   **Trustless**. The bridge has no central authority. Right from the start, the BTC-Parachain will be run by a decentralized network of individuals, community members, and companies.
-   **Decentralized**. In the spirit of permissionless systems like Bitcoin, anyone can participate in operating the bridge: contrary to other approaches, you do not need permission or any additional token to become a maintainer and start earning fees.

As a holder of PolkaBTC, you have the following guarantee:

###### You can always redeem PolkaBTC for BTC, or be reimbursed in the collateral currency at a beneficial rate.

In the case that a vault misbehaves, you will be reimbursed from the Vault’s collateral and will make a very profitable trade between BTC and DOT. At launch, collateral will be put down in DOT. In the mid/long run, this may be extended to stablecoins or token-sets to improve stability.

Summarizing, to trust the bridge, you only need to:

-   Trust that Bitcoin is secure. Meaning: trust that Bitcoin blocks are final after X confirmations. The bridge will recommend a minimum of 6 confirmations, though users and apps are encouraged to set higher thresholds.
-   Trust that Polkadot is secure. This assumption is made by all applications running on top of Polkadot.

Read on to get a better understanding of the BTC-Parachain design and security guarantees.

<br/>
<br/>

<div id="design"></div>

## Design: The XCLAIM Framework

<div id="cba"></div>

#### Cryptocurrency-Backed Assets.

At the core, XCLAIM - the framework underlying the BTC-Parachain - introduces the concept of cryptocurrency-back assets. Assets are locked on Bitcoin and unlocked on Polkadot in form of 1:1 BTC backed-assets (PolkaBTC). PolkaBTC can be used just like any native asset within the Polkadot ecosystem, meaning: they can be easily transferred and integrated into other Parachains and applications.

![](https://cdn-images-1.medium.com/max/3200/0*7K1rmj7j0Cya0eB_)

#### Issue, Trade, Redeem

[XCLAIM](https://xclaim.io) consists of three main protocols, which also resemble the life-cycle of PolkaBTC:

-   **Issue**: Users create PolkaBTC on the BTC-Parachain by locking BTC with Vaults — non-trusted and collateralized intermediaries on Bitcoin (see below).

-   **Transfer**: Users transfer PolkaBTC to other users or migrate to other Parachains within the Polkadot ecosystem, integrating with stablecoins, decentralized exchanges, lending protocols etc.

-   **Redeem**: Users burn PolkaBTC on the BTC-Parachain to receive the _equivalent_ amount of BTC from Vaults on Bitcoin.

PolkaBTC can remain on Polkadot indefinitely (no expiry date) and can be redeemed at any point in time. Users who obtain PolkaBTC on Polkadot do not need a BTC wallet, until they decide to redeem the tokens for BTC (if at all).

#### Secure, Open, Efficient.

XCLAIM guarantees users can redeem PolkaBTC tokens for the corresponding amount of BTC or be reimbursed in the DOT at any point in time. To summarize, XCLAIM is:

-   **Financially Secure**: intermediaries pledge collateral and cryptographically prove correct behavior. Any attempt of theft is automatically punished, while users are reimbursed.

-   **Dynamic and Permissionless**: any user can become their own intermediary — simply, anytime, and without asking for permission. No need to rely on someone else, or any special hardware.

-   **Censorship Resistant**: By design, Vaults have no influence over the Issue process. That is, no Vault can prevent a user from minting or obtaining PolkaBTC.

-   **Fast and Efficient**: XCLAIM is on average 95% faster than using classic HTLC atomic swaps with Bitcoin.

#### Participating in the BTC Parachain

XCLAIM’s design has an emphasis on being open and permissionless. As such, any user can take up multiple roles at the same — but also leave the system whenever they wish. As such, to participate in the BTC Parachain, you can choose from:

**Users: **there are two types of user on the BTC Parachain:

-   **Liquidity Providers** lock BTC with Vaults to mint 1:1 backed _PolkaBTC_ on the Parachain. Requirement: (1) Bitcoin wallet and (2) Polkadot wallet.

-   **End-Users** obtain PolkaBTC from liquidity providers on Polkadot and use PolkaBTC for payments and with applications. Requirements: Polkadot wallet

Both can redeem owned PolkaBTC for BTC at any time (requires BTC wallet).

**Vaults:** collateralized intermediaries who hold BTC locked on Bitcoin. Any user can become a Vault by simply locking DOT collateral. The only requirements are (1) a Bitcoin wallet, (2) a Polkadot wallet and (3) some DOTs.

**Staked Relayers **make sure the BTC Parachain is up to date with the state of Bitcoin by submitting block headers to BTC-Relay, the [Parachain’s Bitcoin SPV client](https://medium.com/interlay/interlay-releases-codebase-for-btc-relay-on-polkadot-b37502ce88e3). Staked Relayers also flag (potentially) invalid blocks. Requirements: (1) Bitcoin full node, (2) Polkadot wallet, (3) some DOTs.

**Parachain Validators** participate in the BTC Parachain’s DPoS consensus, as per Polkadot consensus rules. Requirement: (1) Parachain full node and (2) DOTs.

#### BTC Parachain Components

All roles are coordinated through the **Parachain Execution Environment**, which encodes the functionality to issue, transfer and redeem PolkaBTC, and enforce correct behavior of Vaults. Thereby, the Parachain implements a multi-stage collateralization scheme, to protect against exchange rate fluctuations. The Parachain also verifies the correct execution of payments on Bitcoin via BTC-Relay, a Substrate Bitcoin SPV client. To transfer PolkaBTC to other Parachains, an integration with Polkadot’s Cross-Chain Message Passing (XCMP) will be provided.

![The BTC-Parachain is Polkadot’s trustless gateway for Bitcoin.](https://cdn-images-1.medium.com/max/3200/0*v1lfJ1ZK75luh16s)_The BTC-Parachain is Polkadot’s trustless gateway for Bitcoin._

<div id="step-by-step"></div>

## From BTC to PolkaBTC, Step by Step.

XCLAIM exhibits two core protocols, Issue and Redeem, outlined below.

#### Issue/Mint PolkaBTC

A user (liquidity provider) mints new PolkaBTC.

1. A user registers an *issue request *with a collateralized Vault of his choosing. This reserves the Vault’s DOT collateral (to prevent race conditions).

1. The user then sends BTC to the Vault,

1. And submits a transaction inclusion proof to the BTC-Relay.

1. The BTC-Relay verifies the Bitcoin transaction.

1. The user is allocated the equivalent amount of newly minted PolkaBTC

![High-level PolkaBTC Issue process](https://cdn-images-1.medium.com/max/3200/0*3OIDfIffZskXZmi7)_High-level PolkaBTC Issue process_

#### Redeem PolkaBTC for BTC

A user redeems PolkaBTC for the equivalent amount of BTC or receives DOT as reimbursement.

1. To request a redeem, a user locks PolkaBTC with the BTC Parachain.

1. The Parachain instructs a Vault to execute the redeem.

1. The Vault releases the correct amount of BTC to the user.

1. To unlock the DOT collateral, the Vault submits a transaction inclusion proof to BTC-Relay.

1. If the proof is correct, the Parachain releases the Vault’s DOTs.

1. If no valid proof is provided on time, the Parachain slashes the Vault’s DOTs and reimburses the user at a beneficial exchange rate.

In practice, a less strict approach will be taken, where Vaults remain unpunished for being offline (not stealing!) as long as they maintain an overall satisfactory SLA.

![High-level PolkaBTC Redeem process](https://cdn-images-1.medium.com/max/3200/0*GeYgUaeduwBxfgfN)_High-level PolkaBTC Redeem process_
