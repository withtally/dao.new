// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ContractFactory } from "ethers";
import { ethers } from "hardhat";
import {
  ERC721DAOToken__factory,
  ERC721Governor__factory,
  ERC721Timelock__factory,
  FixedPriceSequentialMinter__factory,
  Multicall__factory,
  ERC721DAODeployer__factory,
  ERC721DAODeployer,
  FixedPriceSpecificIDMinter__factory,
  RequiredNFTsMintingFilter__factory,
  RejectedNFTsMintingFilter__factory,
  CompositeMintingFilter__factory,
  SVGPlaceholder__factory,
} from "../typechain";

const SERVICE_FEE_ADDRESS = "0x4cce31b5E734934c62f0F411BaF53c2b3e14c3f4"; // TODO update this to DAO address

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const [deployer] = await ethers.getSigners();

  if ((await ethers.provider.getNetwork()).chainId == 1337) {
    // Deploy Multicall on localhost
    await deployContract(new Multicall__factory(deployer), "Multicall");
  }

  const tokenImpl = await deployContract(
    new ERC721DAOToken__factory(deployer),
    "ERC721DAOToken"
  );
  const timelockImpl = await deployContract(
    new ERC721Timelock__factory(deployer),
    "ERC721Timelock"
  );
  const governorImpl = await deployContract(
    new ERC721Governor__factory(deployer),
    "ERC721Governor"
  );

  await deployContract(new SVGPlaceholder__factory(deployer), "SVGPlaceholder");

  /*
   *  Minters
   */
  const simpleMinterImpl = await deployContract(
    new FixedPriceSequentialMinter__factory(deployer),
    "FixedPriceSequentialMinter"
  );
  const idMinterImpl = await deployContract(
    new FixedPriceSpecificIDMinter__factory(deployer),
    "FixedPriceSpecificIDMinter"
  );

  /*
   *  Minting Filters
   */
  const requiredNFTMintingFilter = await deployContract(
    new RequiredNFTsMintingFilter__factory(deployer),
    "RequiredNFTsMintingFilter"
  );
  const rejectedNFTsMintingFilter = await deployContract(
    new RejectedNFTsMintingFilter__factory(deployer),
    "RejectedNFTsMintingFilter"
  );
  const compositeMintingFilter = await deployContract(
    new CompositeMintingFilter__factory(deployer),
    "CompositeMintingFilter"
  );

  /*
   *  Deployer
   */
  const deployerContract = (await deployContract(
    new ERC721DAODeployer__factory(deployer),
    "ERC721DAODeployer"
  )) as ERC721DAODeployer;

  await deployerContract.initialize(
    tokenImpl.address,
    timelockImpl.address,
    governorImpl.address,
    [simpleMinterImpl.address, idMinterImpl.address],
    [
      requiredNFTMintingFilter.address,
      rejectedNFTsMintingFilter.address,
      compositeMintingFilter.address,
    ],
    SERVICE_FEE_ADDRESS
  );
}

async function deployContract(factory: ContractFactory, name: string) {
  const contract = await factory.deploy();
  await contract.deployed();
  console.log("%s deployed to: %s", name, contract.address);
  return contract;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
