// SPDX-License-Identifier: GPL-3.0

/// @title Minter for ERC721DAOToken, selling tokens at a fixed price.

pragma solidity ^0.8.6;

import { ERC721Minter } from "./ERC721Minter.sol";

contract FixedPriceMinter is ERC721Minter {
    uint256 public maxTokens;
    uint256 public tokenPrice;
    uint256 public nextTokenId;
    uint256 public maxMintsPerTx;

    function init(
        uint256 maxTokens_,
        uint256 tokenPrice_,
        uint256 maxMintsPerTx_
    ) public onlyRole(CREATOR_ROLE) {
        maxTokens = maxTokens_;
        tokenPrice = tokenPrice_;
        maxMintsPerTx = maxMintsPerTx_;
        nextTokenId = 1;
    }

    function mint(uint256 amount) external payable whenNotPaused afterStartingBlock {
        require(amount <= maxMintsPerTx, "FixedPriceMinter: There is a limit on minting too many at a time!");

        require(msg.value >= tokenPrice * amount, "FixedPriceMinter: not enough ether sent!");
        // TODO do we want to enforce no contracts?
        require(_msgSender() == tx.origin, "FixedPriceMinter: No contracts!");

        mintBatch(_msgSender(), amount);
    }

    function mintBatch(address to, uint256 amount) private {
        require(nextTokenId - 1 + amount <= maxTokens, "FixedPriceMinter: Minting this many would exceed supply!");

        for (uint256 i = 0; i < amount; i++) {
            token.mint(to, nextTokenId++);
        }
    }

    function ownerMint(address to, uint256 amount) external onlyRole(CREATOR_ROLE) {
        mintBatch(to, amount);
    }
}
