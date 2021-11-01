// SPDX-License-Identifier: GPL-3.0

/// @title Minter for ERC721DAOToken, selling tokens at a fixed price, allowing minters to choose specific IDs.

pragma solidity ^0.8.6;

import { IERC721Minter } from "./IERC721Minter.sol";

contract FixedPriceSpecificIDMinter is IERC721Minter {
    uint256 public maxTokens;
    uint256 public tokenPrice;

    function init(uint256 maxTokens_, uint256 tokenPrice_) public onlyRole(CREATOR_ROLE) {
        maxTokens = maxTokens_;
        tokenPrice = tokenPrice_;
    }

    function mint(uint256 tokenId) external payable whenNotPaused afterStartingBlock {
        require(msg.value >= tokenPrice, "FixedPriceSpecificIDMinter: not enough ether sent!");

        // TODO do we want to enforce no contracts?
        require(_msgSender() == tx.origin, "FixedPriceSpecificIDMinter: No contracts!");

        _mint(_msgSender(), tokenId);
    }

    function ownerMint(address to, uint256 tokenId) external onlyRole(CREATOR_ROLE) {
        _mint(to, tokenId);
    }

    function _mint(address to, uint256 tokenId) private {
        require(
            token.totalSupply() + 1 <= maxTokens,
            "FixedPriceSpecificIDMinter: Minting this many would exceed supply!"
        );

        token.mint(to, tokenId);
    }
}
