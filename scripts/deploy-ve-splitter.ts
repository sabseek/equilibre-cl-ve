import {task} from "hardhat/config";

import mainnet_config from "./constants/mainnet-config";
import testnet_config from "./constants/testnet-config";

async function main() {

    const id = "veSplitter";

    const network = await hre.ethers.provider.getNetwork();
    const chainId = network.chainId;
    const mainnet = chainId === 2222;
    const CONFIG = mainnet ? mainnet_config : testnet_config;

    const voter = mainnet ?
        '0x4eB2B9768da9Ea26E3aBe605c9040bC12F236a59' :
        '0xa8B1E1B4333202355785C90fB434964046ef2E64';

    const [ Factory ] = await Promise.all([
        hre.ethers.getContractFactory(id)
    ]);

    const main = await Factory.deploy(voter);
    await main.deployed();
    console.log(id, main.address);

    try {
        if( chainId === 2222 || chainId === 2221 ) {
            await main.deployTransaction.wait(5);
            const args = {
                address: main.address,
                constructorArguments: [voter]
            };
            await hre.run("verify:verify", args);
        }
    } catch (e) {
        console.log(e.toString());
    }

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

