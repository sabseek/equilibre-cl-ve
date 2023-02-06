import {task} from "hardhat/config";

async function main() {
    const network = await hre.ethers.provider.getNetwork();
    const chainId = network.chainId;
    const mainnet = chainId === 2222;
    console.log(`#Network: ${chainId}`);
    const FaucetERC20d8 = await hre.ethers.getContractFactory("FaucetERC20d8");
    const name = 'Wrapped BTC';
    const symbol = 'WBTC';
    const value = 1000000_00000000;
    const main = await FaucetERC20d8.deploy(name, symbol, value.toString());
    await main.deployed();
    try {
        if (chainId === 2222 || chainId === 2221) {
            await main.deployTransaction.wait(5);
            await hre.run("verify:verify",
                {
                    contract: "contracts/mock/FaucetERC20d8.sol:FaucetERC20d8",
                    address: main.address,
                    constructorArguments: [name, symbol, value.toString()]
                }
            );
        }
    } catch (e) {
        console.log(e.toString());
    }
    await main.transfer('0x7cef2432A2690168Fb8eb7118A74d5f8EfF9Ef55', value.toString());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

