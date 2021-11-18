import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-etherscan";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import { task } from "hardhat/config";
import { HardhatUserConfig } from "hardhat/types";

const { alchemyApiKey, mnemonic, etherscanApiKey } = require("./secrets.json");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (_args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(await account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.6",
    settings: {
      optimizer: {
        enabled: true,
        runs: 10_000,
      },
    },
  },
  paths: {
    artifacts: "./artifacts",
  },
  networks: {
    hardhat: {
      chainId: 1337,
      loggingEnabled: false,
    },
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${alchemyApiKey}`,
      accounts: { mnemonic: mnemonic },
    },
  },
  etherscan: {
    apiKey: `${etherscanApiKey}`,
  },
  typechain: {
    outDir: "./typechain",
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS ? true : false,
  },
};

export default config;
