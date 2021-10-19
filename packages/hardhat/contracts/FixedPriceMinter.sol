// SPDX-License-Identifier: GPL-3.0

/// @title Minter for ERC721DAOToken, selling tokens at a fixed price.

pragma solidity ^0.8.6;
import { PaymentSplitterUpgradeable } from "@openzeppelin/contracts-upgradeable/finance/PaymentSplitterUpgradeable.sol";
import { ERC721DAOToken } from "./ERC721DAOToken.sol";

contract FixedPriceMinter is PaymentSplitterUpgradeable {
    ERC721DAOToken public token;
    uint256 public maxTokens = 10000;
    uint256 public tokenPrice = 69000000000000000; //0.069 ether
    uint256 public maxMintsPerTx = 10;
    uint256 public nextTokenId = 1;

    function initialize(
        ERC721DAOToken token_,
        uint256 maxTokens_,
        uint256 tokenPrice_,
        uint256 maxMintsPerTx_,
        address[] memory payees_,
        uint256[] memory shares_
    ) public initializer {
        __PaymentSplitter_init(payees_, shares_);

        token = token_;
        maxTokens = maxTokens_;
        tokenPrice = tokenPrice_;
        maxMintsPerTx = maxMintsPerTx_;
    }

    function mint(uint256 quantity) external payable {
        // TODO maybe add a startingBlock config
        // require(block.number >= startingBlock, "Sale hasn't started yet!");

        require(quantity <= maxMintsPerTx, "FixedPriceMinter: There is a limit on minting too many at a time!");

        require(nextTokenId - 1 + quantity <= maxTokens, "FixedPriceMinter: Minting this many would exceed supply!");

        require(msg.value >= tokenPrice * quantity, "FixedPriceMinter: not enough ether sent!");

        // TODO do we want to enforce no contracts?
        require(_msgSender() == tx.origin, "FixedPriceMinter: No contracts!");

        for (uint256 i = 0; i < quantity; i++) {
            token.mint(_msgSender(), nextTokenId++);
        }
    }
}
