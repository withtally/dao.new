// SPDX-License-Identifier: GPL-3.0

/// @title NFTHolderMintingFilter is a MintingFilter that enforces requirements of owning specific NFT tokens with minimal balances.

pragma solidity ^0.8.6;

import { MintingFilter } from "./MintingFilter.sol";
import { IERC721 } from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract RequiredNFTsMintingFilter is MintingFilter {
    struct TokenFilter {
        IERC721 token;
        uint256 minBalance;
    }

    TokenFilter[] public tokenFilters;

    function initialize(IERC721[] memory tokens, uint256[] memory minBalances) public initializer {
        require(
            tokens.length == minBalances.length,
            "RequiredNFTsMintingFilter: tokens and minBalances arity mismatch"
        );

        for (uint256 i = 0; i < tokens.length; i++) {
            tokenFilters.push(TokenFilter(tokens[i], minBalances[i]));
        }
    }

    function meetsRequirements(address buyer) public view override returns (bool) {
        for (uint256 i = 0; i < tokenFilters.length; i++) {
            TokenFilter storage filter = tokenFilters[i];
            if (filter.token.balanceOf(buyer) < filter.minBalance) {
                return false;
            }
        }
        return true;
    }
}
