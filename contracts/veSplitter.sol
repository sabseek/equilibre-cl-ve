// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import {VotingEscrow} from "contracts/VotingEscrow.sol";
import {Voter} from "contracts/Voter.sol";
import {IERC20} from "./interfaces/IERC20.sol";

contract veSplitter {

    VotingEscrow public escrow;
    Voter public voter;
    IERC20 public token;

    uint internal constant MINTIME = 86400;
    uint internal constant MAXTIME = 4 * 365 * 86400;

    error TokenIdIsAttached();
    error NftNotApproved();
    error InvalidAmount(uint at);
    error InvalidAmountAndLocksData();
    error InvalidLockTime(uint at, uint lock);
    error InsufficientBalance(uint balanceOfNft, uint totalWeight);
    error InvalidWithdrawAmount(uint expected, uint available);
    error NftLocked();

    constructor(address _voter){
        voter = Voter(_voter);
        escrow = VotingEscrow(voter._ve());
        token = IERC20(escrow.token());
    }

    function split(uint[] memory amounts, uint[] memory locks, uint _tokenId) external {

        // check permission and vote
        if (escrow.attachments(_tokenId) > 0 || escrow.voted(_tokenId))
            revert TokenIdIsAttached();

        if (!escrow.isApprovedOrOwner(address(this), _tokenId))
            revert NftNotApproved();

        if (amounts.length == 0 || amounts.length != locks.length)
            revert InvalidAmountAndLocksData();

        (, uint unlockDate) = escrow.locked(_tokenId);
        if (block.timestamp < unlockDate)
            revert NftLocked();

        uint i;
        uint totalWeight = 0;
        for (i = 0; i < amounts.length; i++) {
            if (amounts[i] == 0)
                revert InvalidAmount(i);
            totalWeight += amounts[i];
        }

        (int128 _balanceOfNft, ) = escrow.locked(_tokenId);
        uint balanceOfNft = uint(int256(_balanceOfNft));
        if (balanceOfNft < totalWeight)
            revert InsufficientBalance(balanceOfNft, totalWeight);

        for (i = 0; i < locks.length; i++) {
            if (locks[i] < MINTIME || locks[i] > MAXTIME)
                revert InvalidLockTime(i, locks[i]);
        }

        escrow.transferFrom( escrow.ownerOf(_tokenId), address(this), _tokenId);
        escrow.withdraw(_tokenId);
        uint balanceOfTokens = token.balanceOf(address(this));

        if (balanceOfTokens < balanceOfNft)
            revert InvalidWithdrawAmount(balanceOfNft, balanceOfTokens);

        token.approve(address(escrow), balanceOfTokens);

        for (i = 0; i < amounts.length; i++) {
            uint amount = amounts[i];
            uint lock = locks[i];
            uint lockedTokenId = escrow.create_lock(amount, lock);
            escrow.transferFrom( address(this), msg.sender, lockedTokenId);
        }

        uint leftBalance = token.balanceOf(address(this));
        if( leftBalance > 0 ){
            assert(token.transfer(msg.sender, leftBalance));
        }


    }
}
