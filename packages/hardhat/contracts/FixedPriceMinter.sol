// SPDX-License-Identifier: GPL-3.0

/// @title Minter for ERC721DAOToken, selling tokens at a fixed price.

pragma solidity ^0.8.6;
import { PaymentSplitterUpgradeable } from "@openzeppelin/contracts-upgradeable/finance/PaymentSplitterUpgradeable.sol";
import { ERC721DAOToken } from "./ERC721DAOToken.sol";
import { OwnableUpgradeable } from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract FixedPriceMinter is PaymentSplitterUpgradeable, OwnableUpgradeable {
    ERC721DAOToken public token;
    uint256 public maxTokens;
    uint256 public tokenPrice;
    uint256 public maxMintsPerTx;
    uint256 public startingBlock;
    uint256 public nextTokenId;
    bool public saleActive = false;

    function initialize(
        ERC721DAOToken token_,
        uint256 maxTokens_,
        uint256 tokenPrice_,
        uint256 maxMintsPerTx_,
        uint256 startingBlock_,
        address[] memory payees_,
        uint256[] memory shares_
    ) public initializer {
        __PaymentSplitter_init(payees_, shares_);
        __Ownable_init();

        token = token_;
        maxTokens = maxTokens_;
        tokenPrice = tokenPrice_;
        maxMintsPerTx = maxMintsPerTx_;
        startingBlock = startingBlock_;

        nextTokenId = 1;
    }

    function mint(uint256 amount) external payable {
        require(block.number >= startingBlock, "FixedPriceMinter: Sale hasn't started yet!");

        require(saleActive, "FixedPriceMinter: sale is not active");

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

    function setSaleActive(bool isActive) external onlyOwner {
        saleActive = isActive;
    }

    function ownerMint(address to, uint256 amount) external onlyOwner {
        mintBatch(to, amount);
    }

    function setStartingBlock(uint256 startingBlock_) external onlyOwner {
        startingBlock = startingBlock_;
    }
}
