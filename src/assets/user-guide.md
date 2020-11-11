<!-- Output copied to clipboard! -->

<!-----
NEW: Check the "Suppress top comment" option to remove this info from the output.

Conversion time: 1.283 seconds.


Using this Markdown file:

1. Paste this output into your source file.
2. See the notes and action items below regarding this conversion run.
3. Check the rendered output (headings, lists, code blocks, tables) for proper
   formatting and use a linkchecker before you publish this page.

Conversion notes:

* Docs to Markdown version 1.0β29
* Wed Nov 11 2020 07:38:11 GMT-0800 (PST)
* Source doc: PolkaBTC UI User Interaction Guide
* Tables are currently converted to HTML tables.
* This document has images: check for >>>>>  gd2md-html alert:  inline image link in generated source and store images to your server. NOTE: Images in exported zip file from Google Docs may not appear in  the same order as they do in your doc. Please check the images!

----->


<p style="color: red; font-weight: bold">>>>>>  gd2md-html alert:  ERRORs: 0; WARNINGs: 0; ALERTS: 2.</p>
<ul style="color: red; font-weight: bold"><li>See top comment block for details on ERRORs and WARNINGs. <li>In the converted Markdown or HTML, search for inline alerts that start with >>>>>  gd2md-html alert:  for specific instances that need correction.</ul>

<p style="color: red; font-weight: bold">Links to alert messages:</p><a href="#gdcalert1">alert1</a>
<a href="#gdcalert2">alert2</a>

<p style="color: red; font-weight: bold">>>>>> PLEASE check and correct alert issues and delete this message and the inline alerts.<hr></p>



## PolkaBTC User Interaction Guide


### Interlay Ltd

October 7, 2020



<p id="gdcalert1" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image1.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert2">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image1.png "image_tooltip")



[TOC]



## Prerequisites


### Bitcoin testnet wallet

Ensure you have a Bitcoin wallet that is capable of sending OP_RETURN transactions on the Bitcoin testnet. While it is possible to use the bitcoin-core client to create and sign OP_RETURN transactions, we suggest to use the Electrum desktop wallet for quick testing. 

