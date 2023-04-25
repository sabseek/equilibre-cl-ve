// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
//import {console2} from "forge-std/console2.sol";

contract BulkSender {

    using SafeERC20 for IERC20;
    error InvalidRecipient();
    error InvalidRecipients();
    error InvalidAmount();
    error InvalidToken();
    error NotEnoughBalance();
    error NotEnoughApproval();
    error FailedToSendValue();

    /**
     * @dev Use this function to send specific amount of kava to a list of users.
     * @param recipients: the list of users addresses that will receive the token.
     * @param amount: the amount to be sent to each user.
     */
    function sendKavaToMany(address[] memory recipients, uint[] memory amount) external payable{

        if( recipients.length == 0 || recipients.length != amount.length )
            revert InvalidRecipients();

        uint total = recipients.length;
        for( uint i = 0 ; i < total; i++ ){
            address recipient = recipients[i];
            uint value = amount[i];
            if( recipient == address(0) )
                revert InvalidRecipient();
            if( value == 0 )
                revert InvalidAmount();
            (bool sent,) = recipient.call{value: value}("");
            if( ! sent )
                revert FailedToSendValue();
        }

    }

    /**
     * @dev Use this function to send same amount of an erc20 token to a list of users.
     * @param recipients: the list of users addresses that will receive the token.
     * @param amount: the amount to be sent to each user.
     */
    function sendSameAmountToManyInFee(address[] memory recipients, uint amount) external payable{

        if( recipients.length == 0 )
            revert InvalidRecipients();

        if( amount == 0 )
            revert InvalidAmount();

        if( recipients.length * amount > msg.value ){
            revert NotEnoughBalance();
        }

        uint total = recipients.length;
        for( uint i = 0 ; i < total; i++ ){
            address recipient = recipients[i];
            if( recipient == address(0) )
                revert InvalidRecipient();
            (bool sent,) = recipient.call{value: amount}("");
            if( ! sent )
                revert FailedToSendValue();
        }

    }

    /**
     * @dev Use this function to send same amount of an erc20 token to a list of users.
     * @param token: the token you want to send to users, ex an USDC token.
     * @param recipients: the list of users addresses that will receive the token.
     * @param amount: the amount to be sent to each user.
     */
    function sendSameAmountToMany(IERC20 token, address[] memory recipients, uint amount) external{

        if( address(token) == address(0) )
            revert InvalidToken();

        if( recipients.length == 0 )
            revert InvalidRecipients();

        if( amount == 0 )
            revert InvalidAmount();

        if( recipients.length * amount > token.balanceOf(msg.sender) )
            revert NotEnoughBalance();

        if( token.allowance(msg.sender, address(this) ) < recipients.length * amount )
            revert NotEnoughApproval();

        uint total = recipients.length;
        for( uint i = 0 ; i < total; i++ ){
            address recipient = recipients[i];
            if( recipient == address(0) )
                revert InvalidRecipient();
            token.safeTransferFrom(msg.sender, recipient, amount);
        }

    }
}
