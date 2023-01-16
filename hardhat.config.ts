import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-preprocessor";
import "hardhat-abi-exporter";

import "./tasks/deploy";
import { resolve } from "path";

import { config as dotenvConfig } from "dotenv";
import { HardhatUserConfig, task } from "hardhat/config";

dotenvConfig({ path: resolve(__dirname, "./.env") });

const config: HardhatUserConfig = {
  networks: {
    hardhat: {
      initialBaseFeePerGas: 0,
    },
    mainnet: {
      url: "https://evm.kava.io",
      accounts: [process.env.PRIVATE_KEY!, process.env.PRIVATE_KEY_ADMIN!]
    },
    testnet: {
      url: "https://evm.testnet.kava.io",
      accounts: [process.env.PRIVATE_KEY!, process.env.PRIVATE_KEY_ADMIN!]
    },
  },
  solidity: {
    version: "0.8.13",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  etherscan: {
    apiKey: {
      testnet: 'x',
      mainnet: 'x'
    },
    customChains: [
      {
        network: "mainnet",
        chainId: 2222,
        urls: {
          apiURL: "https://explorer.kava.io/api",
          browserURL: "https://explorer.kava.io"
        }
      },
      { // npx hardhat verify --list-networks
        network: "testnet",
        chainId: 2221,
        urls: {
          apiURL: "https://explorer.testnet.kava.io/api",
          browserURL: "https://explorer.testnet.kava.io"
        }
      }
    ]
  }
};

export default config;
