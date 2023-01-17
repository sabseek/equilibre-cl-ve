
async function main(){
    await hre.run("verify:verify", {address: "0x47B8378C5f75340e52d147E5461A3b4dBFB5E8a2",
        constructorArguments: ["0x5e3c3b8A06b3a4e9c474F07f9E0D304965C09691", "0x5f710e65785471b11Dd647Db336bfA2173265928"]});
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

