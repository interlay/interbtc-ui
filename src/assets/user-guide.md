## Content
- ##### [Getting Started](#getting-started)
- ##### [Issue PolkaBTC](#issue)
- ##### [Redeem PolkaBTC](#redeem)
- ##### [Dashboard](#dashboard)


<br/>
<br/>
<div id="getting-started"></div>

## Getting Started


### Bitcoin Testnet Wallet

You will need a Bitcoin testnet wallet to test PolkaBTC. 

PolkaBTC currently makes use of OP_RETURN to prevent replay attacks (using same BTC payment for multiple issue requests. As such, you need a **Bitcoin testnet wallet with OP_RETURN support**. 

Please pick from the list below:

- Electrum desktop wallet ([https://electrum.org/#download](https://electrum.org/#download)). 
- If you know what you are doing, you can also use the [bitcoin-core](https://bitcoin.org/en/bitcoin-core/) client with/without bitcoin.js ([example](https://bitcoinjs-guide.bitcoin-studio.com/bitcoinjs-guide/v5/part-four-data-anchoring/data_anchoring_op_return.html)). 

_Know other wallets with OP_RETURN support? Please drop us an email at polkabtc@interlay.io (subject "OpReturn wallet support") and we will test & integrate_.


**We recommend that you use the [Electrum desktop wallet](https://electrum.org/#download)**. 

You can follow [this guide](https://bitzuma.com/posts/a-beginners-guide-to-the-electrum-bitcoin-wallet/) to set up a new Electrum wallet on your computer. 
Note: make sure you start **Electrum in testnet mode**. For example, if you are using the Python sources:

```
python3 run_electrum --testnet
```


Please note: manual transaction signing via hardware wallets is WIP and will be released before Beta testnet (Ledger). 

##### Supported Bitcoin Address Formats
We currently support the following **testnet** BTC address formats:
- P2WPKH
- P2WSH

**in bech32 format**. 

Support for legacy address formats will be added later. 

### Getting Testnet Bitcoin

Make sure you have at least some tBTC in your wallet. You can get them from a faucet:



*   [https://testnet-faucet.mempool.co/](https://testnet-faucet.mempool.co/)
*   [https://bitcoinfaucet.uo1.net/](https://bitcoinfaucet.uo1.net/)
*   [https://coinfaucet.eu/en/btc-testnet/](https://coinfaucet.eu/en/btc-testnet/) 
*   [https://kuttler.eu/en/bitcoin/btc/faucet/](https://kuttler.eu/en/bitcoin/btc/faucet/) 
*   [https://tbtc.bitaps.com/](https://tbtc.bitaps.com/) 


### Polkadot Testnet Wallet (Polkadot-js Browser Extension)

You will need the Polkadot-js browser extension to test PolkaBTC. 

1.   Install the Polkadot.js extension in your browser: [https://github.com/polkadot-js/extension](https://github.com/polkadot-js/extension)  
2.   Create a new account. 
3.   Connect account to polkaBTC.io via the Polkadot.js pop-up.

**Please make sure to first create an account before connecting your wallet to polkaBTC.io!**. 

### Getting Testnet DOT

You can get testnet DOT by clicking on the faucet link in the top bar of the PolkaBTC UI. Note: these testnet DOT are only usable on the BTC-Parachain.



<div id="issue"></div>

<br/>
<br/>

## Issue PolkaBTC (PolkaBTC UI + Bitcoin Testnet Wallet)


### Issue page

The Issue page displays your current PolkaBTC and DOT balances. In addition, a table shows all of your ongoing/pending Issue requests. 


### Issue Process

**Don't forget to get some testnet DOT via the faucet ("Request DOT" button, right side of top bar) before making an issue request. You will need this to pay for parachain transaction fees**. 

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


#### Issue process: BTC OP_RETURN Payment (Electrum Wallet)

To create an OP_RETURN transaction in Electrum, you can follow the following guide (initially designed for Omnilayer - which also uses Bitcoin OP_RETURN):  [https://jochen-hoenicke.de/crypto/omni/](https://jochen-hoenicke.de/crypto/omni/)



1. Launch the Electrum desktop wallet (in testnet mode!) and connect to your Bitcoin testnet account. You can follow [this guide](https://bitzuma.com/posts/a-beginners-guide-to-the-electrum-bitcoin-wallet/) if you need to set up a new Electrum wallet on your computer. 
2. Go to the “Send” tab in the wallet.
3. Copy & paste the Electrum payment instructions into the “Pay to” field. The Electrum payment instructions are displayed in the “Confirmation and Payment” step of the “Issue PolkaBTC” dialogue (see screenshots below).
4. Execute the payment. 
5. Copy the Bitcoin transaction ID and submit it to the PolkaBTC UI as requested. 


<!-- Only shown on master. TODO: find better way of hosting imported images.--> 
![Issue dialogue screenshot](https://gitlab.com/interlay/images/-/raw/master/polkaBTC/user-guide/issue-modal.png)
![Electrum wallet screenshot](https://gitlab.com/interlay/images/-/raw/master/polkaBTC/user-guide/issue-electrum-wallet.png)


<div id="redeem"></div>

<br/>
<br/>

## Redeem PolkaBTC (PolkaBTC UI)


### Redeem page

The Redeem page displays your current PolkaBTC and DOT balances. 

In addition, the table shows all of your ongoing Redeem requests. 


### Redeem Process

To redeem PolkaBTC, follow the “Redeem PolkaBTC” button on the Redeem page. In the shown modal:



1. Enter the amount of PolkaBTC that you want to redeem.
    1. A Vault will be assigned to you for this request. 
    2. The maximum amount of PolkaBTC that you can redeem at in a single request depends on the maximum amount of BTC a Vault has locked (high-volume Redeem requests, executed with multiple Vaults simultaneously, will be added as a feature before mainnet launch).
2. Enter your Bitcoin address.
    3. Supported address formats: P2WPKH, P2WSH **currently in bech32 format only!**. 
3. Review and confirm the Redeem request.
4. The Redeem request is now being processed by the Vault. Updates will appear in the table on the Redeem page. 



<div id="dashboard"></div>

<br/>
<br/>

## Dashboard

The Dashboard shows the current status of the PolkaBTC bridge / the BTC-Parachain. 

At the top of the page, you can see the total amount of locked DOT collateral across all Vaults, the amount of minted PolkaBTC, as well as the current overall collateralization rate. 


##### Bitcoin Relay Status 

This table shows the state of the Bitcoin mainchain, as tracked by the BTC-Parachain and the [Blockstream testnet explorer](https://blockstream.info/testnet/) (“Bitcoin Core”).

You can safely use the bridge as long as the table shows "Online".


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

You can safely use the bridge as long as the table shows "Online".


##### Staked Relayer

This table displays all Staked Relayers registered with the bridge. For each Staked Relayer, you can see:



*   the BTC-Parachain account,
*   the amount of locked DOT stake,
*   whether the Staked Relayer is currently active. 

You can safely use the bridge as long as the table shows "Ok".
