# create-nft-dao

Easily deploy your own NFT DAO

[dao.new](https://www.dao.new/)

# Packages

The project is organized as a monorepo with the following packages:

## contracts-frontend

The contracts-frontend package is a webapp for running an admin and mint page.

## hardhat

The hardhat package is the suite of solidity contracts used for deploying new NFT DAOs.

## shared-frontend

The shared-frontend package holds some webapp components used by both the contracts-frontend and wizard-frontend packages.

## wizard-frontend

The wizard-frontend package is the webapp running on [dao.new](https://www.dao.new/)

# Quickstart

Project was built based on [scaffold-eth's nextjs branch](https://github.com/scaffold-eth/scaffold-eth/tree/nextjs-typescript).

## Install dependencies

```
yarn
```

## Run local chain

```
yarn chain
```

## Run tests

```
yarn test
```

## Deploying contracts

see [README under the hardhat package](https://github.com/withtally/dao.new/blob/main/packages/hardhat/README.md)
