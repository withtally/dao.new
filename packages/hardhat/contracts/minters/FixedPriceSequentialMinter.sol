// SPDX-License-Identifier: GPL-3.0

/// @title Minter for ERC721DAOToken, selling tokens at a fixed price.

pragma solidity ^0.8.6;

import { FixedPriceFixedSupplyMinter } from "./FixedPriceFixedSupplyMinter.sol";

contract FixedPriceSequentialMinter is FixedPriceFixedSupplyMinter {
    uint256 public maxMintsPerTx;
    uint256 public nextTokenId;

    // this is expected to be called as part of ERC721Minter's initialize function extraInitCallData_
    function init(
        uint256 maxTokens_,
        uint256 tokenPrice_,
        uint256 maxMintsPerTx_
    ) public initializer {
        __FixedPriceFixedSupplyMinter_init(maxTokens_, tokenPrice_);

        maxMintsPerTx = maxMintsPerTx_;
        nextTokenId = 1;
    }

    function mint(uint256 amount) external payable whenNotPaused afterStartingBlock senderPassesFilter {
        require(amount <= maxMintsPerTx, "FixedPriceSequentialMinter: There is a limit on minting too many at a time!");

        require(msg.value >= tokenPrice * amount, "FixedPriceSequentialMinter: not enough ether sent!");
        // TODO do we want to enforce no contracts?
        require(_msgSender() == tx.origin, "FixedPriceSequentialMinter: No contracts!");

        mintBatch(_msgSender(), amount);
    }

    function mintBatch(address to, uint256 amount) private {
        require(
            nextTokenId - 1 + amount <= maxTokens,
            "FixedPriceSequentialMinter: Minting this many would exceed supply!"
        );

        for (uint256 i = 0; i < amount; i++) {
            token.mint(to, nextTokenId++);
        }
    }

    function ownerMint(address to, uint256 amount) external onlyRole(CREATOR_ROLE) {
        require(!isOwnerMintLocked, "FixedPriceSequentialMinter: ownerMint is locked");
        mintBatch(to, amount);
    }
}
