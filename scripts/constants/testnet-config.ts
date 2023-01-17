import { ethers } from "ethers";
const TEAM_MULTISIG = "0x79dE631fFb7291Acdb50d2717AE32D44D5D00732";
const TEAM_EOA = "0x7cef2432A2690168Fb8eb7118A74d5f8EfF9Ef55";

const testnetArgs = {
  // Tokens
  WETH: "0x6C2A54580666D69CF904a82D8180F198C03ece67",
  USDC: "0x43D8814FdFB9B8854422Df13F1c66e34E4fa91fD",

  // Addresses
  teamEOA: TEAM_EOA,
  teamMultisig: TEAM_MULTISIG,
  emergencyCouncil: TEAM_EOA,

  merkleRoot:
    "0x66734e7e3a2528b9a170c43d7413392ae1462d9c07392d4261924c047cc3d97d",
  tokenWhitelist: [
    "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
    "0xbC6F6b680bc61e30dB47721c6D1c5cde19C1300d",
    "0x0064A673267696049938AA47595dD0B3C2e705A1",
    "0x3e22e37Cb472c872B5dE121134cFD1B57Ef06560",
  ],
  partnerAddrs: [
    TEAM_EOA, // TEST
  ],
  partnerAmts: [
    ethers.BigNumber.from("30300000"),
  ],
};

export default testnetArgs;
