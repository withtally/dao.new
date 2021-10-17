// SPDX-License-Identifier: GPL-3.0

/// @title ERC-721 token for DAOs.

pragma solidity ^0.8.6;

import "./ERC721CheckpointableUpgradable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";

contract ERC721DAOToken is
    ERC721CheckpointableUpgradable,
    AccessControlEnumerableUpgradeable
{
    event BaseURIChanged(string newURI);
    event ContractInfoFilenameChanged(string newFilename);

    string public baseURI = "";
    string private contractInfoFilename = "project.json";


    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(
            ERC721EnumerableUpgradeable,
            AccessControlEnumerableUpgradeable
        )
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function mint(address to, uint256 tokenId) public {
        _mint(to, tokenId);
    }

    /**
     * @notice Should be an IPFS link to the project folder, which should contain everything the
     * project needs, including:
     * - the project metadata JSON, e.g. ipfs://QmZi1n79FqWt2tTLwCqiy6nLM6xLGRsEPQ5JmReJQKNNzX
     * - all the asset descriptors and media files
     */
    function setBaseURI(string memory baseURI_) public {
        baseURI = baseURI_;
        emit BaseURIChanged(baseURI_);
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function setContractInfoFilename(string memory contractInfoFilename_) public {
        contractInfoFilename = contractInfoFilename_;
        emit ContractInfoFilenameChanged(contractInfoFilename_);
    }

    /**
     * @notice The IPFS URI of the project's metadata.
     */
    function contractInfoURI() public view returns (string memory) {
        return string(abi.encodePacked(baseURI, contractInfoFilename));
    }
}
