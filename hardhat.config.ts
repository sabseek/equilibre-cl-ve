import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-preprocessor";
import "hardhat-abi-exporter";
import { resolve } from "path";
import { config as dotenvConfig } from "dotenv";
import { HardhatUserConfig, task } from "hardhat/config";
import fs from "fs";

async function loadCfg(){
  const contracts = JSON.parse(fs.readFileSync('../contracts.json').toString());
  const network = await hre.ethers.provider.getNetwork();
  if( ! contracts ){
    new Error(`contracts.json is empty.`);
  }
  const r = contracts[network.chainId];
  if( ! r ){
    new Error(`No contracts for chain: ${network.chainId}`);
  }
  const [owner] = await hre.ethers.getSigners();
  console.log(`Account: ${owner.address}, Network: ${network.chainId}.`);
  return r;
}

task("distro", "Voter.distro").setAction(async () => {
  const cfg = await loadCfg();
  const Main = await hre.ethers.getContractFactory("Voter")
  const main = Main.attach(cfg.Voter);
  const tx = await main.distro();
  console.log(`${tx.hash}`);
});

task("updateAll", "Voter.updateAll").setAction(async () => {
  const cfg = await loadCfg();
  const Main = await hre.ethers.getContractFactory("Voter")
  const main = Main.attach(cfg.Voter);
  const tx = await main.updateAll();
  console.log(`${tx.hash}`);
});

task("distributeFees", "Voter.distributeFees").setAction(async () => {
  const cfg = await loadCfg();
  const Main = await ethers.getContractFactory("Voter")
  const main = Main.attach(cfg.Voter);
  let pools = [], gauges = [];
  const length = await main.length();
  for( let i = 0 ; i < length ; ++ i ){
    const pool = await main.pools(i);
    const gauge = await main.gauges(pool);
    console.log(` - ${i}: ${pool} = ${gauge}`);
    pools.push( pool );
    gauges.push( gauge );
  }
  let tx = await main.distributeFees(gauges);
  console.log(`${tx.hash}`);
});



dotenvConfig({ path: resolve(__dirname, "./.env") });

const config: HardhatUserConfig = {
  networks: {
    hardhat: {
      initialBaseFeePerGas: 0,
    },
    mainnet: {
      url: "https://evm.kava.io",
      accounts: [process.env.PRIVATE_KEY!]
    },
    testnet: {
      url: "https://evm.testnet.kava.io",
      accounts: [process.env.PRIVATE_KEY!]
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
