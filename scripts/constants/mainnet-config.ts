import { ethers } from "ethers";
const TEAM_MULTISIG = "0x79dE631fFb7291Acdb50d2717AE32D44D5D00732";
const TEAM_EOA = "0x7cef2432A2690168Fb8eb7118A74d5f8EfF9Ef55";
const WETH = "0xc86c7C0eFbd6A49B35E8714C5f59D99De09A225b";
const USDC = "0xfA9343C3897324496A05fC75abeD6bAC29f8A40f";
const mainnet_config = {
  WETH: WETH,
  USDC: USDC,
  teamEOA: TEAM_EOA,
  teamMultisig: TEAM_MULTISIG,
  emergencyCouncil: "0x7cef2432A2690168Fb8eb7118A74d5f8EfF9Ef55",
  merkleRoot: "0x66734e7e3a2528b9a170c43d7413392ae1462d9c07392d4261924c047cc3d97d",
  tokenWhitelist: [
    WETH,
    USDC
  ],
  partnerAddrs: [
    TEAM_EOA, // VARA
  ],
  partnerAmts: [
    ethers.BigNumber.from("30300000"),
  ],
};

export default mainnet_config;
