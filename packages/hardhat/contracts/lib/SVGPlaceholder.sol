// SPDX-License-Identifier: GPL-3.0

/// @title Placeholder SVG for NFTs without a baseURI

pragma solidity ^0.8.6;

import { Base64 } from "base64-sol/base64.sol";

library SVGPlaceholder {
    function placeholderTokenUri(string memory tokenName, uint256 tokenId) public pure returns (string memory) {
        string memory tokenIdStr = toString(tokenId);
        string memory text = string(abi.encodePacked(tokenName, " token #", tokenIdStr));
        string[5] memory parts;
        parts[
            0
        ] = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350"><text x="10" y="20">';
        parts[1] = text;
        parts[2] = '</text><text x="11" y="21" style="fill: orange">';
        parts[3] = text;
        parts[4] = "</text></svg>";
        string memory svg = string(abi.encodePacked(parts[0], parts[1], parts[2], parts[3], parts[4]));
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        text,
                        '", "description": "Placeholder!", "image": "data:image/svg+xml;base64,',
                        Base64.encode(bytes(svg)),
                        '"}'
                    )
                )
            )
        );
        string memory output = string(abi.encodePacked("data:application/json;base64,", json));
        return output;
    }

    function toString(uint256 value) internal pure returns (string memory) {
        // Inspired by OraclizeAPI's implementation - MIT license
        // https://github.com/oraclize/ethereum-api/blob/b42146b063c7d6ee1358846c198246239e9360e8/oraclizeAPI_0.4.25.sol

        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}
