import {task} from "hardhat/config";

import mainnet_config from "./constants/mainnet-config";
import testnet_config from "./constants/testnet-config";

async function main() {
    const network = await hre.ethers.provider.getNetwork();
    const chainId = network.chainId;
    const mainnet = chainId === 2222;
    console.log(`#Network: ${chainId}`);
    const CONFIG = mainnet ? mainnet_config : testnet_config;
    // Load
    const [ TaxToken ] = await Promise.all([
        hre.ethers.getContractFactory("TaxToken")
    ]);

    const router = '0x9607aC5221B91105C29FAff5E282B8Af081B0063';
    const token = await TaxToken.deploy(CONFIG.teamEOA);
    await token.deployed();
    console.log('token', token.address);
    await token.initialize(router);
    /*
    try {
        if( chainId === 2222 || chainId === 2221 ) {
            await router.deployTransaction.wait(5);
            await hre.run("verify:verify", {address: router.address, constructorArguments: [pairFactory, CONFIG.WETH]});
        }
    } catch (e) {
        console.log(e.toString());
    }
    */
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

