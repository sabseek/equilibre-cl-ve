import {task} from "hardhat/config";

import mainnet_config from "./constants/mainnet-config";
import testnet_config from "./constants/testnet-config";

task("deploy", "Deploys contracts").setAction(async function (
    taskArguments,
    {ethers}
) {
    const network = await hre.ethers.provider.getNetwork();
    const chainId = network.chainId;
    const mainnet = chainId === 2222;

    const CONFIG = mainnet ? mainnet_config : testnet_config;

    // Load
    const [
        Vara,
        GaugeFactory,
        BribeFactory,
        PairFactory,
        Router,
        Library,
        VeArtProxy,
        VotingEscrow,
        RewardsDistributor,
        Voter,
        Minter,
        VaraGovernor,
        MerkleClaim,
    ] = await Promise.all([
        ethers.getContractFactory("Vara"),
        ethers.getContractFactory("GaugeFactory"),
        ethers.getContractFactory("BribeFactory"),
        ethers.getContractFactory("PairFactory"),
        ethers.getContractFactory("Router"),
        ethers.getContractFactory("VaraLibrary"),
        ethers.getContractFactory("VeArtProxy"),
        ethers.getContractFactory("VotingEscrow"),
        ethers.getContractFactory("RewardsDistributor"),
        ethers.getContractFactory("Voter"),
        ethers.getContractFactory("Minter"),
        ethers.getContractFactory("VaraGovernor"),
        ethers.getContractFactory("MerkleClaim"),
    ]);

    const vara = await Vara.deploy();
    await vara.deployed();
    console.log("Vara deployed to: ", vara.address);

    const gaugeFactory = await GaugeFactory.deploy();
    await gaugeFactory.deployed();
    console.log("GaugeFactory deployed to: ", gaugeFactory.address);

    const bribeFactory = await BribeFactory.deploy();
    await bribeFactory.deployed();
    console.log("BribeFactory deployed to: ", bribeFactory.address);

    const pairFactory = await PairFactory.deploy();
    await pairFactory.deployed();
    console.log("PairFactory deployed to: ", pairFactory.address);

    const router = await Router.deploy(pairFactory.address, CONFIG.WETH);
    await router.deployed();
    console.log("Router deployed to: ", router.address);
    console.log("Args: ", pairFactory.address, CONFIG.WETH, "\n");

    const library = await Library.deploy(router.address);
    await library.deployed();
    console.log("VaraLibrary deployed to: ", library.address);
    console.log("Args: ", router.address, "\n");

    const artProxy = await VeArtProxy.deploy();
    await artProxy.deployed();
    console.log("VeArtProxy deployed to: ", artProxy.address);

    const escrow = await VotingEscrow.deploy(vara.address, artProxy.address);
    await escrow.deployed();
    console.log("VotingEscrow deployed to: ", escrow.address);
    console.log("Args: ", vara.address, artProxy.address, "\n");

    const distributor = await RewardsDistributor.deploy(escrow.address);
    await distributor.deployed();
    console.log("RewardsDistributor deployed to: ", distributor.address);
    console.log("Args: ", escrow.address, "\n");

    const voter = await Voter.deploy(
        escrow.address,
        pairFactory.address,
        gaugeFactory.address,
        bribeFactory.address
    );
    await voter.deployed();
    console.log("Voter deployed to: ", voter.address);
    console.log("Args: ",
        escrow.address,
        pairFactory.address,
        gaugeFactory.address,
        bribeFactory.address,
        "\n"
    );

    const minter = await Minter.deploy(
        voter.address,
        escrow.address,
        distributor.address
    );
    await minter.deployed();
    console.log("Minter deployed to: ", minter.address);
    console.log("Args: ",
        voter.address,
        escrow.address,
        distributor.address,
        "\n"
    );

    const governor = await VaraGovernor.deploy(escrow.address);
    await governor.deployed();
    console.log("VaraGovernor deployed to: ", governor.address);
    console.log("Args: ", escrow.address, "\n");

    // Airdrop
    const claim = await MerkleClaim.deploy(vara.address, CONFIG.merkleRoot);
    await claim.deployed();
    console.log("MerkleClaim deployed to: ", claim.address);
    console.log("Args: ", vara.address, CONFIG.merkleRoot, "\n");

    // Initialize
    await vara.initialMint(CONFIG.teamEOA);
    console.log("Initial minted");

    await vara.setRedemptionReceiver(receiver.address);
    console.log("RedemptionReceiver set");

    await vara.setMerkleClaim(claim.address);
    console.log("MerkleClaim set");

    await vara.setMinter(minter.address);
    console.log("Minter set");

    await pairFactory.setPauser(CONFIG.teamMultisig);
    console.log("Pauser set");

    await escrow.setVoter(voter.address);
    console.log("Voter set");

    await escrow.setTeam(CONFIG.teamMultisig);
    console.log("Team set for escrow");

    await voter.setGovernor(CONFIG.teamMultisig);
    console.log("Governor set");

    await voter.setEmergencyCouncil(CONFIG.teamMultisig);
    console.log("Emergency Council set");

    await distributor.setDepositor(minter.address);
    console.log("Depositor set");

    await receiver.setTeam(CONFIG.teamMultisig)
    console.log("Team set for receiver");

    await governor.setTeam(CONFIG.teamMultisig)
    console.log("Team set for governor");

    // Whitelist
    const nativeToken = [vara.address];
    const tokenWhitelist = nativeToken.concat(CONFIG.tokenWhitelist);
    await voter.initialize(tokenWhitelist, minter.address);
    console.log("Whitelist set");

    // Initial veVARA distro
    await minter.initialize(
        CONFIG.partnerAddrs,
        CONFIG.partnerAmts,
        CONFIG.partnerMax
    );
    console.log("veVARA distributed");

    await minter.setTeam(CONFIG.teamMultisig)
    console.log("Team set for minter");

    console.log("contracts deployed");
});
