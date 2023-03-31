pragma solidity 0.8.13;

import "ds-test/test.sol";
import "forge-std/Test.sol";
import "forge-std/console2.sol";
import "solmate/test/utils/mocks/MockERC20.sol";
import "contracts/BulkSender.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface CheatCodes {
    // Gets address for a given private key, (privateKey) => (address)
    function addr(uint256) external returns (address);
}

contract Emission is Test {

    MockERC20 usdc;
    BulkSender sender;
    CheatCodes cheats = CheatCodes(HEVM_ADDRESS);

    function setUp() public {
        sender = new BulkSender();
        usdc = new MockERC20("USDC", "USDC", 6);
        // ---
    }

    function testExec() public {
//        vm.warp(block.timestamp + 86400 * 7);
//        vm.roll(block.number + 1);

//        address[] memory pools = new address[](1);
//        pools[0] = address(pool_eth_vara);

        uint total = 200;
        address[] memory empty = new address[](0);
        address[] memory addresses = new address[](total);
        for( uint i = 1 ; i < total ; i ++ ){
            addresses[i] = cheats.addr(i);
        }

        address[] memory invalidRecipient = new address[](2);
        invalidRecipient[0] = address(0); // skip
        invalidRecipient[1] = address(0);

        uint amount = 1 * 1e6;
        vm.expectRevert(abi.encodePacked(BulkSender.InvalidToken.selector));
        sender.sendSameAmountToMany( IERC20(address(0)), addresses, amount);

        vm.expectRevert(abi.encodePacked(BulkSender.InvalidRecipients.selector));
        sender.sendSameAmountToMany( IERC20(address(usdc)), empty, amount);

        vm.expectRevert(abi.encodePacked(BulkSender.InvalidAmount.selector));
        sender.sendSameAmountToMany( IERC20(address(usdc)), addresses, 0);

        vm.expectRevert(abi.encodePacked(BulkSender.NotEnoughBalance.selector));
        sender.sendSameAmountToMany( IERC20(address(usdc)), addresses, amount);

        uint totalAmount = amount * total;
        usdc.mint(address(this), totalAmount);

        vm.expectRevert(abi.encodePacked(BulkSender.NotEnoughApproval.selector));
        sender.sendSameAmountToMany( IERC20(address(usdc)), addresses, amount);

        usdc.approve(address(sender), totalAmount);

        vm.expectRevert(abi.encodePacked(BulkSender.InvalidRecipient.selector));
        sender.sendSameAmountToMany( IERC20(address(usdc)), invalidRecipient, amount);

        sender.sendSameAmountToMany( IERC20(address(usdc)), addresses, amount);

        assertEq(usdc.balanceOf(addresses[1]), amount);

    }

}
