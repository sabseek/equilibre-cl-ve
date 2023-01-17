
async function main(){
    await hre.run("verify:verify", {address: "0x8DF9AdCF8d19f3E6013D567a650755Cf28fBfa80",
        constructorArguments: [
            "0x9eEba993Eafb39608Ee9d8d27d2662BCD54Ed77C",
            "0x8812420fb6E5d971C969CcEF2275210AB8D014f0",
            "0x6aEe2c9965Ad1A279610839Dc72ab7a956809A3a",
            "0x28A4E128f823b1b3168f82F64Ea768569a25a37F"
        ]});
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

