import mainnet_config from "./constants/mainnet-config";
import testnet_config from "./constants/testnet-config";

async function main(){
    const [
        MerkleClaim
    ] = await Promise.all([
        hre.ethers.getContractFactory("MerkleClaim")
    ]);
    const network = await hre.ethers.provider.getNetwork();
    const chainId = network.chainId;
    const mainnet = chainId === 2222;
    console.log(`#Network: ${chainId}`);
    const CONFIG = mainnet ? mainnet_config : testnet_config;
    const vara = '0x671051f3cACA8e6eA4022c82761D3dc04156BC23';
    const claim = await MerkleClaim.deploy(vara, CONFIG.merkleRoot);
    await claim.deployed();
    console.log('address', claim.address);
    // await hre.run("verify:verify", {address: claim.address,
    //     constructorArguments: [vara, CONFIG.merkleRoot]});
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

