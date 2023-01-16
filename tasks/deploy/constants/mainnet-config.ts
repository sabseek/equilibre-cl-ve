import { ethers } from "ethers";

const TOKEN_DECIMALS = ethers.BigNumber.from("10").pow(
  ethers.BigNumber.from("18")
);
const MILLION = ethers.BigNumber.from("10").pow(ethers.BigNumber.from("6"));

const FOUR_MILLION = ethers.BigNumber.from("4")
  .mul(MILLION)
  .mul(TOKEN_DECIMALS);
const TEN_MILLION = ethers.BigNumber.from("10")
  .mul(MILLION)
  .mul(TOKEN_DECIMALS);
const TWENTY_MILLION = ethers.BigNumber.from("20")
  .mul(MILLION)
  .mul(TOKEN_DECIMALS);
const PARTNER_MAX = ethers.BigNumber.from("78")
  .mul(MILLION)
  .mul(TOKEN_DECIMALS);

const TEAM_MULTISIG = "0x79dE631fFb7291Acdb50d2717AE32D44D5D00732";
const TEAM_EOA = "0x7cef2432A2690168Fb8eb7118A74d5f8EfF9Ef55";

const mainnet_config = {
  // Tokens
  WETH: "0xc86c7C0eFbd6A49B35E8714C5f59D99De09A225b",
  USDC: "0xfA9343C3897324496A05fC75abeD6bAC29f8A40f",

  // Addresses
  teamEOA: TEAM_EOA,
  teamMultisig: TEAM_MULTISIG,
  emergencyCouncil: "0x7cef2432A2690168Fb8eb7118A74d5f8EfF9Ef55",

  merkleRoot:
    "0x66734e7e3a2528b9a170c43d7413392ae1462d9c07392d4261924c047cc3d97d",
  tokenWhitelist: [
    "0xc86c7C0eFbd6A49B35E8714C5f59D99De09A225b", // WETH
    "0xfA9343C3897324496A05fC75abeD6bAC29f8A40f", // USDC
  ],
  partnerAddrs: [
    TEAM_EOA, // VARA
  ],
  partnerAmts: [
    TEN_MILLION,
  ],
  partnerMax: PARTNER_MAX,
};

export default mainnet_config;
