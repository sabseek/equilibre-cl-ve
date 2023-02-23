import {task} from "hardhat/config";

import mainnet_config from "./constants/mainnet-config";
import testnet_config from "./constants/testnet-config";

async function main() {
    const network = await hre.ethers.provider.getNetwork();
    const chainId = network.chainId;
    const mainnet = chainId === 2222;
    console.log(`#Network: ${chainId}`);
    let CONTRACTS = {
        Vara: "",
        GaugeFactory: "",
        BribeFactory: "",
        PairFactory: "",
        Router: "",
        Router2: "",
        Library: "",
        VeArtProxy: "",
        VotingEscrow: "",
        RewardsDistributor: "",
        Voter: "",
        WrappedExternalBribeFactory: "",
        Minter: "",
        VaraGovernor: "",
        MerkleClaim: "",
    };
    const CONFIG = mainnet ? mainnet_config : testnet_config;

    // Load
    const [
        Vara,
        GaugeFactory,
        BribeFactory,
        PairFactory,
        Router,
        Router2,
        Library,
        VeArtProxy,
        VotingEscrow,
        RewardsDistributor,
        Voter,
        Minter,
        VaraGovernor,
        MerkleClaim,
        WrappedExternalBribeFactory
    ] = await Promise.all([
        hre.ethers.getContractFactory("Vara"),
        hre.ethers.getContractFactory("GaugeFactory"),
        hre.ethers.getContractFactory("BribeFactory"),
        hre.ethers.getContractFactory("PairFactory"),
        hre.ethers.getContractFactory("Router"),
        hre.ethers.getContractFactory("Router2"),
        hre.ethers.getContractFactory("VaraLibrary"),
        hre.ethers.getContractFactory("VeArtProxy"),
        hre.ethers.getContractFactory("VotingEscrow"),
        hre.ethers.getContractFactory("RewardsDistributor"),
        hre.ethers.getContractFactory("Voter"),
        hre.ethers.getContractFactory("Minter"),
        hre.ethers.getContractFactory("VaraGovernor"),
        hre.ethers.getContractFactory("MerkleClaim"),
        hre.ethers.getContractFactory("WrappedExternalBribeFactory"),
    ]);

    const vara = await Vara.deploy();
    await vara.deployed();
    CONTRACTS.Vara = vara.address;
    try {
        if( chainId === 2222 || chainId === 2221 ) {
            await vara.deployTransaction.wait(5);
            await hre.run("verify:verify", {address: vara.address});
        }
    } catch (e) {
        console.log(e.toString());
    }

    const gaugeFactory = await GaugeFactory.deploy();
    await gaugeFactory.deployed();
    CONTRACTS.GaugeFactory = gaugeFactory.address;
    try {
        if( chainId === 2222 || chainId === 2221 ) {
            await gaugeFactory.deployTransaction.wait(5);
            await hre.run("verify:verify", {address: gaugeFactory.address});
        }
    } catch (e) {
        console.log(e.toString());
    }

    const bribeFactory = await BribeFactory.deploy();
    await bribeFactory.deployed();
    CONTRACTS.BribeFactory = bribeFactory.address;
    try {
        if( chainId === 2222 || chainId === 2221 ) {
            await bribeFactory.deployTransaction.wait(5);
            await hre.run("verify:verify", {address: bribeFactory.address});
        }
    } catch (e) {
        console.log(e.toString());
    }

    const pairFactory = await PairFactory.deploy();
    await pairFactory.deployed();
    CONTRACTS.PairFactory = pairFactory.address;
    try {
        if( chainId === 2222 || chainId === 2221 ) {
            await pairFactory.deployTransaction.wait(5);
            await hre.run("verify:verify", {address: pairFactory.address});
        }
    } catch (e) {
        console.log(e.toString());
    }

    const router = await Router.deploy(pairFactory.address, CONFIG.WETH);
    await router.deployed();
    CONTRACTS.Router = router.address;
    try {
        if( chainId === 2222 || chainId === 2221 ) {
            await router.deployTransaction.wait(5);
            await hre.run("verify:verify", {address: router.address, constructorArguments: [pairFactory.address, CONFIG.WETH]});
        }
    } catch (e) {
        console.log(e.toString());
    }

    const router2 = await Router2.deploy(pairFactory.address, CONFIG.WETH);
    await router2.deployed();
    CONTRACTS.Router2 = router2.address;
    try {
        if( chainId === 2222 || chainId === 2221 ) {
            await router2.deployTransaction.wait(5);
            await hre.run("verify:verify", {address: router2.address, constructorArguments: [pairFactory.address, CONFIG.WETH]});
        }
    } catch (e) {
        console.log(e.toString());
    }

    const library = await Library.deploy(router2.address);
    await library.deployed();
    CONTRACTS.Library = library.address;
    try {
        if( chainId === 2222 || chainId === 2221 ) {
            await library.deployTransaction.wait(5);
            await hre.run("verify:verify", {address: library.address, constructorArguments: [router2.address]});
        }
    } catch (e) {
        console.log(e.toString());
    }

    const artProxy = await VeArtProxy.deploy();
    await artProxy.deployed();
    CONTRACTS.VeArtProxy = artProxy.address;
    try {
        if( chainId === 2222 || chainId === 2221 ) {
            await artProxy.deployTransaction.wait(5);
            await hre.run("verify:verify", {address: artProxy.address, constructorArguments: []});
        }
    } catch (e) {
        console.log(e.toString());
    }

    const escrow = await VotingEscrow.deploy(vara.address, artProxy.address);
    await escrow.deployed();
    CONTRACTS.VotingEscrow = escrow.address;
    try {
        if( chainId === 2222 || chainId === 2221 ) {
            await escrow.deployTransaction.wait(5);
            await hre.run("verify:verify", {address: escrow.address, constructorArguments: [vara.address, artProxy.address]});
        }
    } catch (e) {
        console.log(e.toString());
    }

    const distributor = await RewardsDistributor.deploy(escrow.address);
    await distributor.deployed();
    CONTRACTS.RewardsDistributor = distributor.address;
    try {
        if( chainId === 2222 || chainId === 2221 ) {
            await distributor.deployTransaction.wait(5);
            await hre.run("verify:verify", {address: distributor.address, constructorArguments: [escrow.address]});
        }
    } catch (e) {
        console.log(e.toString());
    }

    const voter = await Voter.deploy(
        escrow.address,
        pairFactory.address,
        gaugeFactory.address,
        bribeFactory.address
    );
    await voter.deployed();
    CONTRACTS.Voter = voter.address;
    try {
        if( chainId === 2222 || chainId === 2221 ) {
            await voter.deployTransaction.wait(5);
            await hre.run("verify:verify", {address: distributor.address, constructorArguments: [
                escrow.address,
                    pairFactory.address,
                    gaugeFactory.address,
                    bribeFactory.address]});
        }
    } catch (e) {
        console.log(e.toString());
    }

    const externalBribeFactory = await WrappedExternalBribeFactory.deploy(voter.address);
    await externalBribeFactory.deployed();
    CONTRACTS.WrappedExternalBribeFactory = externalBribeFactory.address;
    try {
        if( chainId === 2222 || chainId === 2221 ) {
            await externalBribeFactory.deployTransaction.wait(5);
            await hre.run("verify:verify", {address: externalBribeFactory.address, constructorArguments: [voter.address]});
        }
    } catch (e) {
        console.log(e.toString());
    }

    const minter = await Minter.deploy(
        voter.address,
        escrow.address,
        distributor.address
    );
    await minter.deployed();
    CONTRACTS.Minter = minter.address;
    try {
        if( chainId === 2222 || chainId === 2221 ) {
            await minter.deployTransaction.wait(5);
            await hre.run("verify:verify", {address: minter.address, constructorArguments: [voter.address,
                    escrow.address,
                    distributor.address]});
        }
    } catch (e) {
        console.log(e.toString());
    }

    const governor = await VaraGovernor.deploy(escrow.address);
    await governor.deployed();
    CONTRACTS.VaraGovernor = escrow.address;
    try {
        if( chainId === 2222 || chainId === 2221 ) {
            await governor.deployTransaction.wait(5);
            await hre.run("verify:verify", {address: governor.address, constructorArguments: [escrow.address]});
        }
    } catch (e) {
        console.log(e.toString());
    }

    // Airdrop
    const claim = await MerkleClaim.deploy(vara.address, CONFIG.merkleRoot);
    await claim.deployed();
    CONTRACTS.MerkleClaim = claim.address;
    try {
        if( chainId === 2222 || chainId === 2221 ) {
            await claim.deployTransaction.wait(5);
            await hre.run("verify:verify", {address: claim.address, constructorArguments: [vara.address, CONFIG.merkleRoot]});
        }
    } catch (e) {
        console.log(e.toString());
    }

    let tx;
    // Initialize
    tx = await vara.initialMint(CONFIG.teamTreasure);
    tx.wait();

    tx = await vara.setMerkleClaim(claim.address);
    tx.wait();

    tx = await vara.setMinter(minter.address);
    tx.wait();

    tx = await pairFactory.setPauser(CONFIG.teamEOA);
    tx.wait();

    tx = await escrow.setVoter(voter.address);
    tx.wait();

    tx = await escrow.setTeam(CONFIG.teamEOA);
    tx.wait();

    tx = await voter.setGovernor(CONFIG.teamEOA);
    tx.wait();

    tx = await voter.setEmergencyCouncil(CONFIG.teamEOA);
    tx.wait();

    tx = await distributor.setDepositor(minter.address);
    tx.wait();

    tx = await governor.setTeam(CONFIG.teamEOA)
    tx.wait();


    // Whitelist
    const nativeToken = [vara.address];
    const tokenWhitelist = nativeToken.concat(CONFIG.tokenWhitelist);
    tx = await voter.initialize(tokenWhitelist, minter.address);
    tx.wait();

    /*
    let partnerMax = hre.ethers.BigNumber.from("0");
    let partnerAmts: string[] = [];
    for (let i in CONFIG.partnerAmts) {
        partnerAmts[i] = hre.ethers.utils.parseUnits(CONFIG.partnerAmts[i].toString(), "ether").toString();
        partnerMax = partnerMax.add(hre.ethers.BigNumber.from(partnerAmts[i]));
    }
    // Initial veVARA distro
    tx = await minter.initialize(
        CONFIG.partnerAddrs,
        CONFIG.partnerAmts,
        partnerMax
    );
    tx.wait();
    */

    tx = await minter.setTeam(CONFIG.teamMultisig)
    tx.wait();

    console.log(`#Network: ${chainId}`);
    for (let i in CONTRACTS) {
        console.log(` - ${i} = ${CONTRACTS[i]}`);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

