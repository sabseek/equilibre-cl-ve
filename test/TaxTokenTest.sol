pragma solidity 0.8.13;

import './BaseTest.sol';
import "contracts/mock/TaxToken.sol";

contract TaxTokenTest is BaseTest {

    Pair _pair;
    TaxToken taxToken;

    uint TAX_TOKEN_100K = 100 * 1e9;
    uint TAX_TOKEN_1 = 1e9;

    function deploySinglePairWithOwner(address _owner) public {
        // console.log('balance of', taxToken.balanceOf());
        taxToken.transfer(_owner, TAX_TOKEN_1);
        TestOwner(_owner).approve(address(WETH), address(router2), TOKEN_1);
        TestOwner(_owner).approve(address(taxToken), address(router2), TAX_TOKEN_1);
        TestOwner(_owner).addLiquidity(payable(address(router2)), address(WETH), address(taxToken), false, TOKEN_1, TAX_TOKEN_1, 0, 0, address(owner), block.timestamp);
    }

    function deployPair() public {
        deployOwners();
        deployCoins();
        mintStables();
        uint256[] memory amounts = new uint256[](3);
        amounts[0] = 2e25;
        amounts[1] = 1e25;
        amounts[2] = 1e25;
        mintWETH(owners, amounts);
        dealETH(owners, amounts);

        deployPairFactoryAndRouter();

        taxToken = new TaxToken(address(this));
        taxToken.initialize( address(router2) );

        deploySinglePairWithOwner(address(owner));
        deploySinglePairWithOwner(address(owner2));

        _pair = Pair(factory.getPair(address(taxToken), address(WETH), false));
    }

    function router2AddLiquidityETH() public {
        deployPair();

        // add initial liquidity from owner
        taxToken.approve(address(router2), TAX_TOKEN_100K);
        WETH.approve(address(router2), TAX_TOKEN_100K);
        router2.addLiquidityETH{value: TAX_TOKEN_100K}(address(taxToken), false, TAX_TOKEN_100K, 0, 0, address(owner), block.timestamp);
    }

    function router2AddLiquidityETHOwner2() public {
        router2AddLiquidityETH();

        taxToken.transfer(address(owner2), TAX_TOKEN_100K);
        owner2.approve(address(taxToken), address(router2), TAX_TOKEN_100K);
        owner2.approve(address(WETH), address(router2), TAX_TOKEN_100K);
        owner2.addLiquidityETH{value: TAX_TOKEN_100K}(payable(address(router2)), address(taxToken), false, TAX_TOKEN_100K, 0, 0, address(owner), block.timestamp);
    }

    function testRemoveETHLiquidity() public {
        router2AddLiquidityETHOwner2();

        uint256 initial_eth = address(this).balance;
        uint256 initial_usdc = taxToken.balanceOf(address(this));
        uint256 pair_initial_eth = address(_pair).balance;
        uint256 pair_initial_usdc = taxToken.balanceOf(address(_pair));

        return;
        // add liquidity to pool
        taxToken.approve(address(router2), TAX_TOKEN_100K);
        WETH.approve(address(router2), TAX_TOKEN_100K);
        (,, uint256 liquidity) = router2.addLiquidityETH{value: TAX_TOKEN_100K}(address(taxToken), false, TAX_TOKEN_100K, 0, 0, address(owner), block.timestamp);

        assertEq(address(this).balance, initial_eth - TAX_TOKEN_100K);
        assertEq(taxToken.balanceOf(address(this)), initial_usdc - TAX_TOKEN_100K);

        (uint256 amountUSDC, uint256 amountETH) = router2.quoteRemoveLiquidity(address(taxToken), address(WETH), false, liquidity);
        // approve transfer of lp tokens
        Pair(_pair).approve(address(router2), liquidity);
        router2.removeLiquidityETHSupportingFeeOnTransferTokens(address(taxToken), false, liquidity, amountUSDC, amountETH, address(owner), block.timestamp);

        assertEq(address(this).balance, initial_eth);
        assertEq(taxToken.balanceOf(address(this)), initial_usdc);
        assertEq(address(_pair).balance, pair_initial_eth);
        assertEq(taxToken.balanceOf(address(_pair)), pair_initial_usdc);
    }


    function testRouterPairGetAmountsOutAndSwapExactTokensForETH() public {
        router2AddLiquidityETHOwner2();

        Router.route[] memory routes = new Router.route[](1);
        routes[0] = Router.route(address(taxToken), address(WETH), false);

        assertEq(router2.getAmountsOut(TAX_TOKEN_1, routes)[1], _pair.getAmountOut(TAX_TOKEN_1, address(taxToken)));

        uint256[] memory expectedOutput = router2.getAmountsOut(TAX_TOKEN_1, routes);
        taxToken.approve(address(router2), TAX_TOKEN_1);
        router2.swapExactTokensForETHSupportingFeeOnTransferTokens(TAX_TOKEN_1, 0, routes, address(owner), block.timestamp);
    }

    function testRouterPairGetAmountsOutAndSwapExactETHForTokens() public {
        router2AddLiquidityETHOwner2();

        Router.route[] memory routes = new Router.route[](1);
        routes[0] = Router.route(address(WETH), address(taxToken), false);

        assertEq(router2.getAmountsOut(TOKEN_1, routes)[1], _pair.getAmountOut(TOKEN_1, address(WETH)));

        uint256[] memory expectedOutput = router2.getAmountsOut(TOKEN_1, routes);
        taxToken.approve(address(router2), TOKEN_1);
        router2.swapExactETHForTokensSupportingFeeOnTransferTokens{value: TOKEN_1}(expectedOutput[1], routes, address(owner), block.timestamp);

    }

}
