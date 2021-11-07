// SPDX-License-Identifier: GPL-3.0

/// @title MintingFilter helps minter contracts make sure minting users meet certain criteria, like holding a certain NFT.

pragma solidity ^0.8.6;

import { Initializable } from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

abstract contract MintingFilter is Initializable {
    function meetsRequirements(address buyer) public virtual returns (bool);
}
