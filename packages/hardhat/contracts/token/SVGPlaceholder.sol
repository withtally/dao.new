// SPDX-License-Identifier: MIT

/// @title Placeholder SVG for NFTs without a baseURI

pragma solidity ^0.8.6;

import { Base64 } from "base64-sol/base64.sol";
import { ITokenURIDescriptor } from "./ITokenURIDescriptor.sol";
import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";

contract SVGPlaceholder is ITokenURIDescriptor {
    using StringsUpgradeable for uint256;

    function tokenURI(
        uint256 tokenId,
        string calldata name,
        string calldata, // symbol,
        string calldata bgImageURI
    ) external pure override returns (string memory) {
        string memory text = string(abi.encodePacked(name, " token #", tokenId.toString()));
        string memory description = string(abi.encodePacked("Placeholder art for ", text));
        string[4] memory parts;
        parts[0] = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">';

        if (bytes(bgImageURI).length > 0) {
            parts[1] = string(abi.encodePacked('<image width="100%" height="100%" href="', bgImageURI, '"/>'));
        } else {
            parts[1] = "";
        }

        parts[2] = string(abi.encodePacked('<text x="10" y="20">', text, "</text>"));
        parts[3] = "</svg>";
        string memory svg = string(abi.encodePacked(parts[0], parts[1], parts[2], parts[3]));
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        text,
                        '", "description": "',
                        description,
                        '", "image": "data:image/svg+xml;base64,',
                        Base64.encode(bytes(svg)),
                        '"}'
                    )
                )
            )
        );
        string memory output = string(abi.encodePacked("data:application/json;base64,", json));
        return output;
    }
}