We suggest to use Electrum for quick testing: [https://electrum.org/#download](https://electrum.org/#download)

You can start Electrum in testnet mode assuming you are using the Python sources:


```
python3 run_electrum --testnet
```


Ensure you have a Bitcoin testnet wallet or create a new testnet wallet. Make sure you have at least some tBTC in your wallet. You can get them from a faucet:



*   [https://testnet-faucet.mempool.co/](https://testnet-faucet.mempool.co/)
*   [https://bitcoinfaucet.uo1.net/](https://bitcoinfaucet.uo1.net/)


### Polkadot-js extension



*   Install the Polkadot.js extension in your browser: [https://github.com/polkadot-js/extension](https://github.com/polkadot-js/extension)  
*   Add an account, using the one of the following seed:

    **ALICE Seed: 0xe5be9a5092b81bca64be81d212e7f2f9eba183bb7a90954f7b76361f6edb5c0a**

    *   _Public key (hex): _0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d
    *   _Account ID:       _0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d
    *   _SS58 Address:     _5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY

    **BOB: 0x398f0c28f98885e046333d4a41c19cee4c37368a9832c6502f6cfd182e2aef89**

    *   Public key (hex): 0x8eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a48
    *   Account ID:       0x8eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a48
    *   SS58 Address:   5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty


### Quickstart:


```
git clone https://gitlab.com/interlay/polkabtc-ui
cd polkabtc-ui
yarn install

# regtest
docker-compose up --detach
REACT_APP_BITCOIN_NETWORK=regtest yarn start

# testnet
bitcoind -testnet -server &
docker-compose --file docker-compose.testnet.yml up --detach
REACT_APP_BITCOIN_NETWORK=testnet yarn start
```



### Manual Setup


#### BTC-Parachain

Instructions available here:

[https://gitlab.com/interlay/btc-parachain](https://gitlab.com/interlay/btc-parachain)

Then clear any previous state and run the parachain with:


```
cargo run -- purge-chain --dev && cargo run -- --dev
```



#### Clients

All of the Rust clients are available in the `polkabtc-clients` repository:


```
git clone git@gitlab.com:interlay/polkabtc-clients.git
cd polkabtc-clients
```



##### Staked Relayer

Start the staked relayer:


```
cargo run -p staked-relayer
```



##### Oracle

Start the oracle from the the polkabtc-clients repository (same as staked relayer):


```
cargo run -p oracle
```



##### Vault

Start the vault from the the polkabtc-clients repository (same as staked relayer):


```
cargo run -p vault
```


We currently use the Bitcoin Core Wallet for managing funds, but we require at least one address to be registered on the Parachain to verify receipt of user funds.

Execute the testdata-gen package from the polkabtc-clients repository (same as staked relayer):


```
ADDRESS=$(bitcoin-cli -regtest getnewaddress)
cargo run -p testdata-gen -- --keyring alice register-vault --btc-address ${ADDRESS} --collateral 10000
```



#### UI


```
git clone https://gitlab.com/interlay/polkabtc-ui
cd polkabtc-ui
yarn install
yarn start
```



## User Flows


### Issue (PolkaBTC UI + Electrum Wallet for Bitcoin)


#### Issue page

The Issue page displays the current PolkaBTC and DOT balances of the user. 

In addition, the table shows all current and historic Issue requests. 


#### Issue Process

To issue PolkaBTC, follow the “Issue PolkaBTC” button on the Issue page. In the shown modal:



1. Enter the amount of PolkaBTC that you want to issue
    1. Upper limit for a single Issue request: the maximum amount of PolkaBTC a single Vault can currently issue, given its collateralization rate (multi-Vault issuance is a separate feature)
    2. The displayed fees are currently hardcoded (will be updated once the fee model is finalized)
2. Review your issue request. 
    3. On the same modal page: **make the BTC OP_RETURN payment (see below)**
    4. Once you have made the BTC payment, continue to the next page.
3. Enter the TXID of your Bitcoin transaction. 
    5. Updates will be shown in the table of the Issue page.
4. Once the transaction is included in Bitcoin and has reached sufficient confirmations, a button to finalize the issue process will appear in the row of this Issue request. 
    6. Click on the button to finalize the Issue process and to receive PolkaBTC. 


#### BTC OP_RETURN Payment (Electrum Wallet)

To create an OP_RETURN transaction in Electrum, you can follow the following guide (initially designed for Omnilayer - which also uses Bitcoin OP_RETURN):  [https://jochen-hoenicke.de/crypto/omni/](https://jochen-hoenicke.de/crypto/omni/)

**tl;dr**

You can add OP_RETURN outputs to your transaction by entering 


```
"OP_RETURN <insert data here>, 0" 
```


as a recipient into a new line in the “Pay to” field. 

Note: it does not make a difference if the OP_RETURN ist the first or the second output.



<p id="gdcalert2" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image2.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert3">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image2.png "image_tooltip")



### Redeem (PolkaBTC UI)


#### Redeem page

The Redeem page displays the current PolkaBTC and DOT balances of the user. 

In addition, the table shows all current and historic Redeem requests. 


#### Redeem Process

To redeem PolkaBTC, follow the “Redeem PolkaBTC” button on the Redeem page. In the shown modal:



1. Enter the amount of PolkaBTC that you want to redeem
    1. A Vault will be assigned to you for this request. 
    2. Upper limit for a single Redeem request: the maximum amount of BTC a single Vault can currently disburse (multi-Vault redeem is a separate feature).
2. Enter your Bitcoin address
    3. Currently: testnet format
3. Review and confirm the Redeem request
4. The Redeem request is now being processed and updates will appear in the table on the Redeem page. 
    4. Close the modal.


### Staked Relayer (PolkaBTC UI)


#### Staked Relayer page

The Staked Relayer page provides information about the status of the BTC-Relay, BTC-Parachain, and Oracle. An overview of all Vaults currently registered in the system, incl. collateralization rates and status, is also provided. 

In case the Staked Relayer has already registered, the amount of locked DOT collateral, as well as the amount of earned fees are shown at the top.


#### Register



5. To register as a Staked Relayer, click on the “Register” button shown at the top of the screen (shown only if not yet registered). 
6. You will be asked to enter the amount of DOT collateral that you want to provide (the more collateral locked, the more your votes on Parachain status updates will count).
7. You will then be prompted to sign a transaction, finalizing the registration. 


#### Deregister



1. To deregister as a Staked Relayer, click on the “Deregister” button shown at the bottom of the screen (shown only if already registered). 
2. You will then be prompted to sign a transaction, finalizing the deregistration.

Note: you can only deregister if you are not participating in ongoing votes on Parachain status updates. 


#### Report Invalid BTC Block

Staked Relayers can manually report that an invalid BTC block (header) has been submitted to the BTC-Relay. 



1. Click on “Report Invalid Bitcoin Block”
2. Enter the 
    1. BTC-Relay block (hash) that you wish to report (little endian format). Note: the block hash must be contained in the mainchain or a fork tracked by BTC-Relay
    2. Provide a message / proof for the invalidity of the block. This message will be reviewed by other Staked Relayers when casting their vote.
3. The status update vote will then appear in the BTC-Parachain status table (with your vote cast in favour). 


#### Vote on Parachain Status Update

The Staked Relayer dashboard provides a table of all ongoing and historic (as stored in the Parachain) Parachain status updates / votes.

To participate in an ongoing vote:



1. Select the status update proposal in the table and click on “Vote”
    1. Ongoing votes show a “Vote” button in the far right column of the table. 
2. In the prompt, vote “Yes” or “No”.
    2. A Parachain transaction will be broadcast by the Staked Relayer client upon clicking on “Yes” or “No”.

Note: you can only cast your vote once and **cannot change your vote once cast. **


### Vault (PolkaBTC UI)

Vaults lock DOT collateral with the BTC-Parachain and receive BTC from users to hold in custody while PolkaBTC exists. 

The Vault Dashboard shows:



*   The amount of locked DOT collateral, 
*   The amount of BTC locked with this Vault,
*   How many fees the Vault has earned so far,
*   The Vault’s registered BTC address,
*   The amount of actively used DOT collateral, and
*   The collateralization rate (in %).


#### Register



1. To register as a Vault, click on the “Register” button shown at the top of the screen (shown only if not yet registered). 
2. You will be asked to enter:
    1. The amount of DOT collateral that you want to provide. This determines how much BTC you will be able to hold in custody. 
    2. Your Bitcoin address to receive BTC deposits from users. 
3. You will then be prompted to sign a transaction, finalizing the registration. 

Your newly locked collateral will now be shown at the top of the page. The collateralization ratio is “infinity” because you have not yet accepted any BTC into custody. 


#### Update BTC Address

You can update your BTC address at any time. Note: pending Issue requests will be executed against the BTC address tracked by the BTC-Parachain at the time of the request.



1. Click on the “Edit” button next to your BTC address at the top of the screen. 
2. In the shown dialogue, enter your new BTC address, press on the “Update” button.

Your BTC address has now been updated. 

Please note: it is your responsibility to ensure you track and maintain all BTC addresses you specify. Failing to do so may result in loss of your collateral. 


#### Top-up/Withdraw Collateral

Vaults must also maintain a certain collateralization ratio (**currently**: 200% target) and are asked to update their collateral accordingly. You can also withdraw any surplus collateral, i.e., collateral that is not currently being used to secure BTC/PolkaBTC. 



1. Click on the “Edit” button next to the collateral display (“XX DOT for YY BTC”).
2. In the shown dialogue, enter the new **total** collateral amount. 
    1. If you want to add more collateral, enter a **higher amount** of DOT collateral than currently locked.
    2. If you want to add more collateral, enter a **lower amount** of DOT collateral than currently locked. Note: you will only be able to withdraw as long as the collateralization rate is above 200%. 


#### Replace Vault

Collateral not used to secure PolkaBTC can be freely withdrawn (up until 200% overall collateralization). 

When a user requests to redeem PolkaBTC, the Vault may be selected to execute the request - in this case, the Vault client will disburse BTC to the user’s BTC address and submit a proof the BTC-Parachain. 


### 
