// SPDX-License-Identifier: Unlicensed
// (C) Sam, 543#3017, Guru Network, 2022-9999
// Contact: https://discord.gg/QpyfMarNrV
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function decimals() external view returns (uint8);
    function allowance(address, address) external view returns (uint256);
}
interface IVoter {
    function length() external view returns (uint256);
    function pools(uint256) external view returns (address);
    function gauges(address) external view returns (address);
}
interface IveNFT {
    function totalSupply() external view returns (uint256);
}
interface IEquilibreTvlOracle {
    function p_t_coin_usd(address) external view returns (uint256);
}

contract Equilibre_VE_Api is Ownable {
    IERC20 public VARA ;//= IERC20(0x3Fd3A0c85B70754eFc07aC9Ac0cbBDCe664865A6);
    IVoter public VOTER ;//= IVoter(0x4bebEB8188aEF8287f9a7d1E4f01d76cBE060d5b);
    IveNFT public veNFT ;//= IveNFT(0x8313f3551C4D3984FfbaDFb42f780D0c8763Ce94);
    IEquilibreTvlOracle public ORACLE; //= IEquilibreTvlOracle(0x0786c3a78f5133F08C1c70953B8B10376bC6dCad);

    address[] public excluded = [address(0), 0x000000000000000000000000000000000000dEaD];
    address public pool2;// = 0x3d6c56f6855b7Cc746fb80848755B0a9c3770122;

    constructor(address _oracle, address _pool2, address _vara, address _voter, address _ve ) {
        ORACLE = IEquilibreTvlOracle(_oracle);
        VARA = IERC20(_vara);
        VOTER = IVoter(_voter);
        veNFT = IveNFT(_ve);
        pool2 = _pool2;
    }

    function setPool2(address _pool2) public onlyOwner {
        pool2 = _pool2;
    }
    function setOracle(address _oracle) public onlyOwner {
        ORACLE = IEquilibreTvlOracle(_oracle);
    }

    function addExcluded(address _e) public onlyOwner {
        excluded.push(_e);
    }

    function pullExcluded(uint n) public onlyOwner {
        excluded[n]=excluded[excluded.length-1];
        excluded.pop();
    }

    function name() public pure returns(string memory) {
        return "Equilibre.s";
    }

    function symbol() public pure returns(string memory) {
        return "VARA.s";
    }

    function decimals() public pure returns(uint8) {
        return 18;
    }

    function allowance(address _o, address _s) public view returns(uint256) {
        return VARA.allowance(_o, _s);
    }

    function balanceOf(address _o) public view returns(uint256) {
        return VARA.balanceOf(_o);
    }

    function inExcluded() public view returns(uint256 _t) {
        for(uint i;i<excluded.length;i++) {
            _t += VARA.balanceOf(excluded[i]);
        }
        return _t;
    }

    function inGauges() public view returns(uint256 _t) {
        uint _l = VOTER.length();
        for(uint i;i<_l;i++) {
            address _p = VOTER.pools(i);
            address _g = VOTER.gauges(_p);
            _t += VARA.balanceOf(_g);
        }
        return _t;
    }

    function inNFT() public view returns(uint256) {
        return VARA.balanceOf(address(veNFT));
    }

    function dilutedSupply() public view returns(uint256) {
        return VARA.totalSupply();
    }

    function outstandingSupply() public view returns(uint256) {
        return
        dilutedSupply()
        - inExcluded()
        - inGauges()
        ;
    }

    function totalSupply() public view returns(uint256) {
        return circulatingSupply();
    }

    function circulatingSupply() public view returns(uint256) {
        return
        dilutedSupply()
        - inExcluded()
        - inGauges()
        - inNFT()
        ;
    }

    function lockRatio() public view returns(uint256) {
        return ( inNFT() * 1e18 ) / ( circulatingSupply() + inNFT() );
    }

    function price() public view returns(uint256) {
        return ORACLE.p_t_coin_usd(pool2);
    }

    function liquidity() public view returns(uint256) {
        return ( price() * VARA.balanceOf(pool2) * 2 ) / 1e18;
    }

    function circulatingMarketCap() public view returns(uint256) {
        return ( price() * circulatingSupply() ) / 1e18;
    }

    function marketCap() public view returns(uint256) {
        return ( price() * outstandingSupply() ) / 1e18;
    }

    function fdv() public view returns(uint256) {
        return ( price() * dilutedSupply() ) / 1e18;
    }

    function lockedMarketCap() public view returns(uint256) {
        return ( veNFT.totalSupply() * price() ) / 1e18;
    }

    function info() public view returns(uint256[15] memory) {
        uint256[15] memory _info = [
        uint256(0), 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14
        ];
        _info[0] = block.timestamp;
        _info[1] = price();
        _info[2] = circulatingSupply();
        _info[3] = outstandingSupply();
        _info[4] = dilutedSupply();
        _info[5] = inNFT();
        _info[6] = inGauges();
        _info[7] = inExcluded();
        _info[8] = veNFT.totalSupply();
        _info[9] = lockRatio();
        _info[10] = liquidity();
        _info[11] = circulatingMarketCap();
        _info[12] = marketCap();
        _info[13] = fdv();
        _info[14] = lockedMarketCap();
        return _info;
    }

}