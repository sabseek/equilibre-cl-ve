import mainnet_config from "./constants/mainnet-config";
import testnet_config from "./constants/testnet-config";

async function main(){
    const [
        Vara,
        MerkleClaim
    ] = await Promise.all([
        hre.ethers.getContractFactory("Vara"),
        hre.ethers.getContractFactory("MerkleClaim")
    ]);
    const network = await hre.ethers.provider.getNetwork();
    const chainId = network.chainId;
    const mainnet = chainId === 2222;
    console.log(`#Network: ${chainId}`);
    const CONFIG = mainnet ? mainnet_config : testnet_config;
    const vara = await Vara.deploy();
    await vara.deployed();
    const claim = await MerkleClaim.deploy(vara.address, CONFIG.merkleRoot);
    await claim.deployed();
    console.log('vara', vara.address);
    console.log('merkle', claim.address);
    await vara.setMerkleClaim(claim.address);
    await hre.run("verify:verify", {address: claim.address,
        constructorArguments: [vara.address, CONFIG.merkleRoot]});
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

