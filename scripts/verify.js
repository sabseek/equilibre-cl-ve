
async function main(){
    await hre.run("verify:verify", {address: "0x4eB2B9768da9Ea26E3aBe605c9040bC12F236a59",
        constructorArguments: [
            "0x35361C9c2a324F5FB8f3aed2d7bA91CE1410893A",
            "0xA138FAFc30f6Ec6980aAd22656F2F11C38B56a95",
            "0xa337E9426d080970b026caFfb4a83D185b85A124",
            "0x7B14b7288D50810a6982149B107238065AA7fcb7"
        ]});
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

