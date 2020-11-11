## Content
- ##### [Getting Started](#getting-started)
- ##### [Roadmap](#roadmap)
- ##### [Security Guarantees](#security)
- ##### [Design](#design)


<br/>
<br/>
<div id="getting-started"></div>

## Getting Started


### Bitcoin Testnet Wallet

Ensure you have a Bitcoin wallet. We recommended you pick one from the (non-exhaustive) list below, as we have tested with these and they have dedicated testnet support:



*   Android Testnet Wallet [https://play.google.com/store/apps/details?id=de.schildbach.wallet_test](https://play.google.com/store/apps/details?id=de.schildbach.wallet_test&hl=en&gl=US)
*   Green Address wallet: [https://greenaddress.it/en/](https://greenaddress.it/en/) 
*   Mycelium Testnet Wallet (Android or IOS): [https://wallet.mycelium.com/contact.html](https://wallet.mycelium.com/contact.html) 
*   Electrum desktop wallet: [https://electrum.org/#home](https://electrum.org/#home) (Recommended for advanced users - only wallet that currently supports OP_RETURN for advanced testing)

Otherwise, a good list of Bitcoin wallets can be found here: https://bitcoin.org/en/choose-your-wallet

Please note: manual transaction signing via hardware wallets is WIP and will be released before Beta testnet (Ledger). 


#### Getting Testnet Bitcoins

Make sure you have at least some tBTC in your wallet. You can get them from a faucet:



*   [https://testnet-faucet.mempool.co/](https://testnet-faucet.mempool.co/)
*   [https://bitcoinfaucet.uo1.net/](https://bitcoinfaucet.uo1.net/)
*   [https://coinfaucet.eu/en/btc-testnet/](https://coinfaucet.eu/en/btc-testnet/) 
*   [https://kuttler.eu/en/bitcoin/btc/faucet/](https://kuttler.eu/en/bitcoin/btc/faucet/) 
*   [https://tbtc.bitaps.com/](https://tbtc.bitaps.com/) 


#### Electrum: Advanced Users  & OP_RETURN Support

PolkaBTC currently makes use of OP_RETURN to prevent replay attacks (using same BTC payment for multiple issue requests. 

To test the bridge will all security features enabled, you can use the Electrum desktop wallet ([https://electrum.org/#download](https://electrum.org/#download)). While it is possible to use the bitcoin-core client to create and sign OP_RETURN transactions, we recommend you use Electrum except if you know what you are doing.

You can follow [this guide](https://bitzuma.com/posts/a-beginners-guide-to-the-electrum-bitcoin-wallet/) to set up a new Electrum wallet on your computer. 

You can start Electrum in testnet mode assuming you are using the Python sources:


```
python3 run_electrum --testnet
```


### Polkadot Wallet (Polkadot-js Browser Extension)

You will need the Polkadot-js browser extension to test PolkaBTC. 

*   Install the Polkadot.js extension in your browser: [https://github.com/polkadot-js/extension](https://github.com/polkadot-js/extension)  
*   Add an account

#### Getting Testnet DOT

You can get testnet DOT by clicking on the faucet link in the top bar of the PolkaBTC UI. 



<div id="issue"></div>

<br/>
<br/>
## Issue PolkaBTC (PolkaBTC UI + Bitcoin Testnet Wallet)


#### Issue page

The Issue page displays your current PolkaBTC and DOT balances. In addition, a table shows all of your ongoing/pending Issue requests. 


#### Issue Process

To issue PolkaBTC, follow the “Issue PolkaBTC” button on the Issue page. In the shown pop-up dialogue:



1. Enter the amount of PolkaBTC that you want to issue. 
    1. We will search for a Vault to serve your request. 
    2. The maximum amount of PolkaBTC that can be issued in a single request depends on the maximum amount of collateral a Vault has locked.(high-volume Issue requests, executed with multiple Vaults simultaneously, will be added as a feature before mainnet launch).
    3. You will currently no pay any fees. On mainnet, you will pay a small fee to the Vault. 
2. Review your issue request and make the BTC payment. 
    4. See how to execute a **BTC OP_RETURN payment below**
    5. Make sure to **keep hold of you Bitcoin transaction ID**
3. Once you have made the BTC payment, continue to the next page.
4. Enter the TXID of your Bitcoin transaction and close the dialogue. 
5. Wait. Once your transaction is included in Bitcoin and has gained sufficient confirmations, a button to finalize the issue process in the table. 
    6. Click on this “Execute” button to finalize the Issue process and claim your PolkaBTC. 


##### Issue process: BTC OP_RETURN Payment (Electrum Wallet)

To create an OP_RETURN transaction in Electrum, you can follow the following guide (initially designed for Omnilayer - which also uses Bitcoin OP_RETURN):  [https://jochen-hoenicke.de/crypto/omni/](https://jochen-hoenicke.de/crypto/omni/)



1. Launch the Electrum desktop wallet (in testnet mode!) and connect to your Bitcoin testnet account. You can follow [this guide](https://bitzuma.com/posts/a-beginners-guide-to-the-electrum-bitcoin-wallet/) if you need to set up a new Electrum wallet on your computer. 
2. Go to the “Send” tab in the wallet.
3. Copy & paste the Electrum payment instructions into the “Pay to” field. The Electrum payment instructions are displayed in the “Confirmation and Payment” step of the “Issue PolkaBTC” dialogue (see screenshots below).
4. Execute the payment. 
5. Copy the Bitcoin transaction ID and submit it to the PolkaBTC UI as requested. 

 
![Issue dialogue screenshot](https://gitlab.com/interlay/polkabtc-ui/-/raw/master/src/assets/img/user-guide/issue-modal.png)


![Electrum wallet screenshot](https://gitlab.com/interlay/polkabtc-ui/-/raw/master/src/assets/img/user-guide/issue-electrum-wallet.png)


<div id="redeem"></div>

<br/>
<br/>

## Redeem PolkaBTC (PolkaBTC UI)


#### Redeem page

The Redeem page displays your current PolkaBTC and DOT balances. 

In addition, the table shows all of your ongoing Redeem requests. 


#### Redeem Process

To redeem PolkaBTC, follow the “Redeem PolkaBTC” button on the Redeem page. In the shown modal:



1. Enter the amount of PolkaBTC that you want to redeem.
    1. A Vault will be assigned to you for this request. 
    2. The maximum amount of PolkaBTC that you can redeem at in a single request depends on the maximum amount of BTC a Vault has locked (high-volume Redeem requests, executed with multiple Vaults simultaneously, will be added as a feature before mainnet launch).
2. Enter your Bitcoin address.
    3. Supported address formats: P2WPKH, P2WSH, P2PKH, P2SH. Segwit addresses can be entered in Bech32 format. 
3. Review and confirm the Redeem request.
4. The Redeem request is now being processed by the Vault. Updates will appear in the table on the Redeem page. 


### Dashboard

The Dashboard shows the current status of the PolkaBTC bridge / the BTC-Parachain. 

At the top of the page, you can see the total amount of locked DOT collateral across all Vaults, the amount of minted PolkaBTC, as well as the current overall collateralization rate. 


##### Bitcoin Relay Status 

This table shows the state of the Bitcoin mainchain, as tracked by the BTC-Parachain and the [Blockstream testnet explorer](https://blockstream.info/testnet/) (“Bitcoin Core”).

As long as the table shows “Online”, you can safely use the bridge. 


##### Vaults 

This table displays all Vaults registered with the bridge. For each Vault, you can see:



*   the BTC-Parachain account,
*   the BTC address,
*   the amount of locked DOT collateral,
*   the amount of BTC held in custody, 
*   the collateralization rate, and
*   whether the Vault is currently active. 


##### Oracle Status

This table shows the status of all exchange rate oracles connected to the BTC-Parachain, serving the latest BTC/DOT price. 

As long as the table shows “Online”, you can safely use the bridge. 


##### Staked Relayer

This table displays all Staked Relayers registered with the bridge. For each Staked Relayer, you can see:



*   the BTC-Parachain account,
*   the amount of locked DOT stake,
*   whether the Staked Relayer is currently active. 

As long as the table shows “Ok”, you can safely use the bridge. 
