Eth Console Wallet
==================

<a href="https://www.npmjs.com/package/eth-console-wallet"><img src="https://img.shields.io/npm/v/eth-console-wallet.svg"></a>

This tool is used for creating wallet and allow to generate accounts for charging and sending ETH to another users.
**IMPORTANT**: current release is alpha.

## Getting started

First of all, you should install **eth-console-wallet**. You can do it by means the next command

#### Npm
```bash
$ npm i --global eth-console-wallet
```

or

#### Yarn
```bash
$ yarn global add eth-console-wallet
```

### Create a new wallet

Now, you should create a new wallet.

```bash
$ eth-console-wallet --init --passwork MY_PASSWORD
```

### Generate address

After, you created the wallet, you should create an address for getting ETH.

```bash
$ eth-console-wallet --generate --password MY_PASSWORD
```
If you want to create a bundle of addresses and manage them, you will need to add **--count NUMBER** and **--output PATH** to current command.

### Getting balance

Before, you use this command, you will need to create MY_ETHERSCAN_TOKEN at [Etherscan](https://etherscan.io) and add it to config.

```bash
$ eth-console-wallet --add --etherscanToken MY_ETHERSCAN_TOKEN
```

Now, you may ask your account balance.

```bash
$ eth-console-wallet --balance --address 0xMyAddress
```

### Send entire amount from wallet address

**NOTICE**: Now, it can send only all amount.

```bash
$ eth-console-wallet --withdrawAll --from 0xMyAddress --to 0xAnotherWallet --password MY_PASSWORD
```

## Roadmap

* Add sending of custome amount
* Add state for addresses
* Clean source code

If you have any suggestions, you will be able to report about that by means [issue](https://github.com/rusfearuth/EthConsoleWallet/issues/new).
