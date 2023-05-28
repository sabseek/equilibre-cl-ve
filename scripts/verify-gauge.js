
async function main(){
    const Gauge = await ethers.getContractFactory("contracts/Gauge.sol:Gauge")

    const gaugeAddress = '0xa250a3b6a5e5e8b398092537951f8bd80639ed5c';
    const gauge = await Gauge.attach(gaugeAddress);

    const stake = await gauge.stake();
    const internal_bribe = await gauge.internal_bribe();
    const external_bribe = await gauge.external_bribe();
    const _ve = await gauge._ve();
    const voter = await gauge.voter();
    const isForPair = await gauge.isForPair();
    const rewardsListLength = await gauge.rewardsListLength();
    let rewards = [];
    for( let i = 0 ; i < rewardsListLength; i ++ )
        rewards.push(await gauge.rewards(i));
    const args = [
        stake,
        internal_bribe,
        external_bribe,
        _ve,
        voter,
        isForPair,
        rewards
    ];
    console.log(args);
    return;
    await hre.run("verify:verify", {
        address: gaugeAddress,
        constructorArguments: args});


}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

