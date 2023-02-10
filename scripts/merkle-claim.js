async function main(){
    const vara = '';
    const claim = await MerkleClaim.deploy(vara.address, CONFIG.merkleRoot);
    await claim.deployed();
    console.log('address', claim.address);
    await hre.run("verify:verify", {address: claim.address,
        constructorArguments: [
            "0x0439bE66E17c9fd1d7c52Fdc923076B0A1d45294",
            "0x669C381CFCE6473Ceb4C8a95e2A9a3584297396C",
            "0xa1c457f68699bEe7D649F647363eEE69BCEF2AaA",
            "0xBEEdf0AD80B1655DF191A36476854F4F92c78D59"
        ]});
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

